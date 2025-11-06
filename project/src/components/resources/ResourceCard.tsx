import { Resource } from '../../types';
import { ExternalLink, BookOpen, PlayCircle, AlertTriangle, Activity } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  const getIcon = () => {
    switch (resource.type) {
      case 'article':
        return <BookOpen className="text-primary-500" />;
      case 'video':
        return <PlayCircle className="text-accent-500" />;
      case 'exercise':
        return <Activity className="text-secondary-500" />;
      case 'emergency':
        return <AlertTriangle className="text-red-500" />;
      default:
        return <BookOpen className="text-primary-500" />;
    }
  };
  
  const getTypeStyle = () => {
    switch (resource.type) {
      case 'article':
        return 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300';
      case 'video':
        return 'bg-accent-100 text-accent-800 dark:bg-accent-900/30 dark:text-accent-300';
      case 'exercise':
        return 'bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300';
      case 'emergency':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'contact':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default:
        return 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300';
    }
  };
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-neutral-100 dark:bg-neutral-700">
            {getIcon()}
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-1">
              {resource.title}
            </h3>
            
            <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium ${getTypeStyle()} capitalize mb-2`}>
              {resource.type}
            </span>
            
            <p className="text-neutral-600 dark:text-neutral-300 text-sm">
              {resource.description}
            </p>
            
            {resource.tags && resource.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-3">
                {resource.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-700 rounded-full text-xs text-neutral-600 dark:text-neutral-300"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {resource.url && (
        <div className="border-t border-neutral-200 dark:border-neutral-700 p-3 text-center">
          <a 
            href={resource.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center text-primary-600 dark:text-primary-400 font-medium hover:underline"
          >
            Open Resource
            <ExternalLink size={14} className="ml-1" />
          </a>
        </div>
      )}
    </div>
  );
};

export default ResourceCard;