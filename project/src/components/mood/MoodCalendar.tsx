import { useState } from 'react';
import { Mood } from '../../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameDay, subMonths, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar, ThumbsUp, Smile, Meh, Frown, ThumbsDown } from 'lucide-react';

interface MoodCalendarProps {
  moods: Mood[];
  onSelectDay: (date: Date) => void;
}

const MoodCalendar: React.FC<MoodCalendarProps> = ({ moods, onSelectDay }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });
  
  const getMoodIcon = (value: number) => {
    switch(value) {
      case 1: return <ThumbsDown size={16} className="text-red-500" />;
      case 2: return <Frown size={16} className="text-orange-500" />;
      case 3: return <Meh size={16} className="text-yellow-500" />;
      case 4: return <Smile size={16} className="text-green-500" />;
      case 5: return <ThumbsUp size={16} className="text-primary-500" />;
      default: return null;
    }
  };
  
  const getMoodForDay = (day: Date) => {
    return moods.find(mood => isSameDay(new Date(mood.date), day));
  };
  
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };
  
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-800 dark:text-white flex items-center">
          <Calendar size={18} className="mr-2 text-primary-500" />
          Mood Calendar
        </h3>
        
        <div className="flex items-center space-x-2">
          <button 
            onClick={handlePrevMonth}
            className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <ChevronLeft size={20} className="text-neutral-600 dark:text-neutral-400" />
          </button>
          <span className="text-neutral-800 dark:text-white font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </span>
          <button 
            onClick={handleNextMonth}
            className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <ChevronRight size={20} className="text-neutral-600 dark:text-neutral-400" />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
          <div key={index} className="text-center text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {days.map((day) => {
          const mood = getMoodForDay(day);
          return (
            <button
              key={day.toString()}
              onClick={() => onSelectDay(day)}
              className={`
                aspect-square flex flex-col items-center justify-center rounded-lg text-sm transition-all
                ${isToday(day) ? 'ring-2 ring-primary-500 font-medium' : ''}
                ${mood ? 'hover:bg-neutral-100 dark:hover:bg-neutral-700' : 'text-neutral-400 dark:text-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-800'}
              `}
            >
              <span className={`${isToday(day) ? 'text-primary-700 dark:text-primary-400' : ''}`}>
                {format(day, 'd')}
              </span>
              {mood && (
                <span className="mt-1">
                  {getMoodIcon(mood.value)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MoodCalendar;