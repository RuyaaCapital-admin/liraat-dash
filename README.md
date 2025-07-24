# Liirat Economic Dashboard

A real-time economic news and events dashboard built for traders and financial professionals. This project transforms the original shadcn-ui-big-calendar template into a comprehensive financial intelligence platform.

![Liirat Dashboard](https://cdn.builder.io/api/v1/image/assets%2F8d6e2ebe2191474fb5a6de98317d4278%2Fae40207ed1d14041b2dc30fdddcc0531?format=webp&width=800)

## ✨ Features

### 🎨 Liirat Branding
- **Dark Theme**: Custom Liirat green color palette on black background
- **Professional Design**: Clean, modern financial interface
- **Responsive Layout**: Optimized for desktop and mobile devices
- **Brand Identity**: Liirat logo, colors, and typography throughout

### 📊 Economic Events Dashboard
- **Real-time Data**: Live economic events from multiple API providers
- **Comprehensive Table**: Time, Currency, Impact, Event, Actual, Forecast, Previous columns
- **Impact Indicators**: Color-coded dots (red/yellow/green) for event importance
- **Currency Flags**: Visual currency indicators with flag emojis
- **Live Updates**: Auto-refresh every 5 minutes + manual refresh button
- **Date Filtering**: Date picker to view events for any day
- **Search Functionality**: Filter events by name or currency

### 🤖 AI Market Insights
- **Intelligent Analysis**: AI-powered market intelligence sidebar
- **Real-time Chat**: Interactive AI assistant for trading questions
- **Market Summaries**: Automated daily market overview and alerts
- **Impact Analysis**: AI-generated insights on high-impact events
- **Strategy Suggestions**: Trading recommendations and risk management tips

### 🌍 Multi-language Support
- **English/Arabic**: Full bilingual support with language toggle
- **RTL Support**: Right-to-left layout for Arabic interface
- **Auto-detection**: Browser language detection with manual override
- **Complete Translation**: All UI elements, notifications, and AI responses

### 🔌 API Integration
- **Multiple Providers**: Support for Finnhub, Trading Economics, and Marketaux
- **Fallback System**: Graceful degradation to mock data if APIs fail
- **Rate Limit Handling**: Smart caching and request management
- **Error Recovery**: Robust error handling and user feedback

### ⚡ Performance & UX
- **Fast Loading**: Optimized API calls and data caching
- **Real-time Updates**: WebSocket support for live data streams
- **Mobile Responsive**: Touch-friendly interface for all devices
- **Accessibility**: Keyboard navigation and screen reader support
- **Loading States**: Smooth loading indicators and skeleton screens

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- API key from one of the supported providers

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd liirat-economic-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   ```
   
   Edit `.env.local` with your API credentials:
   ```env
   NEXT_PUBLIC_FINANCIAL_API_PROVIDER=finnhub
   NEXT_PUBLIC_FINANCIAL_API_KEY=your_api_key_here
   NEXT_PUBLIC_FINANCIAL_API_BASE_URL=https://finnhub.io/api/v1
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   Navigate to `http://localhost:3000`

## 📡 API Providers

### Finnhub (Recommended)
- **Free Tier**: 60 calls/minute
- **Setup**: Register at [finnhub.io](https://finnhub.io/register)
- **Features**: Economic calendar, real-time data

### Trading Economics
- **Features**: Comprehensive economic indicators
- **Setup**: Subscribe at [tradingeconomics.com](https://tradingeconomics.com/api)
- **Note**: Paid service required

### Marketaux
- **Features**: Financial news and market data
- **Setup**: Register at [marketaux.com](https://www.marketaux.com/account/register)
- **Free Tier**: Available with limits

See [API Setup Guide](docs/API_SETUP.md) for detailed configuration instructions.

## 🛠️ Technology Stack

- **Framework**: Next.js 14 with App Router
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS with custom Liirat theme
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **Language**: TypeScript
- **State Management**: React hooks and context
- **API Integration**: Fetch with automatic fallbacks

## 🎯 Key Components

### Economic Events Table
```typescript
// Main dashboard component with real-time events
<EconomicEventsTable />
```

### AI Market Insights
```typescript
// AI-powered sidebar with chat interface
<MarketInsights isOpen={true} events={events} />
```

### Language Provider
```typescript
// Multi-language context with RTL support
<LanguageProvider>
  <App />
</LanguageProvider>
```

## 🔧 Configuration

### Environment Variables
```env
# Required: Financial API
NEXT_PUBLIC_FINANCIAL_API_PROVIDER=finnhub
NEXT_PUBLIC_FINANCIAL_API_KEY=your_key
NEXT_PUBLIC_FINANCIAL_API_BASE_URL=https://finnhub.io/api/v1

# Optional: AI Features
OPENAI_API_KEY=your_openai_key

# Optional: WebSocket
NEXT_PUBLIC_WEBSOCKET_URL=wss://ws.finnhub.io
```

### Customization
- **Colors**: Modify `src/app/globals.css` for theme colors
- **Branding**: Update logo and text in `src/app/layout.tsx`
- **Languages**: Add translations in `src/components/language/language-provider.tsx`

## 📱 Mobile Responsive

The dashboard is fully responsive with:
- **Touch-friendly** controls and buttons
- **Collapsible** navigation for mobile screens
- **Optimized** table layout with horizontal scrolling
- **Adaptive** AI sidebar for smaller screens

## 🔒 Security Features

- **Environment Variables**: All API keys stored securely
- **Rate Limiting**: Built-in request throttling
- **Error Boundaries**: Graceful error handling
- **Input Validation**: Sanitized user inputs
- **No Client Secrets**: API keys properly handled

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel deploy
```

### Other Platforms
```bash
npm run build
npm start
```

Set environment variables in your deployment platform.

## 📊 Performance

- **Bundle Size**: Optimized with code splitting
- **API Calls**: Efficient caching and batching
- **Rendering**: Server-side rendering for fast initial load
- **Images**: Optimized with Next.js Image component
- **Fonts**: Preloaded for performance

## 🧪 Testing

```bash
# Run tests
npm test

# Type checking
npm run type-check

# Linting
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [API Setup Guide](docs/API_SETUP.md)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Contact**: [Liirat Support](mailto:support@liirat.com)

## 🎉 Acknowledgments

- **Original Template**: [list-jonas/shadcn-ui-big-calendar](https://github.com/list-jonas/shadcn-ui-big-calendar)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Design System**: [Radix UI](https://www.radix-ui.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

Built with ❤️ by the Liirat team for traders worldwide.
