import { useState, useRef, useEffect } from 'react';
import ChatMessage from '../components/chat/ChatMessage';
import ChatInput from '../components/chat/ChatInput';
import { Message } from '../types';
import groqService from '../services/groqService';
import { AlertCircle, Settings, Zap, Heart } from 'lucide-react';

// Initial welcome message
const getInitialMessage = (): Message => ({
  id: '1',
  content: "Hello! I'm HarishAI, your personal mental health companion. I'm here to listen, understand, and support you through whatever you're experiencing. How are you feeling today?\n\n💡 You can type your thoughts, use voice input, or ask me anything about mental health and wellbeing.",
  sender: 'bot',
  timestamp: new Date(Date.now() - 10000),
});

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([getInitialMessage()]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Generate a simple UUID-like string
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  };

  // Get the last bot message for voice output
  const getLastBotMessage = () => {
    const botMessages = messages.filter(msg => msg.sender === 'bot' && msg.content);
    return botMessages.length > 0 ? botMessages[botMessages.length - 1].content : undefined;
  };

  // Convert messages to conversation history format for Groq
  const getConversationHistory = () => {
    return messages
      .filter(msg => msg.content.trim() !== '') // Filter out empty messages
      .slice(1) // Remove initial welcome message
      .map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));
  };

  // Handle AI response with streaming
  const handleAIResponse = async (userMessage: string) => {
    if (!groqService.isConfigured()) {
      setError('Groq AI is not configured. Please add your API key to continue.');
      setIsProcessing(false);
      return;
    }

    // Create a placeholder message for streaming response
    const botMessageId = generateId();
    const botMessage: Message = {
      id: botMessageId,
      content: '',
      sender: 'bot',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, botMessage]);
    setError(null);

    try {
      const conversationHistory = getConversationHistory();
      
      // Stream the response
      await groqService.sendMessage(
        userMessage,
        conversationHistory,
        (chunk: string) => {
          // Update the bot message with each chunk
          setMessages(prev => prev.map(msg => 
            msg.id === botMessageId 
              ? { ...msg, content: msg.content + chunk }
              : msg
          ));
        }
      );
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Update the bot message with error
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setMessages(prev => prev.map(msg => 
        msg.id === botMessageId 
          ? { 
              ...msg, 
              content: `I apologize, but I'm having trouble responding right now. ${errorMessage}\n\nPlease try again in a moment.`
            }
          : msg
      ));
      
      setError(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleSendMessage = async (content: string) => {
    const newMessage: Message = {
      id: generateId(),
      content,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newMessage]);
    setIsProcessing(true);
    
    await handleAIResponse(content);
  };

  const handleRetry = () => {
    setError(null);
    // Get the last user message and retry
    const lastUserMessage = messages.filter(msg => msg.sender === 'user').pop();
    if (lastUserMessage) {
      setIsProcessing(true);
      handleAIResponse(lastUserMessage.content);
    }
  };

  const handleClearChat = () => {
    setMessages([getInitialMessage()]);
    setError(null);
  };
  
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-5rem)]">
      {/* Header with status and controls */}
      <div className="flex items-center justify-between p-3 bg-white dark:bg-neutral-800 rounded-lg mb-4 shadow-soft">
        <div className="flex items-center space-x-3">
          <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
            groqService.isConfigured() 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            <div className={`w-2 h-2 rounded-full ${
              groqService.isConfigured() ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="font-medium">
              {groqService.isConfigured() ? 'AI Connected' : 'AI Not Configured'}
            </span>
          </div>
          
          {groqService.isConfigured() && (
            <div className="flex items-center space-x-1 text-xs text-neutral-500 dark:text-neutral-400">
              <Zap size={12} />
              <span>{groqService.getModelDisplayName()}</span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 text-neutral-500 hover:text-primary-500 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
            title="AI Settings"
          >
            <Settings size={18} />
          </button>
          
          <button
            onClick={handleClearChat}
            className="px-3 py-1 text-sm text-neutral-600 dark:text-neutral-400 hover:text-red-600 dark:hover:text-red-400 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            Clear Chat
          </button>
        </div>
      </div>

      {/* AI Settings Panel */}
      {showSettings && (
        <div className="mb-4 p-4 bg-white dark:bg-neutral-800 rounded-lg shadow-soft">
          <h3 className="font-medium text-neutral-800 dark:text-white mb-3">AI Configuration</h3>
          
          {!groqService.isConfigured() ? (
            <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertCircle size={16} className="text-yellow-600 dark:text-yellow-400 mt-0.5" />
                <div className="text-sm">
                  <p className="text-yellow-800 dark:text-yellow-300 font-medium mb-1">
                    Groq AI Not Configured
                  </p>
                  <p className="text-yellow-700 dark:text-yellow-400 mb-2">
                    To enable real-time AI conversations, you need to add your Groq API key.
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-yellow-700 dark:text-yellow-400">
                    <li>Visit <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" className="underline hover:no-underline">console.groq.com/keys</a></li>
                    <li>Create a free account and generate an API key</li>
                    <li>Add <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">VITE_GROQ_API_KEY=your_key_here</code> to your .env file</li>
                    <li>Restart the development server</li>
                  </ol>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-600 dark:text-neutral-400">Model:</span>
                <div className="px-3 py-1 text-sm bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 rounded-lg">
                  {groqService.getModelDisplayName()}
                </div>
              </div>
              
              <div className="text-xs text-neutral-500 dark:text-neutral-400">
                💡 Using Llama 3.1 70B for the most empathetic and nuanced responses for mental health conversations.
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle size={16} className="text-red-600 dark:text-red-400" />
              <span className="text-sm text-red-700 dark:text-red-300">{error}</span>
            </div>
            <button
              onClick={handleRetry}
              className="px-3 py-1 text-xs bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 text-red-700 dark:text-red-300 rounded"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto chat-container bg-neutral-50 dark:bg-neutral-900 rounded-lg p-4 mb-4">
        <div className="flex flex-col">
          {messages.map((message, index) => (
            <ChatMessage 
              key={message.id} 
              message={message}
              isLatest={index === messages.length - 1}
            />
          ))}
          
          {/* Typing indicator */}
          {isProcessing && (
            <div className="mb-4 max-w-[85%] self-start">
              <div className="p-4 rounded-lg shadow-message bg-white dark:bg-neutral-800 rounded-bl-none">
                <div className="flex items-center h-6">
                  <div className="typing-indicator text-neutral-600 dark:text-neutral-400">
                    HarishAI is thinking
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
        lastBotMessage={getLastBotMessage()}
      />

      {/* Team Credits Footer - with proper mobile spacing */}
      <div className="mt-4 pb-20 md:pb-3 text-center">
        <div className="flex items-center justify-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
          <span>Made with</span>
          <Heart size={14} className="text-red-500 animate-pulse" fill="currentColor" />
          <span>by</span>
          <div className="flex items-center space-x-1 flex-wrap justify-center">
            <span className="font-medium text-primary-600 dark:text-primary-400">alex</span>
            <span className="text-neutral-400">•</span>
            <span className="font-medium text-secondary-600 dark:text-secondary-400">namitha</span>
            <span className="text-neutral-400">•</span>
            <span className="font-medium text-accent-600 dark:text-accent-400">aldrin</span>
            <span className="text-neutral-400">•</span>
            <span className="font-medium text-primary-600 dark:text-primary-400">harish</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;