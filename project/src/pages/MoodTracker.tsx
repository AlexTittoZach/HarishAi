import { useState, useEffect } from 'react';
import { Mood } from '../types';
import MoodSelector from '../components/mood/MoodSelector';
import MoodCalendar from '../components/mood/MoodCalendar';
import MoodMusicRecommendations from '../components/music/MoodMusicRecommendations';
import { TrendingUp, Calendar, BarChart3, Smile, Music } from 'lucide-react';
import { format, subDays, isWithinInterval } from 'date-fns';

const MoodTracker: React.FC = () => {
  const [moods, setMoods] = useState<Mood[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showMusicRecommendations, setShowMusicRecommendations] = useState(false);
  const [currentMoodForMusic, setCurrentMoodForMusic] = useState<number | null>(null);

  // Load moods from localStorage on component mount
  useEffect(() => {
    const savedMoods = localStorage.getItem('moodData');
    if (savedMoods) {
      const parsedMoods = JSON.parse(savedMoods).map((mood: any) => ({
        ...mood,
        date: new Date(mood.date)
      }));
      setMoods(parsedMoods);
    }
  }, []);

  // Save moods to localStorage whenever moods change
  useEffect(() => {
    localStorage.setItem('moodData', JSON.stringify(moods));
  }, [moods]);

  const handleMoodSelect = (value: number, note?: string) => {
    const newMood: Mood = {
      id: Date.now().toString(),
      date: new Date(),
      value,
      notes: note,
    };
    
    // Remove any existing mood for today and add the new one
    const today = new Date();
    const filteredMoods = moods.filter(mood => 
      !isSameDay(new Date(mood.date), today)
    );
    
    setMoods([newMood, ...filteredMoods]);
    
    // Show music recommendations for the selected mood
    setCurrentMoodForMusic(value);
    setShowMusicRecommendations(true);
  };

  const handleSelectDay = (date: Date) => {
    setSelectedDate(date);
    // In a real app, you might show detailed mood info for that day
  };

  const handleShowMusicForMood = (moodValue: number) => {
    setCurrentMoodForMusic(moodValue);
    setShowMusicRecommendations(true);
  };

  // Helper function to check if two dates are the same day
  const isSameDay = (date1: Date, date2: Date) => {
    return format(date1, 'yyyy-MM-dd') === format(date2, 'yyyy-MM-dd');
  };

  // Calculate mood statistics
  const getMoodStats = () => {
    if (moods.length === 0) return null;

    const last7Days = moods.filter(mood => 
      isWithinInterval(new Date(mood.date), {
        start: subDays(new Date(), 7),
        end: new Date()
      })
    );

    const last30Days = moods.filter(mood => 
      isWithinInterval(new Date(mood.date), {
        start: subDays(new Date(), 30),
        end: new Date()
      })
    );

    const averageMood7Days = last7Days.length > 0 
      ? last7Days.reduce((sum, mood) => sum + mood.value, 0) / last7Days.length 
      : 0;

    const averageMood30Days = last30Days.length > 0 
      ? last30Days.reduce((sum, mood) => sum + mood.value, 0) / last30Days.length 
      : 0;

    const overallAverage = moods.reduce((sum, mood) => sum + mood.value, 0) / moods.length;

    return {
      totalEntries: moods.length,
      averageMood7Days: Math.round(averageMood7Days * 10) / 10,
      averageMood30Days: Math.round(averageMood30Days * 10) / 10,
      overallAverage: Math.round(overallAverage * 10) / 10,
      streak: calculateStreak()
    };
  };

  const calculateStreak = () => {
    if (moods.length === 0) return 0;
    
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const checkDate = subDays(today, i);
      const hasMoodForDay = moods.some(mood => 
        isSameDay(new Date(mood.date), checkDate)
      );
      
      if (hasMoodForDay) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };

  const getMoodEmoji = (value: number) => {
    switch(value) {
      case 1: return '😞';
      case 2: return '😔';
      case 3: return '😐';
      case 4: return '🙂';
      case 5: return '😄';
      default: return '😐';
    }
  };

  const stats = getMoodStats();

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-neutral-800 dark:text-white mb-2">Mood Tracker</h1>
        <p className="text-neutral-600 dark:text-neutral-400">
          Track your daily mood and discover patterns in your emotional wellbeing
        </p>
      </div>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Current Streak</p>
                <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {stats.streak} days
                </p>
              </div>
              <Calendar className="text-primary-500" size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">7-Day Average</p>
                <p className="text-2xl font-bold text-secondary-600 dark:text-secondary-400 flex items-center">
                  {stats.averageMood7Days || 'N/A'}
                  {stats.averageMood7Days && (
                    <span className="ml-2 text-lg">
                      {getMoodEmoji(Math.round(stats.averageMood7Days))}
                    </span>
                  )}
                </p>
              </div>
              <TrendingUp className="text-secondary-500" size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">30-Day Average</p>
                <p className="text-2xl font-bold text-accent-600 dark:text-accent-400 flex items-center">
                  {stats.averageMood30Days || 'N/A'}
                  {stats.averageMood30Days && (
                    <span className="ml-2 text-lg">
                      {getMoodEmoji(Math.round(stats.averageMood30Days))}
                    </span>
                  )}
                </p>
              </div>
              <BarChart3 className="text-accent-500" size={24} />
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Entries</p>
                <p className="text-2xl font-bold text-neutral-700 dark:text-neutral-300">
                  {stats.totalEntries}
                </p>
              </div>
              <Smile className="text-neutral-500" size={24} />
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Selector */}
        <div>
          <MoodSelector onSelect={handleMoodSelect} />
        </div>

        {/* Mood Calendar */}
        <div>
          <MoodCalendar 
            moods={moods} 
            onSelectDay={handleSelectDay}
          />
        </div>
      </div>

      {/* Music Recommendations */}
      {showMusicRecommendations && currentMoodForMusic && (
        <div className="mt-8">
          <MoodMusicRecommendations 
            mood={currentMoodForMusic}
            onClose={() => setShowMusicRecommendations(false)}
          />
        </div>
      )}

      {/* Recent Moods */}
      {moods.length > 0 && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-neutral-800 dark:text-white mb-4">
            Recent Mood Entries
          </h2>
          <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-soft overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {moods.slice(0, 10).map((mood) => (
                <div key={mood.id} className="p-4 border-b border-neutral-200 dark:border-neutral-700 last:border-b-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{getMoodEmoji(mood.value)}</span>
                      <div>
                        <p className="font-medium text-neutral-800 dark:text-white">
                          {format(new Date(mood.date), 'EEEE, MMMM d')}
                        </p>
                        {mood.notes && (
                          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                            {mood.notes}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleShowMusicForMood(mood.value)}
                        className="p-2 text-neutral-500 hover:text-primary-500 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
                        title="Get music recommendations for this mood"
                      >
                        <Music size={16} />
                      </button>
                      <div className="text-right">
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">
                          {format(new Date(mood.date), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodTracker;