interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface GroqResponse {
  choices: Array<{
    delta?: {
      content?: string;
    };
    message?: {
      content: string;
    };
    finish_reason?: string;
  }>;
}

class GroqService {
  private apiKey: string;
  private model: string = 'llama-3.1-8b-instant'; // Updated to working model
  private baseUrl = 'https://api.groq.com/openai/v1';

  constructor() {
    this.apiKey = import.meta.env.VITE_GROQ_API_KEY || '';
    
    if (!this.apiKey || this.apiKey === 'your_groq_api_key_here') {
      console.warn('Groq API key not configured. Please add VITE_GROQ_API_KEY to your environment variables.');
    }
  }

  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey !== 'your_groq_api_key_here';
  }

  private getSystemPrompt(): string {
    return `You are HarishAI, a compassionate and empathetic AI mental health companion. Your role is to provide emotional support, active listening, and gentle guidance to users who may be struggling with various mental health challenges.

Key principles:
- Be warm, empathetic, and non-judgmental
- Listen actively and validate emotions
- Ask thoughtful follow-up questions to understand better
- Provide gentle guidance and coping strategies when appropriate
- Recognize when professional help may be needed
- Maintain appropriate boundaries as an AI companion
- Use a conversational, supportive tone
- Be concise but thorough in your responses
- Show genuine care and concern

Important guidelines:
- If someone mentions self-harm, suicide, or crisis situations, acknowledge their pain, encourage them to seek immediate professional help, and provide crisis resources
- You are not a replacement for professional therapy or medical care
- Focus on emotional support and practical coping strategies
- Encourage healthy habits and self-care
- Be culturally sensitive and inclusive
- Respect privacy and confidentiality

Remember: You're here to listen, support, and guide - not to diagnose or provide medical advice.`;
  }

  async sendMessage(
    userMessage: string,
    conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [],
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error('Groq API is not configured. Please add your API key to the environment variables.');
    }

    try {
      // Prepare messages with system prompt and conversation history
      const messages: GroqMessage[] = [
        { role: 'system', content: this.getSystemPrompt() },
        ...conversationHistory.slice(-10).map(msg => ({ // Keep last 10 messages for context
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: userMessage }
      ];

      // Current available models on Groq (as of 2024)
      const modelsToTry = [
        'llama-3.1-8b-instant',    // Fastest, most reliable
        'llama-3.1-70b-versatile', // More capable but slower
        'llama3-8b-8192',          // Alternative Llama 3
        'mixtral-8x7b-32768',      // Mixtral alternative
        'gemma-7b-it'              // Google's Gemma
      ];

      let lastError: Error | null = null;

      for (const model of modelsToTry) {
        try {
          const response = await fetch(`${this.baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: model,
              messages,
              stream: !!onChunk, // Enable streaming if callback provided
              temperature: 0.7,
              max_tokens: 1000,
              top_p: 0.9,
              frequency_penalty: 0.1,
              presence_penalty: 0.1
            }),
          });

          if (response.ok) {
            // Update the working model
            this.model = model;
            console.log(`Successfully using model: ${model}`);
            
            if (onChunk) {
              // Handle streaming response
              return this.handleStreamingResponse(response, onChunk);
            } else {
              // Handle non-streaming response
              const data: GroqResponse = await response.json();
              return data.choices[0]?.message?.content || 'I apologize, but I encountered an issue generating a response. Please try again.';
            }
          } else {
            const errorData = await response.json().catch(() => ({}));
            lastError = new Error(`Model ${model} failed: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
            console.warn(`Model ${model} failed, trying next...`, lastError.message);
            continue;
          }
        } catch (error) {
          lastError = error instanceof Error ? error : new Error('Unknown error');
          console.warn(`Model ${model} failed, trying next...`, lastError.message);
          continue;
        }
      }

      // If all models failed, throw the last error
      throw lastError || new Error('All available models failed');

    } catch (error) {
      console.error('Error calling Groq API:', error);
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          throw new Error('Invalid Groq API key. Please check your configuration.');
        } else if (error.message.includes('429')) {
          throw new Error('Rate limit exceeded. Please wait a moment and try again.');
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          throw new Error('Network error. Please check your internet connection and try again.');
        }
        throw error;
      }
      
      throw new Error('An unexpected error occurred while communicating with the AI.');
    }
  }

  private async handleStreamingResponse(response: Response, onChunk: (chunk: string) => void): Promise<string> {
    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Failed to get response stream');
    }

    const decoder = new TextDecoder();
    let fullResponse = '';

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              return fullResponse;
            }

            try {
              const parsed: GroqResponse = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content;
              
              if (content) {
                fullResponse += content;
                onChunk(content);
              }
            } catch (e) {
              // Skip invalid JSON lines
              continue;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return fullResponse;
  }

  // Get the current model name for display
  getCurrentModel(): string {
    return this.model;
  }

  // Get model display name
  getModelDisplayName(): string {
    const modelNames: { [key: string]: string } = {
      'llama-3.1-8b-instant': 'Llama 3.1 8B Instant',
      'llama-3.1-70b-versatile': 'Llama 3.1 70B Versatile',
      'llama3-8b-8192': 'Llama 3 8B',
      'mixtral-8x7b-32768': 'Mixtral 8x7B',
      'gemma-7b-it': 'Gemma 7B IT'
    };
    
    return modelNames[this.model] || this.model;
  }

  // Get current model info for display
  getModelInfo(): { name: string; status: string; description: string } {
    const modelInfo: { [key: string]: { status: string; description: string } } = {
      'llama-3.1-8b-instant': {
        status: 'Active',
        description: 'Fast, efficient model optimized for real-time conversations'
      },
      'llama-3.1-70b-versatile': {
        status: 'Active',
        description: 'More capable model with enhanced reasoning abilities'
      },
      'llama3-8b-8192': {
        status: 'Active',
        description: 'Reliable Llama 3 model with good performance'
      },
      'mixtral-8x7b-32768': {
        status: 'Active',
        description: 'Mixtral model with strong multilingual capabilities'
      },
      'gemma-7b-it': {
        status: 'Active',
        description: 'Google\'s Gemma model fine-tuned for instruction following'
      }
    };

    const info = modelInfo[this.model] || { status: 'Unknown', description: 'Model information not available' };
    
    return {
      name: this.getModelDisplayName(),
      status: info.status,
      description: info.description
    };
  }
}

export const groqService = new GroqService();
export default groqService;