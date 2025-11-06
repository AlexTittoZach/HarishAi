import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, VolumeX, Settings, AlertCircle } from 'lucide-react';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';

interface VoiceControlsProps {
  onTranscriptReceived: (transcript: string) => void;
  lastBotMessage?: string;
  className?: string;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({ 
  onTranscriptReceived, 
  lastBotMessage,
  className = '' 
}) => {
  const [showSettings, setShowSettings] = useState(false);
  const [autoSpeak, setAutoSpeak] = useState(false);
  
  const {
    transcript,
    isListening,
    isSupported: speechRecognitionSupported,
    error: speechError,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition();

  const {
    speak,
    cancel: cancelSpeech,
    isSpeaking,
    isSupported: speechSynthesisSupported,
    voices,
    selectedVoice,
    setSelectedVoice,
  } = useSpeechSynthesis();

  // Handle transcript completion
  useEffect(() => {
    if (transcript && !isListening) {
      // Wait a moment to ensure the transcript is complete
      const timer = setTimeout(() => {
        if (transcript.trim()) {
          onTranscriptReceived(transcript.trim());
          resetTranscript();
        }
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [transcript, isListening, onTranscriptReceived, resetTranscript]);

  // Auto-speak bot responses
  useEffect(() => {
    if (autoSpeak && lastBotMessage && speechSynthesisSupported) {
      // Clean up the message for speech (remove markdown, etc.)
      const cleanMessage = lastBotMessage
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
        .replace(/\*(.*?)\*/g, '$1') // Remove italic markdown
        .replace(/`(.*?)`/g, '$1') // Remove code markdown
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links, keep text
        .replace(/#{1,6}\s/g, '') // Remove headers
        .trim();

      if (cleanMessage) {
        speak(cleanMessage);
      }
    }
  }, [lastBotMessage, autoSpeak, speak, speechSynthesisSupported]);

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const toggleSpeaking = () => {
    if (isSpeaking) {
      cancelSpeech();
    } else if (lastBotMessage) {
      speak(lastBotMessage);
    }
  };

  const handleVoiceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const voiceIndex = parseInt(event.target.value);
    const voice = voices[voiceIndex] || null;
    setSelectedVoice(voice);
  };

  if (!speechRecognitionSupported && !speechSynthesisSupported) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <div className="flex items-center space-x-1 text-neutral-400 text-xs">
          <AlertCircle size={14} />
          <span>Voice not supported</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Speech Recognition Button */}
      {speechRecognitionSupported && (
        <div className="relative">
          <button
            onClick={toggleListening}
            disabled={!!speechError}
            className={`p-2 rounded-full transition-all duration-200 ${
              isListening
                ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse scale-110'
                : speechError
                ? 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
                : 'bg-neutral-100 text-neutral-600 hover:bg-primary-100 hover:text-primary-600 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-primary-900/30 dark:hover:text-primary-400'
            }`}
            title={
              speechError 
                ? speechError 
                : isListening 
                ? 'Stop listening' 
                : 'Start voice input'
            }
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          
          {/* Live transcript indicator */}
          {isListening && transcript && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg min-w-48 max-w-64 z-10">
              <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                Listening...
              </div>
              <div className="text-sm text-neutral-800 dark:text-neutral-200">
                {transcript}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Speech Synthesis Button */}
      {speechSynthesisSupported && (
        <button
          onClick={toggleSpeaking}
          disabled={!lastBotMessage}
          className={`p-2 rounded-full transition-all duration-200 ${
            isSpeaking
              ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 animate-pulse'
              : lastBotMessage
              ? 'bg-neutral-100 text-neutral-600 hover:bg-primary-100 hover:text-primary-600 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-primary-900/30 dark:hover:text-primary-400'
              : 'bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-600 cursor-not-allowed'
          }`}
          title={
            isSpeaking 
              ? 'Stop speaking' 
              : lastBotMessage 
              ? 'Read last message aloud' 
              : 'No message to read'
          }
        >
          {isSpeaking ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      )}

      {/* Settings Button */}
      <div className="relative">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 rounded-full bg-neutral-100 text-neutral-600 hover:bg-primary-100 hover:text-primary-600 dark:bg-neutral-700 dark:text-neutral-400 dark:hover:bg-primary-900/30 dark:hover:text-primary-400 transition-colors"
          title="Voice settings"
        >
          <Settings size={18} />
        </button>

        {/* Settings Dropdown */}
        {showSettings && (
          <div className="absolute top-full right-0 mt-1 p-4 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg min-w-64 z-20">
            <h4 className="font-medium text-neutral-800 dark:text-neutral-200 mb-3">
              Voice Settings
            </h4>
            
            {/* Auto-speak toggle */}
            {speechSynthesisSupported && (
              <div className="mb-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSpeak}
                    onChange={(e) => setAutoSpeak(e.target.checked)}
                    className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    Auto-read bot responses
                  </span>
                </label>
              </div>
            )}

            {/* Voice selection */}
            {speechSynthesisSupported && voices.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Voice:
                </label>
                <select
                  value={selectedVoice ? voices.indexOf(selectedVoice) : -1}
                  onChange={handleVoiceChange}
                  className="w-full p-2 border border-neutral-200 dark:border-neutral-700 rounded bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm"
                >
                  {voices.map((voice, index) => (
                    <option key={index} value={index}>
                      {voice.name} ({voice.lang})
                      {voice.default ? ' - Default' : ''}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Feature status */}
            <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${speechRecognitionSupported ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Voice input: {speechRecognitionSupported ? 'Available' : 'Not supported'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${speechSynthesisSupported ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span>Voice output: {speechSynthesisSupported ? 'Available' : 'Not supported'}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error display */}
      {speechError && (
        <div className="absolute top-full left-0 mt-1 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-400 max-w-64 z-10">
          {speechError}
        </div>
      )}
    </div>
  );
};

export default VoiceControls;