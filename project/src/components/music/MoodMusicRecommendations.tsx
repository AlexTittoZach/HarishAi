import { useState, useEffect } from 'react';
import { useSpotify } from '../../contexts/SpotifyContext';
import MusicPlayer from './MusicPlayer';
import { Music, Play, ExternalLink, Plus, Heart, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Track {
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

interface Playlist {
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

interface MoodMusicRecommendationsProps {
  mood: number;
  onClose?: () => void;
}

const MoodMusicRecommendations: React.FC<MoodMusicRecommendationsProps> = ({ mood, onClose }) => {
  const { isAuthenticated, getRecommendations, getMoodPlaylists, createPlaylist, authError } = useSpotify();
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'recommendations' | 'playlists'>('recommendations');
  const [savedTracks, setSavedTracks] = useState<Set<string>>(new Set());

  const moodConfig = {
    1: {
      name: 'Very Sad',
      genres: ['ambient', 'classical', 'chill'],
      valence: 0.1,
      energy: 0.2,
      color: 'text-red-500',
      description: 'Gentle, soothing music to help process difficult emotions',
      searchTerms: ['sad', 'melancholy', 'healing', 'comfort']
    },
    2: {
      name: 'Down',
      genres: ['indie', 'folk', 'acoustic'],
      valence: 0.3,
      energy: 0.3,
      color: 'text-orange-500',
      description: 'Calming melodies to provide comfort and understanding',
      searchTerms: ['calm', 'peaceful', 'acoustic', 'indie']
    },
    3: {
      name: 'Neutral',
      genres: ['chill', 'lo-fi', 'ambient'],
      valence: 0.5,
      energy: 0.4,
      color: 'text-yellow-500',
      description: 'Balanced music for focus and relaxation',
      searchTerms: ['chill', 'lo-fi', 'focus', 'study']
    },
    4: {
      name: 'Good',
      genres: ['pop', 'indie-pop', 'alternative'],
      valence: 0.7,
      energy: 0.6,
      color: 'text-green-500',
      description: 'Uplifting tunes to enhance your positive mood',
      searchTerms: ['happy', 'upbeat', 'positive', 'feel good']
    },
    5: {
      name: 'Excellent',
      genres: ['dance', 'pop', 'electronic'],
      valence: 0.9,
      energy: 0.8,
      color: 'text-primary-500',
      description: 'Energetic music to celebrate and amplify your joy',
      searchTerms: ['energetic', 'dance', 'celebration', 'motivation']
    }
  };

  const currentMoodConfig = moodConfig[mood as keyof typeof moodConfig];

  useEffect(() => {
    if (isAuthenticated && !authError) {
      loadMusicRecommendations();
    }
  }, [mood, isAuthenticated, authError]);

  const loadMusicRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Loading music recommendations for mood:', mood, currentMoodConfig);
      
      // Try to get recommendations first with mood parameter
      let recommendedTracks: Track[] = [];
      try {
        recommendedTracks = await getRecommendations(
          currentMoodConfig.genres,
          currentMoodConfig.valence,
          currentMoodConfig.energy,
          mood // Pass mood to the function
        );
        console.log('Got recommendations:', recommendedTracks.length);
      } catch (recError) {
        console.warn('Recommendations failed, will try playlists:', recError);
      }

      // Get mood playlists
      let moodPlaylists: Playlist[] = [];
      try {
        moodPlaylists = await getMoodPlaylists(mood);
        console.log('Got playlists:', moodPlaylists.length);
      } catch (playlistError) {
        console.warn('Playlists failed:', playlistError);
      }

      // If we have no recommendations but have playlists, try to get tracks from the first playlist
      if (recommendedTracks.length === 0 && moodPlaylists.length > 0) {
        try {
          const firstPlaylist = moodPlaylists[0];
          const playlistTracks = await getPlaylistTracks(firstPlaylist.id);
          recommendedTracks = playlistTracks.slice(0, 20); // Limit to 20 tracks
          console.log('Got tracks from playlist:', recommendedTracks.length);
        } catch (playlistTracksError) {
          console.warn('Failed to get playlist tracks:', playlistTracksError);
        }
      }

      setTracks(recommendedTracks);
      setPlaylists(moodPlaylists);

      if (recommendedTracks.length === 0 && moodPlaylists.length === 0) {
        setError(`No music recommendations found for ${currentMoodConfig.name.toLowerCase()} mood. This might be due to Spotify API limitations or your music preferences.`);
      }
    } catch (error) {
      console.error('Error loading music recommendations:', error);
      setError(`Failed to load music recommendations: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const getPlaylistTracks = async (playlistId: string): Promise<Track[]> => {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('spotify_access_token')}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch playlist tracks: ${response.status}`);
    }

    const data = await response.json();
    return data.items
      .filter((item: any) => item.track && item.track.type === 'track')
      .map((item: any) => item.track);
  };

  const handleTrackChange = (index: number) => {
    setCurrentTrackIndex(index);
  };

  const handleSaveTrack = (trackId: string) => {
    setSavedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
  };

  const handleCreateMoodPlaylist = async () => {
    if (savedTracks.size === 0) return;

    const savedTrackUris = tracks
      .filter(track => savedTracks.has(track.id))
      .map(track => `spotify:track:${track.id}`);

    const playlistName = `${currentMoodConfig.name} Mood - ${new Date().toLocaleDateString()}`;
    const description = `Music therapy playlist for ${currentMoodConfig.name.toLowerCase()} mood, created by HarishAI`;

    try {
      const playlistId = await createPlaylist(playlistName, description, savedTrackUris);
      if (playlistId) {
        alert('Playlist created successfully!');
        setSavedTracks(new Set());
      }
    } catch (error) {
      console.error('Error creating playlist:', error);
      alert('Failed to create playlist. Please try again.');
    }
  };

  const handleRetry = () => {
    loadMusicRecommendations();
  };

  if (!isAuthenticated) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft p-6 text-center">
        <Music size={48} className="mx-auto mb-4 text-primary-500" />
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-2">
          Connect to Spotify
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          Connect your Spotify account to get personalized music therapy recommendations based on your mood.
        </p>
        <button
          onClick={() => window.open('/settings', '_blank')}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
        >
          Connect Spotify
        </button>
      </div>
    );
  }

  if (authError) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft p-6 text-center">
        <AlertCircle size={48} className="mx-auto mb-4 text-red-500" />
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-2">
          Spotify Connection Error
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4">
          {authError}
        </p>
        <button
          onClick={() => window.open('/settings', '_blank')}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
        >
          Fix Connection
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex space-x-3">
                <div className="w-12 h-12 bg-neutral-200 dark:bg-neutral-700 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4"></div>
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft p-6 text-center">
        <AlertCircle size={48} className="mx-auto mb-4 text-orange-500" />
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-2">
          Unable to Load Music
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400 mb-4 text-sm">
          {error}
        </p>
        <div className="flex justify-center space-x-3">
          <button
            onClick={handleRetry}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium flex items-center space-x-2"
          >
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
          <button
            onClick={() => window.open('/settings', '_blank')}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700"
          >
            Check Settings
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-neutral-800 dark:text-white flex items-center">
            <Music className={`mr-2 ${currentMoodConfig.color}`} size={24} />
            Music for {currentMoodConfig.name} Mood
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 text-2xl leading-none"
            >
              ×
            </button>
          )}
        </div>
        <p className="text-neutral-600 dark:text-neutral-400 text-sm">
          {currentMoodConfig.description}
        </p>
        
        {/* Show current mood parameters for debugging */}
        <div className="mt-2 text-xs text-neutral-500 dark:text-neutral-400">
          Mood {mood}: Valence {currentMoodConfig.valence}, Energy {currentMoodConfig.energy}, Genres: {currentMoodConfig.genres.join(', ')}
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft">
        <div className="flex border-b border-neutral-200 dark:border-neutral-700">
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'recommendations'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Recommendations ({tracks.length})
          </button>
          <button
            onClick={() => setActiveTab('playlists')}
            className={`flex-1 px-4 py-3 text-sm font-medium ${
              activeTab === 'playlists'
                ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500'
                : 'text-neutral-600 dark:text-neutral-400'
            }`}
          >
            Playlists ({playlists.length})
          </button>
        </div>

        <div className="p-4">
          {activeTab === 'recommendations' && (
            <div>
              {savedTracks.size > 0 && (
                <div className="mb-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-between">
                  <span className="text-sm text-primary-700 dark:text-primary-400">
                    {savedTracks.size} tracks selected
                  </span>
                  <button
                    onClick={handleCreateMoodPlaylist}
                    className="px-3 py-1 bg-primary-500 hover:bg-primary-600 text-white rounded text-sm flex items-center"
                  >
                    <Plus size={14} className="mr-1" />
                    Create Playlist
                  </button>
                </div>
              )}

              {tracks.length === 0 ? (
                <div className="text-center py-8">
                  <Music size={48} className="mx-auto mb-4 text-neutral-400" />
                  <p className="text-neutral-600 dark:text-neutral-400">
                    No track recommendations available for {currentMoodConfig.name.toLowerCase()} mood.
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-2">
                    Try checking the playlists tab or refreshing the recommendations.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {tracks.map((track, index) => (
                    <motion.div
                      key={track.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700"
                    >
                      <button
                        onClick={() => handleTrackChange(index)}
                        className="w-10 h-10 rounded bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center hover:bg-primary-100 dark:hover:bg-primary-900/30"
                      >
                        <Play size={14} className="text-neutral-600 dark:text-neutral-400 ml-0.5" />
                      </button>

                      <div className="w-10 h-10 rounded overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                        {track.album.images[0] && (
                          <img
                            src={track.album.images[0].url}
                            alt={track.album.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-800 dark:text-white truncate">
                          {track.name}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                          {track.artists.map(artist => artist.name).join(', ')}
                        </p>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSaveTrack(track.id)}
                          className={`p-1.5 rounded ${
                            savedTracks.has(track.id)
                              ? 'text-red-500 hover:text-red-600'
                              : 'text-neutral-400 hover:text-red-500'
                          }`}
                        >
                          <Heart size={16} fill={savedTracks.has(track.id) ? 'currentColor' : 'none'} />
                        </button>

                        <a
                          href={track.external_urls.spotify}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-neutral-400 hover:text-primary-500"
                        >
                          <ExternalLink size={16} />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'playlists' && (
            <div>
              {playlists.length === 0 ? (
                <div className="text-center py-8">
                  <Music size={48} className="mx-auto mb-4 text-neutral-400" />
                  <p className="text-neutral-600 dark:text-neutral-400">
                    No playlists found for {currentMoodConfig.name.toLowerCase()} mood.
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {playlists.map((playlist, index) => (
                    <motion.div
                      key={playlist.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700"
                    >
                      <div className="w-12 h-12 rounded overflow-hidden bg-neutral-200 dark:bg-neutral-700">
                        {playlist.images[0] && (
                          <img
                            src={playlist.images[0].url}
                            alt={playlist.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-neutral-800 dark:text-white truncate">
                          {playlist.name}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 truncate">
                          {playlist.tracks.total} tracks
                        </p>
                      </div>

                      <a
                        href={playlist.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white rounded text-sm flex items-center"
                      >
                        <ExternalLink size={14} className="mr-1" />
                        Open
                      </a>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Music Player */}
      {tracks.length > 0 && (
        <MusicPlayer
          tracks={tracks}
          currentTrackIndex={currentTrackIndex}
          onTrackChange={handleTrackChange}
        />
      )}
    </div>
  );
};

export default MoodMusicRecommendations;