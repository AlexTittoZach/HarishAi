import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
        return 'Chat';
      case '/mood':
        return 'Mood Tracker';
      case '/resources':
        return 'Resources';
      case '/settings':
        return 'Settings';
      default:
        return 'AI Mental Health Companion';
    }
  };
  
  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950">
      {/* Sidebar for desktop */}
      <div className="hidden md:flex">
        <Sidebar />
      </div>
      
      {/* Mobile sidebar (when open) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div 
            className="fixed inset-0 bg-neutral-900 bg-opacity-50 transition-opacity"
            onClick={toggleSidebar}
          ></div>
          <div className="fixed inset-y-0 left-0 w-64 z-40">
            <Sidebar onNavItemClick={() => setIsSidebarOpen(false)} />
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header 
          title={getPageTitle()} 
          leftContent={
            <button 
              onClick={toggleSidebar}
              className="p-2 md:hidden rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
              aria-label="Open sidebar"
            >
              <Menu size={24} className="text-neutral-700 dark:text-neutral-200" />
            </button>
          }
        />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          {children}
        </main>
        <MobileNav />
      </div>
    </div>
  );
};

export default Layout;