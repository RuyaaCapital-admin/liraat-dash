"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "ar";
type Direction = "ltr" | "rtl";

interface LanguageContextType {
  language: Language;
  direction: Direction;
  setLanguage: (language: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    "nav.title": "Liirat",
    "nav.subtitle": "Economic Dashboard",
    "nav.footer": "Real-time Financial Intelligence",
    "nav.poweredBy": "Powered by AI • Built for Traders",
    
    // Dashboard
    "dashboard.title": "Economic Calendar",
    "dashboard.subtitle": "Real-time economic events and market-moving news",
    "dashboard.todaysEvents": "Today's Events",
    "dashboard.searchPlaceholder": "Search events...",
    "dashboard.refresh": "Refresh",
    "dashboard.aiInsights": "AI Insights",
    "dashboard.loading": "Loading economic events...",
    "dashboard.noEvents": "No events found for the selected date.",
    
    // Table Headers
    "table.time": "Time",
    "table.currency": "Currency",
    "table.impact": "Impact",
    "table.event": "Event",
    "table.actual": "Actual",
    "table.forecast": "Forecast",
    "table.previous": "Previous",
    
    // Impact Levels
    "impact.high": "High Impact",
    "impact.medium": "Medium Impact",
    "impact.low": "Low Impact",
    "impact.highLabel": "High",
    "impact.mediumLabel": "Medium",
    "impact.lowLabel": "Low",
    
    // AI Insights
    "ai.title": "AI Market Insights",
    "ai.subtitle": "Powered by Liirat Intelligence",
    "ai.marketIntelligence": "Market Intelligence",
    "ai.assistant": "AI Assistant",
    "ai.placeholder": "Ask about markets, events, or strategies...",
    "ai.thinking": "AI is thinking...",
    "ai.welcome": "Hello! I'm your AI trading assistant. Ask me about today's economic events, market analysis, or trading strategies.",
  },
  ar: {
    // Navigation
    "nav.title": "ليرات",
    "nav.subtitle": "لوحة الاقتصاد",
    "nav.footer": "ذكاء مالي في الوقت الفعلي",
    "nav.poweredBy": "مدعوم بالذكاء الاصطناعي • مصمم للمتداولين",
    
    // Dashboard
    "dashboard.title": "التقويم الاقتصادي",
    "dashboard.subtitle": "الأحداث الاقتصادية والأخبار المؤثرة على الأسواق في الوقت الفعلي",
    "dashboard.todaysEvents": "أحداث اليوم",
    "dashboard.searchPlaceholder": "البحث في الأحداث...",
    "dashboard.refresh": "تحديث",
    "dashboard.aiInsights": "رؤى الذكاء الاصطناعي",
    "dashboard.loading": "جاري تحميل الأحداث الاقتصادية...",
    "dashboard.noEvents": "لم يتم العثور على أحداث للتاريخ المحدد.",
    
    // Table Headers
    "table.time": "الوقت",
    "table.currency": "العملة",
    "table.impact": "التأثير",
    "table.event": "الحدث",
    "table.actual": "الفعلي",
    "table.forecast": "المتوقع",
    "table.previous": "السابق",
    
    // Impact Levels
    "impact.high": "تأثير عالي",
    "impact.medium": "تأثير متوسط",
    "impact.low": "تأثير منخفض",
    "impact.highLabel": "عالي",
    "impact.mediumLabel": "متوسط",
    "impact.lowLabel": "منخفض",
    
    // AI Insights
    "ai.title": "رؤى الذكاء الاصطناعي للأسواق",
    "ai.subtitle": "مدعوم بذكاء ليرات",
    "ai.marketIntelligence": "ذكاء السوق",
    "ai.assistant": "مساعد الذكاء الاصطناعي",
    "ai.placeholder": "اسأل عن الأسواق والأحداث والاستراتيجيات...",
    "ai.thinking": "الذكاء الاصطناعي يفكر...",
    "ai.welcome": "مرحباً! أنا مساعدك التجاري بالذكاء الاصطناعي. اسألني عن الأحداث الاقتصادية اليوم، تحليل السوق، أو استراتيجيات التداول.",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const direction: Direction = language === "ar" ? "rtl" : "ltr";

  const setLanguage = (newLanguage: Language) => {
    setLanguageState(newLanguage);
    localStorage.setItem("liirat-language", newLanguage);
    document.documentElement.dir = newLanguage === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = newLanguage;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  useEffect(() => {
    const savedLanguage = localStorage.getItem("liirat-language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ar")) {
      setLanguage(savedLanguage);
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.split("-")[0];
      if (browserLang === "ar") {
        setLanguage("ar");
      }
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ language, direction, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
