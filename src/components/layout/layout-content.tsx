"use client";

import { GitHubStarButton } from "@/components/github-star-button";
import { LanguageSelector } from "@/components/language/language-selector";
import { useLanguage } from "@/components/language/language-provider";
import { ThemeSelect } from "@/components/theme/theme-select";

interface LayoutContentProps {
  children: React.ReactNode;
}

export function LayoutContent({ children }: LayoutContentProps) {
  const { t } = useLanguage();

  return (
    <>
      <nav className="w-full py-6 border-b border-border/50 mb-6 bg-card/50 backdrop-blur-sm">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img
              src="https://cdn.builder.io/api/v1/image/assets%2F8d6e2ebe2191474fb5a6de98317d4278%2Fae40207ed1d14041b2dc30fdddcc0531?format=webp&width=800"
              alt="Liirat Logo"
              className="w-8 h-8 object-contain"
            />
            <h1 className="text-xl font-bold text-primary">{t("nav.title")}</h1>
            <span className="text-muted-foreground text-sm">{t("nav.subtitle")}</span>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSelector />
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
              &copy; {new Date().getFullYear()} Liirat Ltd. {t("nav.footer")}
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("nav.poweredBy")}
          </p>
        </div>
      </footer>
    </>
  );
}
