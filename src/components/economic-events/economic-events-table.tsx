"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAlerts } from "@/components/alerts/alerts-provider";
import { MarketInsights } from "@/components/ai-insights/market-insights";
import { useLanguage } from "@/components/language/language-provider";
import { createDefaultFinancialApi } from "@/lib/financial-api";
import { AlertTriangle, Bell, Bot, Calendar, Clock, Filter, RefreshCw, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";

export interface EconomicEvent {
  id: string;
  time: Date;
  currency: string;
  impact: "high" | "medium" | "low";
  event: string;
  actual?: string;
  forecast?: string;
  previous?: string;
  isLive?: boolean;
}

const financialApi = createDefaultFinancialApi();

const getImpactColor = (impact: EconomicEvent["impact"]) => {
  switch (impact) {
    case "high":
      return "bg-red-500";
    case "medium":
      return "bg-yellow-500";
    case "low":
      return "bg-green-500";
    default:
      return "bg-gray-500";
  }
};

const getImpactLabel = (impact: EconomicEvent["impact"], t: (key: string) => string) => {
  switch (impact) {
    case "high":
      return t("impact.highLabel");
    case "medium":
      return t("impact.mediumLabel");
    case "low":
      return t("impact.lowLabel");
    default:
      return "Unknown";
  }
};

const getCurrencyFlag = (currency: string) => {
  const flags: Record<string, string> = {
    USD: "🇺🇸",
    EUR: "🇪🇺",
    GBP: "🇬🇧",
    JPY: "🇯🇵",
    AUD: "🇦🇺",
    CAD: "🇨🇦",
    CHF: "🇨🇭",
    CNY: "🇨🇳",
  };
  return flags[currency] || "🌍";
};

export function EconomicEventsTable() {
  const { t, direction } = useLanguage();
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [showAiInsights, setShowAiInsights] = useState(false);
  const [usingFallbackData, setUsingFallbackData] = useState(false);

  const loadEvents = async (date: Date) => {
    try {
      setIsLoading(true);
      const eventData = await financialApi.getEconomicEvents(date, language);
      setEvents(eventData);
      // Check if we're using fallback data (all mock events have "mock-" prefix)
      const isUsingFallback = eventData.every(event => event.id.startsWith("mock-"));
      setUsingFallbackData(isUsingFallback);
    } catch (error) {
      console.error("Failed to load events:", error);
      setUsingFallbackData(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadEvents(selectedDate);
    setIsRefreshing(false);
  };

  const handleDateChange = (newDate: Date) => {
    setSelectedDate(newDate);
    loadEvents(newDate);
  };

  useEffect(() => {
    loadEvents(selectedDate);

    // Set up auto-refresh every 5 minutes
    const interval = setInterval(() => {
      loadEvents(selectedDate);
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, [selectedDate, language]);

  const filteredEvents = events.filter(event => 
    event.event.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.currency.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`space-y-6 ${direction === "rtl" ? "rtl" : "ltr"}`}>
      {/* Fallback Data Notice */}
      {usingFallbackData && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
          <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">
              Demo Mode: Using sample data. Configure API keys in environment variables for live data.
            </span>
          </div>
        </div>
      )}

      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            {t("dashboard.title")}
          </h2>
          <p className="text-muted-foreground mt-1">
            {t("dashboard.subtitle")}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <Input
              type="date"
              value={format(selectedDate, "yyyy-MM-dd")}
              onChange={(e) => handleDateChange(new Date(e.target.value))}
              className="w-auto"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("dashboard.searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48"
            />
          </div>
          
          <Button
            onClick={handleRefresh}
            disabled={isRefreshing}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {t("dashboard.refresh")}
          </Button>

          <Button
            onClick={() => setShowAiInsights(true)}
            variant="default"
            size="sm"
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Bot className="w-4 h-4" />
            {t("dashboard.aiInsights")}
          </Button>
        </div>
      </div>

      {/* Events Table */}
      <Card className="border-border/50">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              {t("dashboard.todaysEvents")} ({filteredEvents.length})
            </span>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                {t("impact.high")}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                {t("impact.medium")}
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                {t("impact.low")}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">{t("table.time")}</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">{t("table.currency")}</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">{t("table.impact")}</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">{t("table.event")}</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">{t("table.actual")}</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">{t("table.forecast")}</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">{t("table.previous")}</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      <div className="flex items-center justify-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        {t("dashboard.loading")}
                      </div>
                    </td>
                  </tr>
                ) : filteredEvents.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted-foreground">
                      {t("dashboard.noEvents")}
                    </td>
                  </tr>
                ) : (
                  filteredEvents.map((event) => (
                    <tr
                      key={event.id}
                      className={`border-b border-border/30 hover:bg-muted/30 transition-colors ${
                        event.isLive ? "bg-primary/5 border-primary/30" : ""
                      }`}
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {event.isLive && (
                            <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                          )}
                          <span className="font-mono text-sm">
                            {format(event.time, "HH:mm")}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getCurrencyFlag(event.currency)}</span>
                          <span className="font-semibold">{event.currency}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getImpactColor(event.impact)}`}></div>
                          <Badge variant="outline" className="text-xs">
                          {getImpactLabel(event.impact, t)}
                        </Badge>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="font-medium text-sm">{event.event}</span>
                      </td>
                      <td className="p-4">
                        <span className={`font-mono text-sm ${
                          event.actual ? "text-primary font-semibold" : "text-muted-foreground"
                        }`}>
                          {event.actual || "-"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-sm text-muted-foreground">
                          {event.forecast || "-"}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-mono text-sm text-muted-foreground">
                          {event.previous || "-"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <MarketInsights
        isOpen={showAiInsights}
        onClose={() => setShowAiInsights(false)}
        events={events}
      />
    </div>
  );
}
