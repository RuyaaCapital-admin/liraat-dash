import { GitHubStarButton } from "@/components/github-star-button";
import { LanguageProvider } from "@/components/language/language-provider";
import { LanguageSelector } from "@/components/language/language-selector";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ThemeSelect } from "@/components/theme/theme-select";
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@radix-ui/react-tooltip";
import { Analytics } from "@vercel/analytics/react";
import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Liirat Economic Dashboard",
  description: "Real-time Economic News and Events Dashboard",
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
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <nav className="w-full py-6 border-b border-border/50 mb-6 bg-card/50 backdrop-blur-sm">
              <div className="container flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-md flex items-center justify-center">
                    <span className="text-black font-bold text-sm">L</span>
                  </div>
                  <h1 className="text-xl font-bold text-primary">Liirat</h1>
                  <span className="text-muted-foreground text-sm">Economic Dashboard</span>
                </div>
                <div className="flex items-center gap-3">
                  <GitHubStarButton />
                  <ThemeSelect />
                </div>
              </div>
            </nav>
            {children}
            <footer className="w-full py-6 border-t border-border/50 mt-auto bg-card/50">
              <div className="container flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                    <span className="text-black font-bold text-xs">L</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    &copy; {new Date().getFullYear()} Liirat Ltd. Real-time Financial Intelligence
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  Powered by AI • Built for Traders
                </p>
              </div>
            </footer>
          </ThemeProvider>
        </TooltipProvider>
      </body>
    </html>
  );
}
