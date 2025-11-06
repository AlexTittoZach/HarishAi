import { NavLink } from 'react-router-dom';
import { MessageSquare, Activity, LifeBuoy, Settings } from 'lucide-react';

interface SidebarProps {
  onNavItemClick?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onNavItemClick }) => {
  const navItems = [
    { name: 'Chat', path: '/', icon: MessageSquare },
    { name: 'Mood Tracker', path: '/mood', icon: Activity },
    { name: 'Resources', path: '/resources', icon: LifeBuoy },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div className="h-full w-64 bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 flex flex-col">
      <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold text-primary-700 dark:text-primary-400">HarishAI</h1>
        </div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">We listen :)</p>
      </div>
      
      <nav className="flex-1 pt-6 pb-4 px-3">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <NavLink
                to={item.path}
                className={({ isActive }) => `
                  flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-neutral-100/80 dark:bg-neutral-800/60 text-neutral-800 dark:text-neutral-200 shadow-md backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 transform scale-[1.02]' 
                    : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40 hover:text-neutral-800 dark:hover:text-neutral-200 hover:shadow-md hover:transform hover:scale-[1.01] hover:backdrop-blur-sm'
                  }
                `}
                onClick={onNavItemClick}
              >
                <item.icon className={`mr-3 h-5 w-5 transition-transform duration-200 group-hover:scale-110`} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;