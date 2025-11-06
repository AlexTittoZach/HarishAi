# 🧠 HarishAI - AI Mental Health Companion

> A compassionate AI-powered mental health companion built with React, TypeScript, and modern web technologies. HarishAI provides emotional support, mood tracking, music therapy, and mental health resources with a focus on Indian users.
<<<<<<< HEAD
> 
## 🌟 Live Demo

**🚀 [Try HarishAI Live](https://harishai.netlify.app)**

## ✨ Features

- 🤖 **AI Chat Companion** - Empathetic conversations powered by Groq's Llama 3.1
- 📊 **Mood Tracking** - Daily mood logging with calendar view and analytics
- 🎵 **Music Therapy** - Spotify integration for mood-based music recommendations
- 📚 **Mental Health Resources** - Curated articles, videos, and emergency contacts (India-focused)
- 🎙️ **Voice Support** - Speech-to-text input and text-to-speech output
- 🌙 **Dark/Light Mode** - Comfortable viewing in any lighting
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🔒 **Privacy First** - Your data stays private and secure

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Frontend** | React 18, TypeScript, Tailwind CSS |
| **AI** | Groq API (Llama 3.1 8B Instant) |
| **Music** | Spotify Web API with PKCE authentication |
| **Voice** | Web Speech API (Speech Recognition & Synthesis) |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Build Tool** | Vite |
| **Deployment** | Netlify |

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Groq API key (free at [console.groq.com](https://console.groq.com))
- Spotify Developer account (optional, for music features)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/harishai.git
   cd harishai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your API keys:
   ```env
   VITE_GROQ_API_KEY=your_groq_api_key_here
   VITE_SPOTIFY_CLIENT_ID=your_spotify_client_id_here
   VITE_SPOTIFY_REDIRECT_URI=http://localhost:5173
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Groq AI Setup
1. Visit [console.groq.com](https://console.groq.com)
2. Create a free account
3. Generate an API key
4. Add it to your `.env` file

### Spotify Integration (Optional)
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Add your redirect URI (e.g., `http://localhost:5173`)
4. Enable "Authorization Code with PKCE"
5. Disable "Implicit Grant"
6. Copy your Client ID to `.env`

## 📱 Features Overview

### 🤖 AI Chat Companion
- Empathetic, context-aware conversations
- Real-time streaming responses
- Voice input and output support
- Crisis detection and resource recommendations

### 📊 Mood Tracking
- Daily mood logging (1-5 scale)
- Calendar view with mood history
- Statistics and trends analysis
- Music recommendations based on mood

### 🎵 Music Therapy
- Spotify integration for personalized playlists
- Mood-based music recommendations
- Create and save therapeutic playlists
- Preview tracks with built-in player

### 📚 Mental Health Resources
- India-focused mental health resources
- Emergency helplines and crisis support
- Articles, videos, and exercises
- Searchable and filterable content

## 🌐 Deployment

### Deploy to Netlify
1. Build the project: `npm run build`
2. Deploy the `dist` folder to Netlify
3. Update your Spotify redirect URI to your live URL
4. Set environment variables in Netlify dashboard

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push

<<<<<<< HEAD
## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

=======
>>>>>>> b8bfce43c4012eb9b558ff3ab780f08d966659ec
## 🙏 Acknowledgments

- **Team:** Alex, Namitha, Aldrin, Harish
- **AI:** Powered by Groq's Llama 3.1 models
- **Music:** Spotify Web API
- **Icons:** Lucide React
- **Inspiration:** Making mental health support accessible to everyone

## 📞 Support & Resources

### Emergency Contacts (India)
- **KIRAN Helpline:** 1800-599-0019 (24/7)
- **Vandrevala Foundation:** 9999 666 555
- **iCall (TISS):** 9152987821 (8 AM-10 PM)
- **Sneha (Chennai):** 044-24640050

### Mental Health Resources
- [NIMHANS](https://www.nimhans.ac.in)
- [Live Love Laugh Foundation](https://www.thelivelovelaughfoundation.org)
- [YourDOST](https://www.yourdost.com)

---

**Made with ❤️ for mental health awareness and support**



