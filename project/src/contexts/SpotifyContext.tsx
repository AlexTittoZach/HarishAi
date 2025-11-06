import { createContext, useState, useEffect, useContext, ReactNode } from 'react';

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    name: string;
    images: { url: string }[];
  };
  preview_url: string | null;
  external_urls: {
    spotify: string;
  };
}

interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: { url: string }[];
  tracks: {
    total: number;
  };
  external_urls: {
    spotify: string;
  };
}

interface SpotifyContextType {
  isAuthenticated: boolean;
  accessToken: string | null;
  user: any;
  authError: string | null;
  login: () => void;
  logout: () => void;
  searchTracks: (query: string) => Promise<SpotifyTrack[]>;
  getRecommendations: (seedGenres: string[], targetValence?: number, targetEnergy?: number, mood?: number) => Promise<SpotifyTrack[]>;
  getMoodPlaylists: (mood: number) => Promise<SpotifyPlaylist[]>;
  createPlaylist: (name: string, description: string, trackUris: string[]) => Promise<string | null>;
}

const SpotifyContext = createContext<SpotifyContextType>({
  isAuthenticated: false,
  accessToken: null,
  user: null,
  authError: null,
  login: () => {},
  logout: () => {},
  searchTracks: async () => [],
  getRecommendations: async () => [],
  getMoodPlaylists: async () => [],
  createPlaylist: async () => null,
});

export const useSpotify = () => useContext(SpotifyContext);

// Spotify API configuration - Get from environment or use defaults
const getClientId = () => {
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
  return clientId && clientId !== 'your_spotify_client_id_here' && clientId !== 'your_actual_client_id_here' ? clientId : '';
};

const getRedirectUri = () => {
  const envUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
  if (envUri && envUri !== 'your_redirect_uri_here') {
    return envUri;
  }
  // Fallback to current origin
  return window.location.origin;
};

const CLIENT_ID = getClientId();
const REDIRECT_URI = getRedirectUri();
const SCOPES = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-modify-public',
  'playlist-modify-private',
  'user-library-read',
  'user-top-read'
].join(' ');

// PKCE helper functions
const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return values.reduce((acc, x) => acc + possible[x % possible.length], '');
};

const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest('SHA-256', data);
};

const base64encode = (input: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(input)))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
};

