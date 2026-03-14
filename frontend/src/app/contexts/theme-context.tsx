import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import {
  type CustomThemeConfig,
  injectCustomThemeStyle,
  removeCustomThemeStyle,
  getCustomThemeClass,
} from "../utils/custom-theme";

export type Theme = "light" | "dark" | "day" | "sky" | "night";

export interface ThemeMeta {
  id: Theme;
  label: string;
  description: string;
  /** Mini preview swatches [bg, accent, secondary] */
  swatches: [string, string, string];
  isDark: boolean;
}

export const THEMES: ThemeMeta[] = [
  {
    id: "light",
    label: "Light",
    description: "Clean white · classic neutral",
    swatches: ["#ffffff", "#030213", "#ececf0"],
    isDark: false,
  },
  {
    id: "dark",
    label: "Dark",
    description: "Charcoal · easy on eyes",
    swatches: ["#1c1c1e", "#ffffff", "#2c2c2e"],
    isDark: true,
  },
  {
    id: "day",
    label: "Day Blue",
    description: "Manrope · #369FFF sky-blue",
    swatches: ["#FFFFFF", "#369FFF", "#E6F3FF"],
    isDark: false,
  },
  {
    id: "sky",
    label: "Edu Sky",
    description: "Manrope · blue canvas · #006ED3",
    // bg=light blue canvas, accent=sky-blue, card=white
    swatches: ["#F3F7FF", "#369FFF", "#006ED3"],
    isDark: false,
  },
  {
    id: "night",
    label: "Cosmic Night",
    description: "Mona Sans · #CB3CFF violet",
    swatches: ["#081028", "#CB3CFF", "#0A1330"],
    isDark: true,
  },
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  /** Legacy: cycles light → dark → day → sky → night → light */
  toggleTheme: () => void;
  isDark: boolean;
  /** Apply a user-created custom theme at runtime */
  applyCustomTheme: (config: CustomThemeConfig) => void;
  /** Revert to a built-in system theme (clears any active custom theme) */
  clearCustomTheme: () => void;
  /** Currently-active custom theme id, if any */
  activeCustomThemeId: string | null;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_CYCLE: Theme[] = ["light", "dark", "day", "sky", "night"];

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => {
    // If a custom theme was active, fall back to its base mode
    const customId = localStorage.getItem("rfq-custom-theme-active");
    if (customId) return "light"; // will be overridden by applyCustomTheme on mount
    const saved = localStorage.getItem("rfq-theme") as Theme | null;
    if (saved && THEME_CYCLE.includes(saved)) return saved;
    const legacy = localStorage.getItem("theme");
    if (legacy === "dark") return "dark";
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
    return "light";
  });

  const [activeCustomThemeId, setActiveCustomThemeId] = useState<string | null>(
    () => localStorage.getItem("rfq-custom-theme-active")
  );

  // Remove any lingering custom class from a previous session
  const removeCustomClasses = () => {
    const root = document.documentElement;
    root.classList.forEach((cls) => {
      if (cls.startsWith("theme-custom-")) root.classList.remove(cls);
    });
    removeCustomThemeStyle();
  };

  const applyTheme = (t: Theme) => {
    const root = document.documentElement;
    const meta = THEMES.find((m) => m.id === t)!;

    // 1. Toggle the Tailwind `.dark` class
    root.classList.toggle("dark", meta.isDark);

    // 2. Remove all theme classes (including custom), then add the active one
    root.classList.remove("theme-day", "theme-night", "theme-sky");
    removeCustomClasses();

    if (t === "day") root.classList.add("theme-day");
    if (t === "night") root.classList.add("theme-night");
    if (t === "sky") root.classList.add("theme-sky");

    // 3. Persist
    localStorage.setItem("rfq-theme", t);
    localStorage.setItem("theme", meta.isDark ? "dark" : "light");
  };

  useEffect(() => {
    if (!activeCustomThemeId) {
      applyTheme(theme);
    }
  }, [theme]);

  // On mount: restore a custom theme if one was active
  useEffect(() => {
    if (activeCustomThemeId) {
      try {
        const stored = localStorage.getItem("rfq-custom-themes");
        if (stored) {
          const all: CustomThemeConfig[] = JSON.parse(stored);
          const config = all.find((c) => c.id === activeCustomThemeId);
          if (config) {
            applyCustomThemeInternal(config);
            return;
          }
        }
      } catch {}
      // Custom theme not found — clear and fallback
      clearCustomTheme();
    }
  }, []);

  const applyCustomThemeInternal = (config: CustomThemeConfig) => {
    const root = document.documentElement;

    // Remove built-in theme classes
    root.classList.remove("theme-day", "theme-night", "theme-sky");
    removeCustomClasses();

    // Toggle dark mode
    root.classList.toggle("dark", config.isDark);

    // Inject <style> and add class
    injectCustomThemeStyle(config);
    root.classList.add(getCustomThemeClass(config));

    localStorage.setItem("theme", config.isDark ? "dark" : "light");
  };

  const applyCustomTheme = (config: CustomThemeConfig) => {
    applyCustomThemeInternal(config);
    setActiveCustomThemeId(config.id);
    localStorage.setItem("rfq-custom-theme-active", config.id);
  };

  const clearCustomTheme = () => {
    removeCustomClasses();
    setActiveCustomThemeId(null);
    localStorage.removeItem("rfq-custom-theme-active");
    applyTheme(theme);
  };

  const setTheme = (t: Theme) => {
    // Switching to a built-in theme clears any active custom theme
    if (activeCustomThemeId) {
      removeCustomClasses();
      setActiveCustomThemeId(null);
      localStorage.removeItem("rfq-custom-theme-active");
    }
    setThemeState(t);
  };

  const toggleTheme = () => {
    setThemeState((prev) => {
      const idx = THEME_CYCLE.indexOf(prev);
      const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
      if (activeCustomThemeId) {
        removeCustomClasses();
        setActiveCustomThemeId(null);
        localStorage.removeItem("rfq-custom-theme-active");
      }
      return next;
    });
  };

  const isDark = activeCustomThemeId
    ? document.documentElement.classList.contains("dark")
    : (THEMES.find((m) => m.id === theme)?.isDark ?? false);

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, toggleTheme, isDark, applyCustomTheme, clearCustomTheme, activeCustomThemeId }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}