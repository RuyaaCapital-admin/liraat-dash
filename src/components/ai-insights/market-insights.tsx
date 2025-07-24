"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/components/language/language-provider";
import {
  Bot,
  Brain,
  MessageSquare,
  Sparkles,
  Send,
  X,
  TrendingUp,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useState } from "react";
import { EconomicEvent } from "@/components/economic-events/economic-events-table";

interface MarketInsight {
  id: string;
  type: "summary" | "alert" | "analysis";
  title: string;
  content: string;
  timestamp: Date;
  impact: "high" | "medium" | "low";
}

interface ChatMessage {
  id: string;
  type: "user" | "ai";
  content: string;
  timestamp: Date;
}

interface MarketInsightsProps {
  isOpen: boolean;
  onClose: () => void;
  events: EconomicEvent[];
}

const mockInsights: MarketInsight[] = [
  {
    id: "1",
    type: "alert",
    title: "Fed Rate Decision Alert",
    content:
      "The Federal Reserve is expected to maintain rates at 5.25%, which could impact USD strength and global markets.",
    timestamp: new Date(),
    impact: "high",
  },
  {
    id: "2",
    type: "summary",
    title: "Today's Market Overview",
    content:
      "High volatility expected with 3 high-impact events scheduled. Focus on USD and EUR movements around Fed and ECB announcements.",
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    impact: "medium",
  },
  {
    id: "3",
    type: "analysis",
    title: "Trading Opportunity",
    content:
      "GBP/USD may see increased volatility around the UK GDP announcement. Consider risk management strategies.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    impact: "medium",
  },
];

const getInsightIcon = (type: MarketInsight["type"]) => {
  switch (type) {
    case "alert":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case "analysis":
      return <TrendingUp className="w-4 h-4 text-blue-500" />;
    case "summary":
      return <Info className="w-4 h-4 text-green-500" />;
  }
};

const getImpactColor = (impact: MarketInsight["impact"]) => {
  switch (impact) {
    case "high":
      return "border-red-500 text-red-600";
    case "medium":
      return "border-yellow-500 text-yellow-600";
    case "low":
      return "border-green-500 text-green-600";
  }
};

export function MarketInsights({
  isOpen,
  onClose,
  events,
}: MarketInsightsProps) {
  const { t, direction } = useLanguage();
  const [insights] = useState<MarketInsight[]>(mockInsights);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      type: "ai",
      content: t("ai.welcome"),
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    };

    setChatMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: generateAIResponse(inputMessage, events),
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, aiResponse]);
      setIsProcessing(false);
    }, 1500);
  };

  const generateAIResponse = (
    message: string,
    events: EconomicEvent[]
  ): string => {
    const lowerMessage = message.toLowerCase();

    if (
      lowerMessage.includes("fed") ||
      lowerMessage.includes("interest rate")
    ) {
      return "Based on today's Federal Reserve meeting, I expect continued hawkish sentiment with rates likely held at 5.25%. This could strengthen USD in the short term. Watch for any changes in forward guidance language.";
    }

    if (lowerMessage.includes("gdp") || lowerMessage.includes("growth")) {
      return "The upcoming UK GDP data is crucial for GBP direction. Consensus is 0.2% growth. A beat could push GBP/USD higher, while a miss might trigger selling pressure. Consider tight stops given Brexit uncertainty.";
    }

    if (lowerMessage.includes("strategy") || lowerMessage.includes("trade")) {
      return "Given today's high-impact events, I recommend: 1) Reduce position sizes before major announcements, 2) Set wider stops to account for volatility, 3) Focus on USD and EUR pairs, 4) Avoid trading 30 minutes before/after major releases.";
    }

    if (lowerMessage.includes("risk") || lowerMessage.includes("volatility")) {
      return "Current market volatility is elevated due to multiple central bank events. Risk-on sentiment is fragile. Consider hedging positions and maintaining adequate cash reserves. VIX levels suggest continued uncertainty.";
    }

    return "That's an interesting question about the current market conditions. Based on today's economic calendar, I see several high-impact events that could create trading opportunities. Would you like me to elaborate on any specific currency pair or event?";
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex">
      {/* Sidebar */}
      <div
        className={`w-full max-w-md bg-background border-l border-border shadow-2xl ${direction === "rtl" ? "mr-auto border-r" : "ml-auto border-l"} flex flex-col h-full`}
      >
        {/* Header */}
        <div className="border-b border-border p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-lg flex items-center justify-center">
                <Bot className="w-4 h-4 text-black" />
              </div>
              <div>
                <h3 className="font-semibold text-primary">{t("ai.title")}</h3>
                <p className="text-xs text-muted-foreground">
                  {t("ai.subtitle")}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Insights Section */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-primary" />
              <h4 className="font-medium">{t("ai.marketIntelligence")}</h4>
            </div>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {insights.map((insight) => (
                <Card key={insight.id} className="border-border/50">
                  <CardContent className="p-3">
                    <div className="flex items-start gap-2">
                      {getInsightIcon(insight.type)}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h5 className="text-sm font-medium truncate">
                            {insight.title}
                          </h5>
                          <Badge
                            variant="outline"
                            className={`text-xs ${getImpactColor(insight.impact)}`}
                          >
                            {insight.impact}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-3">
                          {insight.content}
                        </p>
                        <span className="text-xs text-muted-foreground">
                          {insight.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col p-4">
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-primary" />
              <h4 className="font-medium">{t("ai.assistant")}</h4>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-3">
              {chatMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <p>{message.content}</p>
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-muted text-muted-foreground rounded-lg px-3 py-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                      <span>{t("ai.thinking")}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="flex gap-2">
              <Input
                placeholder={t("ai.placeholder")}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
                disabled={isProcessing}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isProcessing}
                size="sm"
                className="px-3"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
