import { useState, useRef, useEffect } from 'react';
import { Send, HelpCircle, X } from 'lucide-react';
import VoiceControls from './VoiceControls';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isProcessing: boolean;
  lastBotMessage?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isProcessing, lastBotMessage }) => {
  const [message, setMessage] = useState('');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isProcessing) return;
    
    onSendMessage(message.trim());
    setMessage('');
    
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setMessage(suggestion);
    setIsHelpOpen(false);
    // Focus the textarea
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setMessage(transcript);
    // Auto-focus textarea after voice input
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  return (
    <div className="bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800 p-3">
      {isHelpOpen && (
        <div className="mb-3 p-4 bg-neutral-50 dark:bg-neutral-800 rounded-lg text-sm text-neutral-700 dark:text-neutral-300">
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-medium text-neutral-800 dark:text-neutral-200">
              💭 Not sure what to say? Try these conversation starters:
            </h4>
            <button 
              onClick={() => setIsHelpOpen(false)}
              className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            >
              <X size={16} />
            </button>
          </div>
          <div className="grid gap-2">
            {[
              "I'm feeling anxious about something and need to talk",
              "I've been having trouble sleeping lately",
              "I'm feeling overwhelmed with everything going on",
              "I'm struggling with low mood and motivation",
              "I had a difficult day and need someone to listen",
              "I'm dealing with stress at work/school",
              "I'm feeling lonely and disconnected",
              "I want to talk about my relationships",
              "I'm having trouble managing my emotions",
              "I just need someone to talk to right now"
            ].map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="text-left p-2 rounded bg-white dark:bg-neutral-700 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400 transition-colors border border-neutral-200 dark:border-neutral-600"
              >
                "{suggestion}"
              </button>
            ))}
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex items-end gap-2 bg-neutral-100 dark:bg-neutral-800 rounded-lg px-3 py-2">
          <button 
            type="button"
            onClick={() => setIsHelpOpen(!isHelpOpen)}
            className="p-2 text-neutral-500 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            title="Show conversation starters"
          >
            <HelpCircle size={18} />
          </button>
          
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Share what's on your mind... I'm here to listen. (You can also use voice input!)"
            className="flex-1 resize-none bg-transparent border-none focus:ring-0 max-h-32 py-2 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400"
            disabled={isProcessing}
            rows={1}
          />
          
          <div className="flex items-center space-x-2">
            {/* Voice Controls */}
            <VoiceControls 
              onTranscriptReceived={handleVoiceTranscript}
              lastBotMessage={lastBotMessage}
            />
            
            <button
              type="submit"
              disabled={!message.trim() || isProcessing}
              className={`p-2 rounded-full transition-colors ${
                message.trim() && !isProcessing
                  ? 'bg-primary-500 text-white hover:bg-primary-600' 
                  : 'bg-neutral-300 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400 cursor-not-allowed'
              }`}
              title="Send message"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;