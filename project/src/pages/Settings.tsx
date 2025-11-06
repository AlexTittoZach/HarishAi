import { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useUser } from '../contexts/UserContext';
import SettingsSection from '../components/settings/SettingsSection';
import SpotifyConnect from '../components/music/SpotifyConnect';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download, 
  Trash2,
  Music
} from 'lucide-react';

const Settings: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, updateUser, updatePreferences } = useUser();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleNameChange = (name: string) => {
    updateUser({ name });
  };

  const handlePreferenceChange = (key: keyof typeof user.preferences, value: any) => {
    updatePreferences({ [key]: value });
  };

  const handleExportData = () => {
    // In a real app, this would export user data
    const userData = {
      profile: user,
      moodData: JSON.parse(localStorage.getItem('moodData') || '[]'),
      exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(userData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'harishai-data-export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDeleteAllData = () => {
    if (showDeleteConfirm) {
      // Clear all stored data
      localStorage.removeItem('moodData');
      localStorage.removeItem('user');
      localStorage.removeItem('hasVisitedBefore');
      localStorage.removeItem('spotify_access_token');
      
      // Reload the page to reset the app state
      window.location.reload();
    } else {
      setShowDeleteConfirm(true);
      setTimeout(() => setShowDeleteConfirm(false), 5000); // Auto-hide after 5 seconds
    }
  };

  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">Settings</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Customize your HarishAI experience and manage your account preferences
        </p>
      </div>

      {/* Profile Settings */}
      <SettingsSection
        title="Profile"
        description="Manage your personal information"
        icon={<User size={20} />}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Display Name
            </label>
            <input
              type="text"
              id="name"
              value={user.name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="w-full p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      </SettingsSection>

      {/* Music Integration */}
      <SettingsSection
        title="Music Integration"
        description="Connect your music streaming services for personalized music therapy"
        icon={<Music size={20} />}
      >
        <SpotifyConnect />
      </SettingsSection>

      {/* Appearance Settings */}
      <SettingsSection
        title="Appearance"
        description="Customize how HarishAI looks and feels"
        icon={<Palette size={20} />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Theme</h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Choose between light and dark mode
              </p>
            </div>
            <button
              onClick={toggleTheme}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                theme === 'dark' ? 'bg-primary-600' : 'bg-neutral-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </SettingsSection>

      {/* Notification Settings */}
      <SettingsSection
        title="Notifications"
        description="Control how and when you receive notifications"
        icon={<Bell size={20} />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Push Notifications
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Receive reminders and updates
              </p>
            </div>
            <button
              onClick={() => handlePreferenceChange('notifications', !user.preferences.notifications)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                user.preferences.notifications ? 'bg-primary-600' : 'bg-neutral-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  user.preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </SettingsSection>

      {/* Privacy Settings */}
      <SettingsSection
        title="Privacy & Data"
        description="Manage your data and privacy preferences"
        icon={<Shield size={20} />}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Data Sharing
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Help improve HarishAI by sharing anonymous usage data
              </p>
            </div>
            <button
              onClick={() => handlePreferenceChange('dataSharing', !user.preferences.dataSharing)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                user.preferences.dataSharing ? 'bg-primary-600' : 'bg-neutral-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  user.preferences.dataSharing ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <h3 className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
              Data Management
            </h3>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleExportData}
                className="flex items-center px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
              >
                <Download size={16} className="mr-2" />
                Export My Data
              </button>
              
              <button
                onClick={handleDeleteAllData}
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  showDeleteConfirm
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'border border-red-300 dark:border-red-600 text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20'
                }`}
              >
                <Trash2 size={16} className="mr-2" />
                {showDeleteConfirm ? 'Click again to confirm' : 'Delete All Data'}
              </button>
            </div>
          </div>
        </div>
      </SettingsSection>

      {/* Language Settings */}
      <SettingsSection
        title="Language & Region"
        description="Set your preferred language and regional settings"
        icon={<Globe size={20} />}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="language" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Language
            </label>
            <select
              id="language"
              value={user.preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
              className="w-full p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="ml">മലയാളം (Malayalam)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            </select>
          </div>
        </div>
      </SettingsSection>

      {/* App Version */}
      <div className="mt-8 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-center">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          HarishAI v1.0.0 - Your AI Mental Health Companion
        </p>
      </div>
    </div>
  );
};

export default Settings;