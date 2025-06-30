# NewsHub AI - Intelligent News Dashboard

A modern, AI-powered news dashboard built with React, TypeScript, and Tailwind CSS. Features real-time news from NewsAPI and intelligent article summarization using Google's Gemini AI.

## ✨ Features

- **Modern UI/UX**: Clean, responsive design with smooth animations and micro-interactions
- **Real-time News**: Latest headlines from NewsAPI across multiple categories
- **AI Summarization**: Generate concise summaries using Google Gemini AI
- **Smart Search**: Full-text search across news articles
- **Category Filtering**: Browse news by Business, Technology, Sports, Health, Entertainment, and Science
- **Intelligent Caching**: Optimized performance with smart article caching
- **Saved Summaries**: Store and manage your AI-generated summaries
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ and npm
- NewsAPI key from [newsapi.org](https://newsapi.org)
- Google Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd news-dashboard-ai
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
   VITE_NEWS_API_KEY=your_news_api_key_here
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 🔧 Configuration

### Getting API Keys

**NewsAPI Key:**
1. Visit [newsapi.org](https://newsapi.org)
2. Sign up for a free account
3. Copy your API key from the dashboard

**Gemini API Key:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the generated key

### Environment Variables

Create a `.env` file in the root directory:

```env
# Required: NewsAPI key for fetching articles
VITE_NEWS_API_KEY=your_news_api_key_here

# Required: Google Gemini AI key for summarization
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## 📱 Usage

### Navigation
- **Home**: Browse latest news by category or search
- **My Summaries**: View and manage saved AI summaries

### Features
- **Category Browse**: Click category tabs to filter news
- **Search**: Use the search bar to find specific articles
- **Article Details**: Click any article card to view full details
- **AI Summary**: Generate intelligent summaries with one click
- **Save Summaries**: Automatically save summaries for later reference

### Keyboard Shortcuts
- `Ctrl/Cmd + K`: Focus search bar
- `Escape`: Close article detail view

## 🛠 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite
- **APIs**: NewsAPI, Google Gemini AI

## 📦 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ArticleCard.tsx
│   ├── ArticleDetail.tsx
│   ├── ArticleList.tsx
│   ├── CategoryTabs.tsx
│   ├── ErrorMessage.tsx
│   ├── Header.tsx
│   ├── LoadingSpinner.tsx
│   └── SummariesView.tsx
├── services/           # API services
│   ├── newsAPI.ts
│   └── geminiAPI.ts
├── types/             # TypeScript definitions
│   └── index.ts
├── utils/             # Utility functions
│   └── storage.ts
├── App.tsx           # Main application component
└── main.tsx         # Application entry point
```

## 🚀 Building for Production

```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)  
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🔒 Security

- API keys are stored in environment variables
- No sensitive data is logged or stored
- All external links open in new tabs with security attributes

## 📞 Support

If you encounter any issues or have questions, please [open an issue](https://github.com/your-username/news-dashboard-ai/issues) on GitHub.