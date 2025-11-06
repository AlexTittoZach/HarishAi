import { useState } from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface WelcomePageProps {
  onComplete: () => void;
}

const WelcomePage: React.FC<WelcomePageProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  
  const steps = [
    {
      title: 'Welcome to HarishAI',
      description: "Your personal AI mental health companion. We're here to support your mental wellbeing journey.",
      action: 'Get Started'
    },
    {
      title: 'How HarishAI Helps',
      description: 'Chat with an empathetic AI, track your mood, and discover resources for mental wellbeing.',
      action: 'Continue'
    },
    {
      title: 'What should we call you?',
      description: 'Your name helps us personalize your experience.',
      action: 'Continue',
      input: true
    },
    {
      title: 'Privacy First',
      description: 'Your conversations and data are private and secure. You control what information you share and can delete your data at any time.',
      action: 'Continue'
    },
    {
      title: `You're all set!`,
      description: 'Thank you for trusting HarishAI. We look forward to supporting your mental health journey.',
      action: 'Start Now'
    }
  ];
  
  const handleNext = () => {
    if (step === 2 && !name.trim()) {
      // Handle empty name
      setName('Guest');
    }
    
    if (step === steps.length - 1) {
      onComplete();
    } else {
      setStep(step + 1);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-neutral-900 dark:to-primary-950 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white dark:bg-neutral-800 rounded-xl shadow-soft p-6"
      >
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-full bg-primary-50 dark:bg-primary-900/30 mb-4">
            <Brain size={32} className="text-primary-500 dark:text-primary-400" />
          </div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            {steps[step].title}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            {steps[step].description}
          </p>
        </div>
        
        {steps[step].input && (
          <div className="mb-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="w-full p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
            />
          </div>
        )}
        
        <div className="flex items-center justify-between mt-8">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}
          
          <button
            onClick={handleNext}
            className="px-6 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors"
          >
            {steps[step].action}
          </button>
        </div>
        
        <div className="flex justify-center space-x-2 mt-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-1.5 rounded-full transition-all ${
                index === step 
                  ? 'w-8 bg-primary-500' 
                  : index < step 
                    ? 'w-4 bg-primary-300' 
                    : 'w-4 bg-neutral-200 dark:bg-neutral-700'
              }`}
            ></div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default WelcomePage;