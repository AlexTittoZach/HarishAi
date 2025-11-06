import { useState } from 'react';
import { Resource } from '../types';
import ResourceCard from '../components/resources/ResourceCard';
import { Search, Filter, BookOpen, PlayCircle, Activity, AlertTriangle, Phone } from 'lucide-react';

const Resources: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string>('');

  // India-focused mental health resources
  const resources: Resource[] = [
    {
      id: '1',
      title: 'Understanding Mental Health in India',
      description: 'Comprehensive guide to mental health awareness, breaking stigma, and understanding common mental health conditions in the Indian context.',
      url: 'https://www.nimhans.ac.in/mental-health-awareness',
      type: 'article',
      tags: ['mental-health', 'awareness', 'india', 'stigma']
    },
    {
      id: '2',
      title: 'Mindfulness and Meditation - Indian Traditions',
      description: 'Learn traditional Indian meditation techniques including Vipassana, Pranayama, and mindfulness practices rooted in ancient wisdom.',
      url: 'https://www.youtube.com/watch?v=inpok4MKVLM',
      type: 'video',
      tags: ['meditation', 'mindfulness', 'pranayama', 'yoga']
    },
    {
      id: '3',
      title: 'Pranayama Breathing Exercises',
      description: 'Traditional Indian breathing techniques including Anulom Vilom, Bhramari, and Kapalbhati for stress relief and mental clarity.',
      type: 'exercise',
      tags: ['breathing', 'pranayama', 'stress-relief', 'yoga']
    },
    {
      id: '4',
      title: 'Depression and Anxiety in Indian Society',
      description: 'Understanding depression and anxiety within Indian cultural context, family dynamics, and available treatment options.',
      url: 'https://www.thelivelovelaughfoundation.org/mental-health-resources',
      type: 'article',
      tags: ['depression', 'anxiety', 'culture', 'family']
    },
    {
      id: '5',
      title: 'Yoga Nidra for Deep Relaxation',
      description: 'Ancient Indian practice of yogic sleep for profound relaxation, stress reduction, and mental peace.',
      type: 'exercise',
      tags: ['yoga-nidra', 'relaxation', 'sleep', 'stress']
    },
    {
      id: '6',
      title: 'KIRAN Mental Health Helpline',
      description: '24/7 toll-free mental health helpline by Ministry of Social Justice. Call 1800-599-0019 for immediate support.',
      type: 'emergency',
      tags: ['helpline', 'crisis', 'government', 'emergency']
    },
    {
      id: '7',
      title: 'Cognitive Behavioral Therapy in India',
      description: 'Learn about CBT techniques adapted for Indian cultural context and how to access therapy services in India.',
      url: 'https://www.manastha.com/cbt-therapy-india',
      type: 'article',
      tags: ['cbt', 'therapy', 'counseling', 'treatment']
    },
    {
      id: '8',
      title: 'Mental Health and Indian Festivals',
      description: 'How to maintain mental wellness during festivals, manage family expectations, and find joy in celebrations.',
      url: 'https://www.mindpiper.com/mental-health-festivals',
      type: 'article',
      tags: ['festivals', 'family', 'wellness', 'culture']
    },
    {
      id: '9',
      title: 'Guided Meditation in Hindi',
      description: '20-minute guided meditation in Hindi for anxiety relief and inner peace, incorporating Indian spiritual traditions.',
      url: 'https://www.youtube.com/watch?v=hindi-meditation',
      type: 'video',
      tags: ['meditation', 'hindi', 'anxiety', 'spiritual']
    },
    {
      id: '10',
      title: 'Vandrevala Foundation Helpline',
      description: 'Free 24/7 crisis helpline providing emotional support. Call 9999 666 555 or chat online for immediate help.',
      type: 'emergency',
      tags: ['crisis', 'helpline', 'suicide-prevention', 'support']
    },
    {
      id: '11',
      title: 'NIMHANS Mental Health Resources',
      description: 'National Institute of Mental Health and Neurosciences - comprehensive mental health information and services.',
      url: 'https://www.nimhans.ac.in',
      type: 'article',
      tags: ['nimhans', 'research', 'treatment', 'bangalore']
    },
    {
      id: '12',
      title: 'Workplace Mental Health in India',
      description: 'Managing work stress, dealing with workplace harassment, and maintaining mental health in Indian corporate culture.',
      url: 'https://www.yourDOST.com/workplace-mental-health',
      type: 'article',
      tags: ['workplace', 'stress', 'corporate', 'career']
    },
    {
      id: '13',
      title: 'Mental Health for Students',
      description: 'Resources for students dealing with academic pressure, career anxiety, and mental health challenges in Indian education system.',
      url: 'https://www.manastha.com/student-mental-health',
      type: 'article',
      tags: ['students', 'academic-stress', 'career', 'education']
    },
    {
      id: '14',
      title: 'iCall Psychosocial Helpline',
      description: 'Tata Institute of Social Sciences helpline. Call 9152987821 for counseling support (Mon-Sat, 8 AM-10 PM).',
      type: 'emergency',
      tags: ['icall', 'counseling', 'tiss', 'helpline']
    },
    {
      id: '15',
      title: 'Ayurvedic Approach to Mental Health',
      description: 'Traditional Ayurvedic understanding of mental wellness, including herbs, lifestyle practices, and holistic healing.',
      url: 'https://www.ayush.gov.in/mental-health',
      type: 'article',
      tags: ['ayurveda', 'traditional', 'herbs', 'holistic']
    },
    {
      id: '16',
      title: 'Mental Health and Indian Women',
      description: 'Addressing unique mental health challenges faced by women in India, including postpartum depression and domestic issues.',
      url: 'https://www.thelivelovelaughfoundation.org/women-mental-health',
      type: 'article',
      tags: ['women', 'postpartum', 'domestic-violence', 'gender']
    },
    {
      id: '17',
      title: 'Sneha Suicide Prevention',
      description: '24-hour suicide prevention helpline based in Chennai. Call 044-24640050 for crisis intervention and support.',
      type: 'emergency',
      tags: ['suicide-prevention', 'chennai', 'crisis', 'sneha']
    },
    {
      id: '18',
      title: 'Mental Health Apps in India',
      description: 'Review of Indian mental health apps like YourDOST, Manastha, and MindPeace for accessible mental health support.',
      url: 'https://www.healthline.com/health/mental-health-apps-india',
      type: 'article',
      tags: ['apps', 'technology', 'accessibility', 'digital-health']
    }
  ];

  const resourceTypes = [
    { value: 'article', label: 'Articles', icon: BookOpen },
    { value: 'video', label: 'Videos', icon: PlayCircle },
    { value: 'exercise', label: 'Exercises', icon: Activity },
    { value: 'emergency', label: 'Emergency', icon: AlertTriangle },
    { value: 'contact', label: 'Contacts', icon: Phone }
  ];

  // Get all unique tags
  const allTags = Array.from(new Set(resources.flatMap(resource => resource.tags || [])));

  // Filter resources
  const filteredResources = resources.filter(resource => {
    const matchesSearch = searchTerm === '' || 
      resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === '' || resource.type === selectedType;
    
    const matchesTag = selectedTag === '' || 
      (resource.tags && resource.tags.includes(selectedTag));
    
    return matchesSearch && matchesType && matchesTag;
  });

  // Group resources by type for better organization
  const emergencyResources = filteredResources.filter(r => r.type === 'emergency');
  const otherResources = filteredResources.filter(r => r.type !== 'emergency');

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">Resources</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Discover helpful articles, videos, exercises, and support resources for mental health in India
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search resources..."
            className="w-full pl-10 pr-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        
        <div className="flex gap-2">
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">All types</option>
              {resourceTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>
          
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-4 py-2 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="">All tags</option>
            {allTags.map(tag => (
              <option key={tag} value={tag}>#{tag}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Emergency Resources (always shown at top if present) */}
      {emergencyResources.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-red-700 dark:text-red-400 mb-4 flex items-center">
            <AlertTriangle size={20} className="mr-2" />
            Emergency Resources - India
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {emergencyResources.map(resource => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      )}

      {/* Other Resources */}
      {otherResources.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-neutral-400 dark:text-neutral-600 mb-4">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-lg font-medium mb-2">No resources found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {otherResources.map(resource => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}

      {/* Quick Access to Emergency Help - India */}
      <div className="mt-12 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg">
        <h3 className="text-red-800 dark:text-red-300 font-semibold mb-2">Need immediate help in India?</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
          <a href="tel:1800-599-0019" className="text-red-700 dark:text-red-400 font-medium hover:underline">
            📞 KIRAN Helpline: 1800-599-0019 (24/7)
          </a>
          <a href="tel:9999666555" className="text-red-700 dark:text-red-400 font-medium hover:underline">
            📞 Vandrevala Foundation: 9999 666 555
          </a>
          <a href="tel:9152987821" className="text-red-700 dark:text-red-400 font-medium hover:underline">
            📞 iCall (TISS): 9152987821 (8 AM-10 PM)
          </a>
          <a href="tel:044-24640050" className="text-red-700 dark:text-red-400 font-medium hover:underline">
            📞 Sneha (Chennai): 044-24640050
          </a>
        </div>
        <div className="mt-2 text-xs text-red-600 dark:text-red-400">
          All helplines provide free, confidential support in multiple Indian languages
        </div>
      </div>
    </div>
  );
};

export default Resources;