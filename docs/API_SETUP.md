# Liirat Economic Dashboard - API Setup Guide

## Overview

The Liirat Economic Dashboard supports multiple financial data providers for real-time economic events. This guide explains how to configure and manage API integrations.

## Supported Providers

### 1. Finnhub (Recommended)

- **Website**: https://finnhub.io
- **Free Tier**: 60 API calls/minute
- **Features**: Economic calendar, real-time market data
- **Setup**:
  1. Register at https://finnhub.io/register
  2. Get your API key from the dashboard
  3. Set `NEXT_PUBLIC_FINANCIAL_API_PROVIDER=finnhub`
  4. Set `NEXT_PUBLIC_FINANCIAL_API_KEY=your_finnhub_key`
  5. Set `NEXT_PUBLIC_FINANCIAL_API_BASE_URL=https://finnhub.io/api/v1`

### 2. Trading Economics

- **Website**: https://tradingeconomics.com
- **Features**: Comprehensive economic calendar, indicators
- **Setup**:
  1. Register at https://tradingeconomics.com/api
  2. Subscribe to a plan (paid service)
  3. Set `NEXT_PUBLIC_FINANCIAL_API_PROVIDER=trading-economics`
  4. Set `NEXT_PUBLIC_FINANCIAL_API_KEY=your_te_key`
  5. Set `NEXT_PUBLIC_FINANCIAL_API_BASE_URL=https://api.tradingeconomics.com`

### 3. Marketaux

- **Website**: https://www.marketaux.com
- **Features**: Financial news, market data
- **Setup**:
  1. Register at https://www.marketaux.com/account/register
  2. Get your API key
  3. Set `NEXT_PUBLIC_FINANCIAL_API_PROVIDER=marketaux`
  4. Set `NEXT_PUBLIC_FINANCIAL_API_KEY=your_marketaux_key`
  5. Set `NEXT_PUBLIC_FINANCIAL_API_BASE_URL=https://api.marketaux.com`

## Environment Configuration

1. Copy `.env.example` to `.env.local`:

   ```bash
   cp .env.example .env.local
   ```

2. Update the variables with your API credentials:

   ```env
   NEXT_PUBLIC_FINANCIAL_API_PROVIDER=finnhub
   NEXT_PUBLIC_FINANCIAL_API_KEY=your_actual_api_key
   NEXT_PUBLIC_FINANCIAL_API_BASE_URL=https://finnhub.io/api/v1
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

## API Rate Limits

### Finnhub (Free)

- 60 requests/minute
- Auto-refresh every 5 minutes fits within limits

### Trading Economics

- Varies by plan
- Contact provider for specific limits

### Marketaux

- Varies by plan
- Check dashboard for current usage

## Error Handling

The dashboard includes automatic fallback mechanisms:

1. **API Failures**: Falls back to mock data
2. **Rate Limits**: Shows cached data with refresh button
3. **Network Issues**: Displays last known data

## WebSocket Support (Optional)

For real-time updates, configure WebSocket:

```env
NEXT_PUBLIC_WEBSOCKET_URL=wss://ws.finnhub.io
```

**Note**: WebSocket support varies by provider and plan.

## AI Features Configuration

For AI Market Insights, add OpenAI configuration:

```env
OPENAI_API_KEY=your_openai_api_key
```

Get your key from: https://platform.openai.com/api-keys

## Security Best Practices

1. **Never commit API keys** to version control
2. Use **environment variables** for all sensitive data
3. **Rotate keys** regularly
4. **Monitor usage** to detect anomalies
5. Use **rate limiting** to prevent abuse

## Troubleshooting

### Common Issues

1. **"Invalid API Key"**

   - Verify key is correct
   - Check if key has required permissions
   - Ensure provider is properly set

2. **"Rate Limit Exceeded"**

   - Reduce auto-refresh frequency
   - Upgrade to higher tier plan
   - Implement caching strategy

3. **"No Data Returned"**
   - Check if selected date has events
   - Verify API endpoint is accessible
   - Check provider service status

### Debug Mode

Enable debug logging by adding:

```env
NEXT_PUBLIC_DEBUG=true
```

This will log API requests and responses to the browser console.

## Support

For API-related issues:

- Check provider documentation
- Contact provider support
- Review dashboard error logs

For dashboard issues:

- Check browser console for errors
- Verify environment configuration
- Test with mock data first
