import { useTheme } from '../../contexts/ThemeContext';
import { Sun, Moon } from 'lucide-react';

interface HeaderProps {
  title: string;
  leftContent?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ title, leftContent }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="py-3 px-4 sm:px-6 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {leftContent}
          <h1 className="text-lg sm:text-xl font-semibold text-primary-700 dark:text-primary-400">
            {title}
          </h1>
        </div>
        <div className="flex items-center space-x-2">
          <button 
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            onClick={toggleTheme}
            aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme === 'light' ? (
              <Moon size={20} className="text-neutral-700" />
            ) : (
              <Sun size={20} className="text-neutral-300" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;