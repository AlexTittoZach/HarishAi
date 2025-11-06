import { ReactNode } from 'react';

interface SettingsSectionProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
}

const SettingsSection: React.FC<SettingsSectionProps> = ({ title, description, icon, children }) => {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft p-4 mb-6">
      <div className="flex items-center mb-2">
        {icon && <span className="mr-2 text-primary-500">{icon}</span>}
        <h2 className="text-lg font-semibold text-neutral-800 dark:text-white">{title}</h2>
      </div>
      
      {description && (
        <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">{description}</p>
      )}
      
      <div className="mt-3">
        {children}
      </div>
    </div>
  );
};

export default SettingsSection;