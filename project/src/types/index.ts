export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'resource' | 'emergency' | 'assessment';
  metadata?: Record<string, any>;
}

export interface Mood {
  id: string;
  date: Date;
  value: number; // 1-5 scale
  notes?: string;
  tags?: string[];
}

export interface JournalEntry {
  id: string;
  date: Date;
  title: string;
  content: string;
  mood?: number;
  tags?: string[];
  aiInsights?: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  url?: string;
  type: 'article' | 'video' | 'exercise' | 'contact' | 'emergency';
  tags?: string[];
}

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  relationship: string;
}