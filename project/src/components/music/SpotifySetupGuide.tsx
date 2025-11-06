import React, { useState } from 'react';
import { ExternalLink, Copy, Check, AlertCircle, Music, Settings, ArrowRight } from 'lucide-react';

interface SpotifySetupGuideProps {
  currentUrl: string;
  onClose?: () => void;
}

const SpotifySetupGuide: React.FC<SpotifySetupGuideProps> = ({ currentUrl, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const steps = [
    {
      title: "Create Spotify App",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-400">
            First, you need to create a Spotify app in the Developer Dashboard.
          </p>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Step 1:</h4>
            <ol className="list-decimal list-inside space-y-2 text-blue-700 dark:text-blue-400">
              <li>Go to Spotify Developer Dashboard</li>
              <li>Click "Create App"</li>
              <li>Fill in the app details (any name is fine)</li>
              <li>Click "Create"</li>
            </ol>
          </div>
          <a
            href="https://developer.spotify.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
          >
            <ExternalLink size={16} className="mr-2" />
            Open Spotify Dashboard
          </a>
        </div>
      )
    },
    {
      title: "Configure App Settings",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-400">
            Now configure your app with the correct settings.
          </p>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-800 dark:text-yellow-300 mb-3">Step 2: App Settings</h4>
            <div className="space-y-3 text-yellow-700 dark:text-yellow-400">
              <div>
                <strong>1. Click "Settings" on your app</strong>
              </div>
              <div>
                <strong>2. Add Redirect URI:</strong>
                <div className="mt-2 flex items-center space-x-2 bg-white dark:bg-yellow-900/40 p-2 rounded">
                  <code className="flex-1 text-sm font-mono text-yellow-900 dark:text-yellow-200">
                    {currentUrl}
                  </code>
                  <button
                    onClick={() => copyToClipboard(currentUrl)}
                    className="p-1 text-yellow-600 hover:text-yellow-800 dark:hover:text-yellow-200"
                    title="Copy URL"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <strong>3. Set Website URL:</strong>
                <div className="mt-1 text-sm font-mono bg-white dark:bg-yellow-900/40 p-2 rounded">
                  {currentUrl}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Enable Correct Authentication",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-400">
            This is the most important step - configure the authentication settings correctly.
          </p>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-red-800 dark:text-red-300 mb-3">Step 3: Authentication Settings</h4>
            <div className="space-y-3 text-red-700 dark:text-red-400">
              <div>
                <strong>In your Spotify app settings, find the "App Settings" section:</strong>
              </div>
              <div className="bg-white dark:bg-red-900/40 p-3 rounded border-l-4 border-green-500">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-4 h-4 border-2 border-green-500 rounded flex items-center justify-center">
                    <Check size={12} className="text-green-500" />
                  </div>
                  <span className="font-medium text-green-700 dark:text-green-300">
                    ✅ Authorization Code with PKCE
                  </span>
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">
                  This MUST be checked/enabled
                </div>
              </div>
              <div className="bg-white dark:bg-red-900/40 p-3 rounded border-l-4 border-red-500">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-4 h-4 border-2 border-red-500 rounded"></div>
                  <span className="font-medium text-red-700 dark:text-red-300">
                    ❌ Implicit Grant
                  </span>
                </div>
                <div className="text-sm text-red-600 dark:text-red-400">
                  This MUST be unchecked/disabled
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Get Your Client ID",
      content: (
        <div className="space-y-4">
          <p className="text-neutral-600 dark:text-neutral-400">
            Copy your Client ID and add it to your environment variables.
          </p>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-medium text-green-800 dark:text-green-300 mb-3">Step 4: Get Client ID</h4>
            <div className="space-y-3 text-green-700 dark:text-green-400">
              <div>
                <strong>1. In your Spotify app, copy the "Client ID"</strong>
              </div>
              <div>
                <strong>2. Create a .env file in your project root with:</strong>
                <div className="mt-2 bg-white dark:bg-green-900/40 p-3 rounded font-mono text-sm">
                  <div>VITE_SPOTIFY_CLIENT_ID=your_actual_client_id_here</div>
                  <div>VITE_SPOTIFY_REDIRECT_URI={currentUrl}</div>
                </div>
              </div>
              <div>
                <strong>3. Restart your development server</strong>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <Settings size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-white">
              Spotify Setup Guide
            </h3>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              Step {currentStep} of {steps.length}
            </p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 text-xl"
          >
            ×
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`w-full h-2 rounded-full mx-1 ${
                index < currentStep
                  ? 'bg-green-500'
                  : index === currentStep - 1
                  ? 'bg-green-300'
                  : 'bg-neutral-200 dark:bg-neutral-700'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="mb-6">
        <h4 className="text-xl font-semibold text-neutral-800 dark:text-white mb-4">
          {steps[currentStep - 1].title}
        </h4>
        {steps[currentStep - 1].content}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
          disabled={currentStep === 1}
          className={`px-4 py-2 rounded-lg font-medium ${
            currentStep === 1
              ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed dark:bg-neutral-700 dark:text-neutral-600'
              : 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-600'
          }`}
        >
          Previous
        </button>

        {currentStep < steps.length ? (
          <button
            onClick={() => setCurrentStep(Math.min(steps.length, currentStep + 1))}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium flex items-center"
          >
            Next
            <ArrowRight size={16} className="ml-2" />
          </button>
        ) : (
          <button
            onClick={onClose}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
          >
            Done
          </button>
        )}
      </div>

      {/* Common Issues */}
      <div className="mt-6 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
        <h5 className="font-medium text-neutral-800 dark:text-neutral-200 mb-2 flex items-center">
          <AlertCircle size={16} className="mr-2 text-orange-500" />
          Common Issues
        </h5>
        <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1">
          <li>• Make sure the redirect URI exactly matches (including https://)</li>
          <li>• "Authorization Code with PKCE" must be enabled</li>
          <li>• "Implicit Grant" must be disabled</li>
          <li>• Restart your development server after adding the .env file</li>
          <li>• Clear your browser cache if you still see errors</li>
        </ul>
      </div>
    </div>
  );
};

export default SpotifySetupGuide;