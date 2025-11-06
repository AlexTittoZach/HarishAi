import { useState } from 'react';
import { Smile, Frown, Meh, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface MoodSelectorProps {
  onSelect: (value: number, note?: string) => void;
}

const MoodSelector: React.FC<MoodSelectorProps> = ({ onSelect }) => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState('');
  
  const moods = [
    { value: 1, icon: ThumbsDown, label: 'Very bad', color: 'text-red-500' },
    { value: 2, icon: Frown, label: 'Bad', color: 'text-orange-500' },
    { value: 3, icon: Meh, label: 'Okay', color: 'text-yellow-500' },
    { value: 4, icon: Smile, label: 'Good', color: 'text-green-500' },
    { value: 5, icon: ThumbsUp, label: 'Excellent', color: 'text-primary-500' },
  ];
  
  const handleMoodSelect = (value: number) => {
    setSelectedMood(value);
  };
  
  const handleSubmit = () => {
    if (selectedMood !== null) {
      onSelect(selectedMood, note.trim() || undefined);
      setSelectedMood(null);
      setNote('');
    }
  };
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft p-4">
      <h3 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4 text-center">
        How are you feeling today?
      </h3>
      
      <div className="flex justify-center space-x-3 sm:space-x-6 mb-6">
        {moods.map(mood => {
          const isSelected = selectedMood === mood.value;
          return (
            <motion.button
              key={mood.value}
              onClick={() => handleMoodSelect(mood.value)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`
                flex flex-col items-center p-3 rounded-lg transition-all
                ${isSelected 
                  ? 'bg-primary-50 dark:bg-primary-900/30 scale-105 ring-2 ring-primary-500' 
                  : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'}
              `}
            >
              <mood.icon 
                size={28} 
                className={`${mood.color} ${isSelected ? 'animate-pulse' : ''}`}
              />
              <span className={`text-xs mt-1 ${isSelected ? 'font-medium' : ''}`}>
                {mood.label}
              </span>
            </motion.button>
          );
        })}
      </div>
      
      {selectedMood !== null && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mb-4"
        >
          <label htmlFor="mood-note" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Add a note (optional)
          </label>
          <textarea
            id="mood-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's contributing to this feeling?"
            className="w-full p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
            rows={2}
          ></textarea>
          
          <div className="flex justify-end mt-4">
            <button
              onClick={() => setSelectedMood(null)}
              className="px-3 py-2 mr-2 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
            >
              Save Mood
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default MoodSelector;