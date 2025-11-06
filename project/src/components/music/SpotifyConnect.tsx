import { useSpotify } from '../../contexts/SpotifyContext';
import { Music, ExternalLink, User, LogOut, AlertCircle, Copy, Check, Settings, HelpCircle } from 'lucide-react';
import { useState } from 'react';
import SpotifySetupGuide from './SpotifySetupGuide';

const SpotifyConnect: React.FC = () => {
  const { isAuthenticated, user, authError, login, logout } = useSpotify();
  const [copied, setCopied] = useState(false);
  const [showSetupGuide, setShowSetupGuide] = useState(false);

  const currentUrl = window.location.origin;
  const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Show setup guide if no client ID is configured
  if (!clientId || clientId === 'your_spotify_client_id_here') {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
            <Settings size={20} className="text-yellow-600 dark:text-yellow-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-300">
              Spotify Setup Required
            </h3>
            <p className="text-sm text-yellow-600 dark:text-yellow-400">
              Follow our step-by-step guide to connect Spotify
            </p>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            To enable music therapy features, you need to create a Spotify app and configure it properly. 
            Don't worry - we'll guide you through every step!
          </p>
          
          <div className="flex space-x-3">
            <button
              onClick={() => setShowSetupGuide(true)}
              className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2"
            >
              <HelpCircle size={18} />
              <span>Start Setup Guide</span>
            </button>
            
            <a
              href="https://developer.spotify.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 border border-green-500 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center space-x-2"
            >
              <ExternalLink size={18} />
              <span>Spotify Dashboard</span>
            </a>
          </div>
        </div>

        {showSetupGuide && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <SpotifySetupGuide 
                currentUrl={currentUrl}
                onClose={() => setShowSetupGuide(false)}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (authError) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertCircle size={20} className="text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">
              Connection Failed
            </h3>
            <p className="text-sm text-red-600 dark:text-red-400">
              {authError}
            </p>
          </div>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <h4 className="font-medium text-red-800 dark:text-red-300 mb-3">
              🔧 Quick Fix Checklist:
            </h4>
            <div className="space-y-3 text-sm text-red-700 dark:text-red-400">
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 rounded border border-red-300 dark:border-red-600 flex items-center justify-center mt-0.5">
                  <span className="text-xs">1</span>
                </div>
                <div>
                  <strong>Check Redirect URI in Spotify app:</strong>
                  <div className="mt-1 flex items-center space-x-2 bg-white dark:bg-red-900/40 p-2 rounded">
                    <code className="flex-1 text-xs font-mono text-red-900 dark:text-red-200">
                      {currentUrl}
                    </code>
                    <button
                      onClick={() => copyToClipboard(currentUrl)}
                      className="p-1 text-red-600 hover:text-red-800 dark:hover:text-red-200"
                      title="Copy URL"
                    >
                      {copied ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 rounded border border-red-300 dark:border-red-600 flex items-center justify-center mt-0.5">
                  <span className="text-xs">2</span>
                </div>
                <div>
                  <strong>Verify Authentication Settings:</strong>
                  <div className="mt-1 space-y-1">
                    <div className="flex items-center space-x-2">
                      <Check size={14} className="text-green-500" />
                      <span>Authorization Code with PKCE: Enabled</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-3.5 h-3.5 border border-red-500 rounded"></span>
                      <span>Implicit Grant: Disabled</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <div className="w-5 h-5 rounded border border-red-300 dark:border-red-600 flex items-center justify-center mt-0.5">
                  <span className="text-xs">3</span>
                </div>
                <div>
                  <strong>Save settings and try again</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-3">
          <button
            onClick={login}
            className="flex-1 px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2"
          >
            <Music size={18} />
            <span>Try Again</span>
          </button>
          
          <button
            onClick={() => setShowSetupGuide(true)}
            className="px-4 py-3 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700"
          >
            Setup Guide
          </button>
          
          <a
            href="https://developer.spotify.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-3 border border-green-500 text-green-600 dark:text-green-400 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 flex items-center space-x-2"
          >
            <ExternalLink size={16} />
            <span>Fix Settings</span>
          </a>
        </div>
        
        {showSetupGuide && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <SpotifySetupGuide 
                currentUrl={currentUrl}
                onClose={() => setShowSetupGuide(false)}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  if (isAuthenticated && user) {
    return (
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
              {user.images && user.images[0] ? (
                <img
                  src={user.images[0].url}
                  alt={user.display_name}
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <User size={20} className="text-white" />
              )}
            </div>
            <div>
              <p className="font-medium text-neutral-800 dark:text-white">
                Connected to Spotify
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {user.display_name || user.id}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <a
              href="https://open.spotify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-neutral-500 hover:text-green-500 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
              title="Open Spotify"
            >
              <ExternalLink size={18} />
            </a>
            <button
              onClick={logout}
              className="p-2 text-neutral-500 hover:text-red-500 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
              title="Disconnect"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft p-6 text-center">
      <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
        <Music size={32} className="text-white" />
      </div>
      
      <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-2">
        Connect to Spotify
      </h3>
      
      <p className="text-neutral-600 dark:text-neutral-400 mb-6 text-sm">
        Connect your Spotify account to get personalized music therapy recommendations based on your mood and mental health needs.
      </p>
      
      <div className="space-y-3 mb-6">
        <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
          Mood-based music recommendations
        </div>
        <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
          Create therapeutic playlists
        </div>
        <div className="flex items-center text-sm text-neutral-600 dark:text-neutral-400">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
          Access curated mental health playlists
        </div>
      </div>
      
      <button
        onClick={login}
        className="w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium flex items-center justify-center space-x-2 transition-colors"
      >
        <Music size={18} />
        <span>Connect with Spotify</span>
      </button>
      
      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-4">
        We only access your music preferences to provide better recommendations. Your listening data remains private.
      </p>
    </div>
  );
};

export default SpotifyConnect;