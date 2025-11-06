import { Message } from '../../types';
import { Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

interface ChatMessageProps {
  message: Message;
  isLatest: boolean;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isLatest }) => {
  const [copied, setCopied] = useState(false);
  const isBot = message.sender === 'bot';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting for bot messages
    if (!isBot) return content;

    return content
      .split('\n')
      .map((paragraph, index) => {
        if (!paragraph.trim()) return null;
        
        // Handle bold text **text**
        let formattedParagraph = paragraph.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // Handle italic text *text*
        formattedParagraph = formattedParagraph.replace(/\*(.*?)\*/g, '<em>$1</em>');
        
        return (
          <p 
            key={index} 
            className={`${index > 0 ? 'mt-3' : ''}`}
            dangerouslySetInnerHTML={{ __html: formattedParagraph }}
          />
        );
      })
      .filter(Boolean);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-4 max-w-[85%] ${isBot ? 'self-start' : 'self-end'}`}
    >
      <div className={`
        p-4 rounded-lg shadow-message relative group
        ${isBot 
          ? 'bg-white dark:bg-neutral-800 rounded-bl-none' 
          : 'bg-primary-500 text-white rounded-br-none'
        }
      `}>
        {/* Message content */}
        <div className="leading-relaxed">
          {isBot ? (
            <div>{formatContent(message.content)}</div>
          ) : (
            message.content.split('\n').map((paragraph, index) => (
              <p key={index} className={`${index > 0 ? 'mt-3' : ''}`}>
                {paragraph}
              </p>
            ))
          )}
        </div>

        {/* Copy button for bot messages */}
        {isBot && message.content && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-neutral-700"
            title="Copy message"
          >
            {copied ? (
              <Check size={14} className="text-green-600 dark:text-green-400" />
            ) : (
              <Copy size={14} className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300" />
            )}
          </button>
        )}
      </div>
      
      {/* Message metadata - only timestamp for bot messages */}
      {isBot && message.content && (
        <div className="flex justify-end mt-2 ml-1">
          <span className="text-xs text-neutral-500 dark:text-neutral-500">
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default ChatMessage;