export const SpotifyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    // Check for authorization code in URL (after redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const error = urlParams.get('error');
    const state = urlParams.get('state');
    
    if (error) {
      console.error('Spotify auth error:', error);
      let errorMessage = 'Authentication failed';
      
      switch (error) {
        case 'invalid_client':
          errorMessage = 'Invalid Client ID. Please check your Spotify app configuration.';
          break;
        case 'invalid_request':
          errorMessage = 'Invalid request. Please check your redirect URI in Spotify app settings.';
          break;
        case 'unauthorized_client':
          errorMessage = 'Unauthorized client. Make sure "Authorization Code with PKCE" is enabled in your Spotify app.';
          break;
        case 'access_denied':
          errorMessage = 'Access denied. You need to grant permission to connect your Spotify account.';
          break;
        case 'unsupported_response_type':
          errorMessage = 'Unsupported response type. Make sure "Implicit Grant" is disabled in your Spotify app settings.';
          break;
        default:
          errorMessage = `Authentication failed: ${error}`;
      }
      
      setAuthError(errorMessage);
      // Clear the URL parameters
      window.history.replaceState(null, '', window.location.pathname);
      return;
    }

    if (code) {
      // Verify state parameter
      const storedState = localStorage.getItem('spotify_auth_state');
      if (state !== storedState) {
        setAuthError('Authentication failed: Invalid state parameter. This could be a security issue.');
        window.history.replaceState(null, '', window.location.pathname);
        return;
      }

      // Exchange code for access token
      exchangeCodeForToken(code);
      // Clear the URL parameters
      window.history.replaceState(null, '', window.location.pathname);
    } else {
      // Check for stored token
      const storedToken = localStorage.getItem('spotify_access_token');
      const tokenExpiry = localStorage.getItem('spotify_token_expiry');
      
      if (storedToken && tokenExpiry) {
        const now = Date.now();
        if (now < parseInt(tokenExpiry)) {
          setAccessToken(storedToken);
          fetchUserProfile(storedToken);
        } else {
          // Token expired, try to refresh
          const refreshToken = localStorage.getItem('spotify_refresh_token');
          if (refreshToken) {
            refreshAccessToken(refreshToken);
          } else {
            logout();
          }
        }
      }
    }
  }, []);

  const exchangeCodeForToken = async (code: string) => {
    try {
      const codeVerifier = localStorage.getItem('spotify_code_verifier');
      if (!codeVerifier) {
        throw new Error('Code verifier not found. Please try logging in again.');
      }

      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: REDIRECT_URI,
          code_verifier: codeVerifier,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        let errorMessage = 'Failed to exchange code for token';
        
        switch (errorData.error) {
          case 'invalid_grant':
            errorMessage = 'Invalid authorization code. Please try connecting again.';
            break;
          case 'invalid_client':
            errorMessage = 'Invalid Client ID. Please check your Spotify app configuration.';
            break;
          case 'invalid_request':
            errorMessage = 'Invalid request. Please check your redirect URI matches exactly in Spotify app settings.';
            break;
          default:
            errorMessage = errorData.error_description || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      const data = await response.json();
      
      setAccessToken(data.access_token);
      localStorage.setItem('spotify_access_token', data.access_token);
      localStorage.setItem('spotify_token_expiry', (Date.now() + data.expires_in * 1000).toString());
      
      if (data.refresh_token) {
        localStorage.setItem('spotify_refresh_token', data.refresh_token);
      }
      
      // Clean up PKCE data
      localStorage.removeItem('spotify_code_verifier');
      localStorage.removeItem('spotify_auth_state');
      
      setAuthError(null);
      fetchUserProfile(data.access_token);
    } catch (error) {
      console.error('Error exchanging code for token:', error);
      setAuthError(`Failed to complete authentication: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const refreshAccessToken = async (refreshToken: string) => {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await response.json();
      
      setAccessToken(data.access_token);
      localStorage.setItem('spotify_access_token', data.access_token);
      localStorage.setItem('spotify_token_expiry', (Date.now() + data.expires_in * 1000).toString());
      
      if (data.refresh_token) {
        localStorage.setItem('spotify_refresh_token', data.refresh_token);
      }
      
      setAuthError(null);
      fetchUserProfile(data.access_token);
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
    }
  };

  const fetchUserProfile = async (token: string) => {
    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        setIsAuthenticated(true);
        setAuthError(null);
      } else {
        // Token might be expired
        console.error('Failed to fetch user profile:', response.status);
        if (response.status === 401) {
          setAuthError('Your Spotify session has expired. Please reconnect.');
        }
        logout();
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setAuthError('Failed to connect to Spotify. Please try again.');
      logout();
    }
  };

  const login = async () => {
    if (!CLIENT_ID) {
      setAuthError('Spotify integration is not configured. Please add your Client ID to the environment variables.');
      return;
    }

    try {
      // Clear any existing errors
      setAuthError(null);

      // Generate PKCE parameters
      const codeVerifier = generateRandomString(64);
      const hashed = await sha256(codeVerifier);
      const codeChallenge = base64encode(hashed);
      const state = generateRandomString(16);

      // Store PKCE parameters
      localStorage.setItem('spotify_code_verifier', codeVerifier);
      localStorage.setItem('spotify_auth_state', state);

      const authUrl = new URL('https://accounts.spotify.com/authorize');
      authUrl.searchParams.append('client_id', CLIENT_ID);
      authUrl.searchParams.append('response_type', 'code');
      authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
      authUrl.searchParams.append('scope', SCOPES);
      authUrl.searchParams.append('code_challenge_method', 'S256');
      authUrl.searchParams.append('code_challenge', codeChallenge);
      authUrl.searchParams.append('state', state);

      console.log('Redirecting to Spotify with:', {
        client_id: CLIENT_ID,
        redirect_uri: REDIRECT_URI,
        state: state
      });

      window.location.href = authUrl.toString();
    } catch (error) {
      console.error('Error initiating login:', error);
      setAuthError('Failed to initiate Spotify login. Please try again.');
    }
  };

  const logout = () => {
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    setAuthError(null);
    localStorage.removeItem('spotify_access_token');
    localStorage.removeItem('spotify_refresh_token');
    localStorage.removeItem('spotify_token_expiry');
    localStorage.removeItem('spotify_code_verifier');
    localStorage.removeItem('spotify_auth_state');
  };

  const makeSpotifyRequest = async (endpoint: string, options: RequestInit = {}) => {
    if (!accessToken) throw new Error('No access token available');

    const response = await fetch(`https://api.spotify.com/v1${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Try to refresh token
        const refreshToken = localStorage.getItem('spotify_refresh_token');
        if (refreshToken) {
          await refreshAccessToken(refreshToken);
          // Retry the request with new token
          return fetch(`https://api.spotify.com/v1${endpoint}`, {
            ...options,
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
              ...options.headers,
            },
          });
        } else {
          setAuthError('Your Spotify session has expired. Please reconnect.');
          logout();
          throw new Error('Authentication expired');
        }
      }
      throw new Error(`Spotify API error: ${response.status}`);
    }

    return response.json();
  };

  const searchTracks = async (query: string): Promise<SpotifyTrack[]> => {
    try {
      const data = await makeSpotifyRequest(`/search?q=${encodeURIComponent(query)}&type=track&limit=20`);
      return data.tracks.items;
    } catch (error) {
      console.error('Error searching tracks:', error);
      return [];
    }
  };

  const getRecommendations = async (
    seedGenres: string[], 
    targetValence?: number, 
    targetEnergy?: number,
    mood?: number
  ): Promise<SpotifyTrack[]> => {
    try {
      // First, get available genres to ensure we use valid ones
      const genresData = await makeSpotifyRequest('/recommendations/available-genre-seeds');
      const availableGenres = genresData.genres;
      
      // Filter seed genres to only include available ones
      const validGenres = seedGenres.filter(genre => availableGenres.includes(genre));
      
      // If no valid genres, use mood-specific fallbacks
      if (validGenres.length === 0) {
        const moodGenreFallbacks = {
          1: ['ambient', 'classical', 'chill'],
          2: ['indie', 'folk', 'acoustic'],
          3: ['chill', 'lo-fi', 'ambient'],
          4: ['pop', 'indie-pop', 'alternative'],
          5: ['dance', 'pop', 'electronic']
        };
        
        const fallbackGenres = moodGenreFallbacks[mood as keyof typeof moodGenreFallbacks] || ['pop', 'indie', 'chill'];
        validGenres.push(...fallbackGenres.filter(genre => availableGenres.includes(genre)));
      }
      
      // If still no valid genres, use common ones
      if (validGenres.length === 0) {
        validGenres.push(...['pop', 'indie', 'chill'].filter(genre => availableGenres.includes(genre)));
      }
      
      // Limit to 5 genres max (Spotify API limit)
      const limitedGenres = validGenres.slice(0, 5);

      const params = new URLSearchParams({
        seed_genres: limitedGenres.join(','),
        limit: '20',
      });

      if (targetValence !== undefined) {
        params.append('target_valence', targetValence.toString());
      }
      if (targetEnergy !== undefined) {
        params.append('target_energy', targetEnergy.toString());
      }

      console.log('Getting recommendations with params:', params.toString());
      const data = await makeSpotifyRequest(`/recommendations?${params}`);
      console.log('Recommendations response:', data);
      
      return data.tracks || [];
    } catch (error) {
      console.error('Error getting recommendations:', error);
      
      // Fallback: try to search for mood-based tracks
      try {
        const moodQueries = {
          1: 'sad melancholy healing therapy',
          2: 'calm peaceful acoustic indie',
          3: 'chill lo-fi focus ambient',
          4: 'happy upbeat positive feel good',
          5: 'energetic dance motivation celebration'
        };
        
        const fallbackQuery = moodQueries[mood as keyof typeof moodQueries] || 'chill music';
        console.log('Falling back to search with query:', fallbackQuery);
        return await searchTracks(fallbackQuery);
      } catch (fallbackError) {
        console.error('Fallback search also failed:', fallbackError);
        return [];
      }
    }
  };

  const getMoodPlaylists = async (mood: number): Promise<SpotifyPlaylist[]> => {
    try {
      const moodQueries = {
        1: 'sad melancholy depression healing therapy',
        2: 'calm peaceful relaxing acoustic indie',
        3: 'chill ambient focus study lo-fi',
        4: 'happy upbeat positive feel good',
        5: 'energetic dance motivation celebration party'
      };

      const query = moodQueries[mood as keyof typeof moodQueries] || 'relaxing';
      console.log('Searching playlists with query:', query);
      
      const data = await makeSpotifyRequest(`/search?q=${encodeURIComponent(query)}&type=playlist&limit=10`);
      console.log('Playlists response:', data);
      
      return data.playlists?.items || [];
    } catch (error) {
      console.error('Error getting mood playlists:', error);
      return [];
    }
  };

  const createPlaylist = async (name: string, description: string, trackUris: string[]): Promise<string | null> => {
    try {
      if (!user) return null;

      // Create playlist
      const playlistData = await makeSpotifyRequest(`/users/${user.id}/playlists`, {
        method: 'POST',
        body: JSON.stringify({
          name,
          description,
          public: false
        })
      });

      // Add tracks to playlist
      if (trackUris.length > 0) {
        await makeSpotifyRequest(`/playlists/${playlistData.id}/tracks`, {
          method: 'POST',
          body: JSON.stringify({
            uris: trackUris
          })
        });
      }

      return playlistData.id;
    } catch (error) {
      console.error('Error creating playlist:', error);
      return null;
    }
  };

  return (
    <SpotifyContext.Provider
      value={{
        isAuthenticated,
        accessToken,
        user,
        authError,
        login,
        logout,
        searchTracks,
        getRecommendations,
        getMoodPlaylists,
        createPlaylist,
      }}
    >
      {children}
    </SpotifyContext.Provider>
  );
};