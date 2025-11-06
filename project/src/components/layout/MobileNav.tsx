import { NavLink } from 'react-router-dom';
import { MessageSquare, Activity, LifeBuoy, Settings } from 'lucide-react';

const MobileNav: React.FC = () => {
  const navItems = [
    { name: 'Chat', path: '/', icon: MessageSquare },
    { name: 'Mood', path: '/mood', icon: Activity },
    { name: 'Resources', path: '/resources', icon: LifeBuoy },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 z-10 px-2 py-2">
      <ul className="flex justify-between">
        {navItems.map((item) => (
          <li key={item.name} className="flex-1">
            <NavLink
              to={item.path}
              className={({ isActive }) => `
                flex flex-col items-center p-3 rounded-xl transition-all duration-200 mx-1
                ${isActive 
                  ? 'text-neutral-800 dark:text-neutral-200 bg-neutral-100/80 dark:bg-neutral-800/60 shadow-lg backdrop-blur-sm border border-neutral-200/50 dark:border-neutral-700/50 transform scale-105' 
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 hover:bg-neutral-100/50 dark:hover:bg-neutral-800/40 hover:scale-105 hover:backdrop-blur-sm'
                }
              `}
              aria-label={item.name}
            >
              <item.icon size={20} className="transition-transform duration-200" />
              <span className="text-xs mt-1 font-medium">{item.name}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default MobileNav;