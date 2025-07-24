import { EconomicEvent } from "@/components/economic-events/economic-events-table";

export interface FinancialApiConfig {
  provider: "finnhub" | "trading-economics" | "marketaux";
  apiKey: string;
  baseUrl: string;
}

export class FinancialApiService {
  private config: FinancialApiConfig;

  constructor(config: FinancialApiConfig) {
    this.config = config;
  }

  async getEconomicEvents(date: Date): Promise<EconomicEvent[]> {
    // Check if we have a valid API key before making requests
    if (!this.config.apiKey || this.config.apiKey === "demo" || this.config.apiKey === "your_api_key_here") {
      console.warn("No valid API key configured, using fallback data");
      return this.getFallbackEvents(date);
    }

    try {
      switch (this.config.provider) {
        case "finnhub":
          return this.getFinnhubEvents(date);
        case "trading-economics":
          return this.getTradingEconomicsEvents(date);
        case "marketaux":
          return this.getMarketauxEvents(date);
        default:
          throw new Error(`Unsupported provider: ${this.config.provider}`);
      }
    } catch (error) {
      console.error("Error fetching economic events:", error);
      return this.getFallbackEvents(date);
    }
  }

  private async getFinnhubEvents(date: Date): Promise<EconomicEvent[]> {
    const dateStr = date.toISOString().split('T')[0];
    const url = `${this.config.baseUrl}/calendar/economic?from=${dateStr}&to=${dateStr}&token=${this.config.apiKey}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.status}`);
    }
    
    const data = await response.json();
    return this.transformFinnhubData(data.economicCalendar || []);
  }

  private async getTradingEconomicsEvents(date: Date): Promise<EconomicEvent[]> {
    const dateStr = date.toISOString().split('T')[0];
    const url = `${this.config.baseUrl}/calendar?c=${this.config.apiKey}&d1=${dateStr}&d2=${dateStr}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Trading Economics API error: ${response.status}`);
    }
    
    const data = await response.json();
    return this.transformTradingEconomicsData(data);
  }

  private async getMarketauxEvents(date: Date): Promise<EconomicEvent[]> {
    const dateStr = date.toISOString().split('T')[0];
    const url = `${this.config.baseUrl}/v1/news/all?published_on=${dateStr}&api_token=${this.config.apiKey}&categories=general,forex&limit=50`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Marketaux API error: ${response.status}`);
    }
    
    const data = await response.json();
    return this.transformMarketauxData(data.data || []);
  }

  private transformFinnhubData(events: any[]): EconomicEvent[] {
    return events.map((event, index) => ({
      id: `finnhub-${index}`,
      time: new Date(event.time * 1000),
      currency: this.getCurrencyFromCountry(event.country) || "USD",
      impact: this.mapImpactLevel(event.impact),
      event: event.event || "Economic Event",
      actual: event.actual?.toString(),
      forecast: event.estimate?.toString(),
      previous: event.prev?.toString(),
      isLive: this.isEventLive(new Date(event.time * 1000)),
    }));
  }

  private transformTradingEconomicsData(events: any[]): EconomicEvent[] {
    return events.map((event, index) => ({
      id: `te-${index}`,
      time: new Date(event.Date),
      currency: event.Currency || "USD",
      impact: this.mapImpactLevel(event.Importance),
      event: event.Event || "Economic Event",
      actual: event.Actual?.toString(),
      forecast: event.Forecast?.toString(),
      previous: event.Previous?.toString(),
      isLive: this.isEventLive(new Date(event.Date)),
    }));
  }

  private transformMarketauxData(news: any[]): EconomicEvent[] {
    return news.slice(0, 10).map((item, index) => ({
      id: `marketaux-${index}`,
      time: new Date(item.published_at),
      currency: this.extractCurrencyFromTitle(item.title) || "USD",
      impact: this.guessImpactFromTitle(item.title),
      event: item.title.substring(0, 80) + (item.title.length > 80 ? "..." : ""),
      actual: undefined,
      forecast: undefined,
      previous: undefined,
      isLive: this.isEventLive(new Date(item.published_at)),
    }));
  }

  private mapImpactLevel(impact: any): "high" | "medium" | "low" {
    if (typeof impact === "string") {
      const lower = impact.toLowerCase();
      if (lower.includes("high") || lower.includes("3")) return "high";
      if (lower.includes("medium") || lower.includes("2")) return "medium";
      return "low";
    }
    if (typeof impact === "number") {
      if (impact >= 3) return "high";
      if (impact >= 2) return "medium";
      return "low";
    }
    return "medium";
  }

  private getCurrencyFromCountry(country: string): string | null {
    const countryToCurrency: Record<string, string> = {
      "US": "USD",
      "United States": "USD",
      "EU": "EUR",
      "Eurozone": "EUR",
      "Germany": "EUR",
      "France": "EUR",
      "UK": "GBP",
      "United Kingdom": "GBP",
      "Japan": "JPY",
      "Australia": "AUD",
      "Canada": "CAD",
      "Switzerland": "CHF",
      "China": "CNY",
    };
    return countryToCurrency[country] || null;
  }

  private extractCurrencyFromTitle(title: string): string | null {
    const currencies = ["USD", "EUR", "GBP", "JPY", "AUD", "CAD", "CHF", "CNY"];
    for (const currency of currencies) {
      if (title.toUpperCase().includes(currency)) {
        return currency;
      }
    }
    return null;
  }

  private guessImpactFromTitle(title: string): "high" | "medium" | "low" {
    const highImpactKeywords = ["fed", "interest rate", "gdp", "inflation", "employment", "central bank"];
    const mediumImpactKeywords = ["retail", "manufacturing", "housing", "trade"];
    
    const lowerTitle = title.toLowerCase();
    
    if (highImpactKeywords.some(keyword => lowerTitle.includes(keyword))) {
      return "high";
    }
    if (mediumImpactKeywords.some(keyword => lowerTitle.includes(keyword))) {
      return "medium";
    }
    return "low";
  }

  private isEventLive(eventTime: Date): boolean {
    const now = new Date();
    const diffMinutes = Math.abs(now.getTime() - eventTime.getTime()) / (1000 * 60);
    return diffMinutes <= 30; // Consider events within 30 minutes as "live"
  }

  private getFallbackEvents(date: Date): EconomicEvent[] {
    // Enhanced mock data for demonstration
    const mockEvents: EconomicEvent[] = [
      {
        id: "mock-1",
        time: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 9, 30),
        currency: "USD",
        impact: "high",
        event: "Federal Reserve Interest Rate Decision",
        actual: "5.25%",
        forecast: "5.25%",
        previous: "5.00%",
        isLive: true,
      },
      {
        id: "mock-2",
        time: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 14, 0),
        currency: "EUR",
        impact: "medium",
        event: "ECB Monetary Policy Statement",
        forecast: "0.50%",
        previous: "0.25%",
      },
      {
        id: "mock-3",
        time: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 15, 30),
        currency: "GBP",
        impact: "high",
        event: "UK GDP Quarterly Growth",
        forecast: "0.2%",
        previous: "0.1%",
      },
      {
        id: "mock-4",
        time: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 16, 0),
        currency: "JPY",
        impact: "low",
        event: "Bank of Japan Press Conference",
        forecast: "-0.1%",
        previous: "0.0%",
      },
      {
        id: "mock-5",
        time: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 10, 0),
        currency: "USD",
        impact: "medium",
        event: "Non-Farm Payrolls",
        actual: "275K",
        forecast: "200K",
        previous: "150K",
      },
      {
        id: "mock-6",
        time: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12, 30),
        currency: "CAD",
        impact: "low",
        event: "Bank of Canada Rate Statement",
        forecast: "5.0%",
        previous: "5.0%",
      },
    ];

    return mockEvents.sort((a, b) => a.time.getTime() - b.time.getTime());
  }
}

// Default configuration - can be overridden via environment variables
export const createDefaultFinancialApi = (): FinancialApiService => {
  const config: FinancialApiConfig = {
    provider: (process.env.NEXT_PUBLIC_FINANCIAL_API_PROVIDER as any) || "finnhub",
    apiKey: process.env.NEXT_PUBLIC_FINANCIAL_API_KEY || "demo",
    baseUrl: process.env.NEXT_PUBLIC_FINANCIAL_API_BASE_URL || "https://finnhub.io/api/v1",
  };

  return new FinancialApiService(config);
};
