import { AlertsProvider } from "@/components/alerts/alerts-provider";
import { LanguageProvider } from "@/components/language/language-provider";
import { LayoutContent } from "@/components/layout/layout-content";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Liirat News",
  description: "Real-time Financial News and Economic Events",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased flex flex-col",
          fontSans.variable
        )}
      >
        <Analytics />
        <TooltipProvider>
          <LanguageProvider>
            <AlertsProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                <LayoutContent>{children}</LayoutContent>
              </ThemeProvider>
            </AlertsProvider>
          </LanguageProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
