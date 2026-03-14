/**
 * Custom Theme utilities — type definitions, storage, CSS generation, export/import.
 * Custom themes map directly to the CSS custom properties defined in theme.css.
 */

// ─── Types ───────────────────────────────────────────────────────────

export interface CustomThemeTokens {
  // Core
  background: string;
  foreground: string;
  // Surface
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  // Brand
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  // UI
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  // Controls
  border: string;
  input: string;
  inputBackground: string;
  switchBackground: string;
  ring: string;
  // Charts
  chart1: string;
  chart2: string;
  chart3: string;
  chart4: string;
  chart5: string;
  // Sidebar
  sidebar: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

export interface CustomThemeConfig {
  id: string;
  name: string;
  description: string;
  isDark: boolean;
  fontFamily: string;
  radius: number; // px
  tokens: CustomThemeTokens;
  createdAt: number;
  updatedAt: number;
}

export type CustomThemeExport = Omit<CustomThemeConfig, "id" | "createdAt" | "updatedAt"> & {
  version: string;
};

// ─── Defaults / Templates ────────────────────────────────────────────

export const FONT_OPTIONS = [
  { label: "System Default", value: "system-ui, sans-serif" },
  { label: "Inter", value: "'Inter', system-ui, sans-serif" },
  { label: "Manrope", value: "'Manrope', system-ui, sans-serif" },
  { label: "Mona Sans", value: "'Mona Sans', 'Inter', system-ui, sans-serif" },
  { label: "JetBrains Mono", value: "'JetBrains Mono', monospace" },
  { label: "Space Grotesk", value: "'Space Grotesk', sans-serif" },
  { label: "Source Sans Pro", value: "'Source Sans Pro', sans-serif" },
];

const LIGHT_DEFAULTS: CustomThemeTokens = {
  background: "#ffffff",
  foreground: "#0f172a",
  card: "#ffffff",
  cardForeground: "#0f172a",
  popover: "#ffffff",
  popoverForeground: "#0f172a",
  primary: "#6366f1",
  primaryForeground: "#ffffff",
  secondary: "#f1f5f9",
  secondaryForeground: "#0f172a",
  muted: "#f1f5f9",
  mutedForeground: "#64748b",
  accent: "#f1f5f9",
  accentForeground: "#0f172a",
  destructive: "#ef4444",
  destructiveForeground: "#ffffff",
  border: "#e2e8f0",
  input: "transparent",
  inputBackground: "#f8fafc",
  switchBackground: "#cbd5e1",
  ring: "#6366f1",
  chart1: "#6366f1",
  chart2: "#10b981",
  chart3: "#f59e0b",
  chart4: "#ef4444",
  chart5: "#8b5cf6",
  sidebar: "#ffffff",
  sidebarForeground: "#0f172a",
  sidebarPrimary: "#6366f1",
  sidebarPrimaryForeground: "#ffffff",
  sidebarAccent: "#f1f5f9",
  sidebarAccentForeground: "#6366f1",
  sidebarBorder: "#e2e8f0",
  sidebarRing: "#6366f1",
};

const DARK_DEFAULTS: CustomThemeTokens = {
  background: "#0f172a",
  foreground: "#f8fafc",
  card: "#1e293b",
  cardForeground: "#f8fafc",
  popover: "#1e293b",
  popoverForeground: "#f8fafc",
  primary: "#818cf8",
  primaryForeground: "#0f172a",
  secondary: "#334155",
  secondaryForeground: "#f8fafc",
  muted: "#334155",
  mutedForeground: "#94a3b8",
  accent: "#334155",
  accentForeground: "#f8fafc",
  destructive: "#f87171",
  destructiveForeground: "#0f172a",
  border: "#334155",
  input: "#334155",
  inputBackground: "#1e293b",
  switchBackground: "#475569",
  ring: "#818cf8",
  chart1: "#818cf8",
  chart2: "#34d399",
  chart3: "#fbbf24",
  chart4: "#f87171",
  chart5: "#a78bfa",
  sidebar: "#0f172a",
  sidebarForeground: "#94a3b8",
  sidebarPrimary: "#818cf8",
  sidebarPrimaryForeground: "#ffffff",
  sidebarAccent: "#1e293b",
  sidebarAccentForeground: "#f8fafc",
  sidebarBorder: "#334155",
  sidebarRing: "#818cf8",
};

export function getDefaultTokens(isDark: boolean): CustomThemeTokens {
  return isDark ? { ...DARK_DEFAULTS } : { ...LIGHT_DEFAULTS };
}

export function createBlankTheme(isDark = false): CustomThemeConfig {
  return {
    id: crypto.randomUUID(),
    name: "",
    description: "",
    isDark,
    fontFamily: "system-ui, sans-serif",
    radius: 10,
    tokens: getDefaultTokens(isDark),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// ─── Templates ───────────────────────────────────────────────────────

export interface ThemeTemplate {
  id: string;
  name: string;
  description: string;
  category: "professional" | "startup" | "creative" | "dark";
  config: Omit<CustomThemeConfig, "id" | "createdAt" | "updatedAt">;
}

export const THEME_TEMPLATES: ThemeTemplate[] = [
  {
    id: "modern-minimal",
    name: "Modern Minimal",
    description: "Clean lines, ample whitespace, subtle shadows",
    category: "professional",
    config: {
      name: "Modern Minimal",
      description: "Clean lines, ample whitespace, subtle shadows",
      isDark: false,
      fontFamily: "'Inter', system-ui, sans-serif",
      radius: 8,
      tokens: { ...LIGHT_DEFAULTS, primary: "#0f172a", primaryForeground: "#ffffff", ring: "#0f172a", sidebarPrimary: "#0f172a", sidebarAccentForeground: "#0f172a", chart1: "#0f172a", chart5: "#64748b" },
    },
  },
  {
    id: "vibrant-saas",
    name: "Vibrant SaaS",
    description: "Bold indigo, high energy startup feel",
    category: "startup",
    config: {
      name: "Vibrant SaaS",
      description: "Bold indigo, high energy startup feel",
      isDark: false,
      fontFamily: "'Inter', system-ui, sans-serif",
      radius: 16,
      tokens: { ...LIGHT_DEFAULTS, primary: "#6366f1", primaryForeground: "#ffffff", accent: "#ede9fe", accentForeground: "#6366f1", ring: "#6366f1", chart1: "#6366f1", chart2: "#ec4899", chart3: "#f59e0b", chart4: "#10b981", chart5: "#06b6d4" },
    },
  },
  {
    id: "ocean-blue",
    name: "Ocean Blue",
    description: "Professional blue, corporate and trustworthy",
    category: "professional",
    config: {
      name: "Ocean Blue",
      description: "Professional blue, corporate and trustworthy",
      isDark: false,
      fontFamily: "'Inter', system-ui, sans-serif",
      radius: 6,
      tokens: { ...LIGHT_DEFAULTS, primary: "#2563eb", primaryForeground: "#ffffff", secondary: "#eff6ff", secondaryForeground: "#1e40af", accent: "#eff6ff", accentForeground: "#2563eb", ring: "#2563eb", sidebarPrimary: "#2563eb", sidebarAccentForeground: "#2563eb", chart1: "#2563eb", chart2: "#16a34a", chart3: "#eab308", chart4: "#dc2626", chart5: "#7c3aed" },
    },
  },
  {
    id: "dark-cyber",
    name: "Dark Cyber",
    description: "Neon accents, dark mode, tech aesthetic",
    category: "dark",
    config: {
      name: "Dark Cyber",
      description: "Neon accents, dark mode, tech aesthetic",
      isDark: true,
      fontFamily: "'JetBrains Mono', monospace",
      radius: 4,
      tokens: { ...DARK_DEFAULTS, background: "#0a0a0f", foreground: "#e2e8f0", card: "#13131f", cardForeground: "#e2e8f0", popover: "#13131f", popoverForeground: "#e2e8f0", primary: "#00ff9d", primaryForeground: "#0a0a0f", secondary: "#1a1a2e", secondaryForeground: "#e2e8f0", muted: "#1a1a2e", mutedForeground: "#64748b", accent: "#1a1a2e", accentForeground: "#00ff9d", border: "#1e1e35", input: "#1a1a2e", inputBackground: "#13131f", switchBackground: "#2a2a45", ring: "#00ff9d", chart1: "#00ff9d", chart2: "#00b8ff", chart3: "#ff6b6b", chart4: "#ffd93d", chart5: "#cb3cff", sidebar: "#0a0a0f", sidebarForeground: "#94a3b8", sidebarPrimary: "#00ff9d", sidebarPrimaryForeground: "#0a0a0f", sidebarAccent: "#13131f", sidebarAccentForeground: "#00ff9d", sidebarBorder: "#1e1e35", sidebarRing: "#00ff9d" },
    },
  },
  {
    id: "sunset-warm",
    name: "Sunset Warm",
    description: "Warm oranges and terracotta",
    category: "creative",
    config: {
      name: "Sunset Warm",
      description: "Warm oranges and terracotta, inviting feel",
      isDark: false,
      fontFamily: "'Manrope', system-ui, sans-serif",
      radius: 12,
      tokens: { ...LIGHT_DEFAULTS, background: "#fffaf5", foreground: "#44403c", card: "#ffffff", cardForeground: "#44403c", primary: "#ea580c", primaryForeground: "#ffffff", secondary: "#fff7ed", secondaryForeground: "#c2410c", muted: "#fef3c7", mutedForeground: "#78716c", accent: "#fff7ed", accentForeground: "#ea580c", border: "#fed7aa", ring: "#ea580c", chart1: "#ea580c", chart2: "#16a34a", chart3: "#eab308", chart4: "#dc2626", chart5: "#9333ea", sidebar: "#ffffff", sidebarPrimary: "#ea580c", sidebarAccentForeground: "#ea580c", sidebarBorder: "#fed7aa", sidebarRing: "#ea580c" },
    },
  },
  {
    id: "midnight-purple",
    name: "Midnight Purple",
    description: "Deep purple dark mode with violet glow",
    category: "dark",
    config: {
      name: "Midnight Purple",
      description: "Deep purple dark mode with violet glow",
      isDark: true,
      fontFamily: "'Mona Sans', 'Inter', system-ui, sans-serif",
      radius: 10,
      tokens: { ...DARK_DEFAULTS, background: "#0c0a1a", foreground: "#ede9fe", card: "#1a1533", cardForeground: "#ede9fe", popover: "#1a1533", popoverForeground: "#ede9fe", primary: "#a78bfa", primaryForeground: "#0c0a1a", secondary: "#2e1065", secondaryForeground: "#c4b5fd", muted: "#2e1065", mutedForeground: "#7c3aed", accent: "#2e1065", accentForeground: "#c4b5fd", border: "#3b2875", ring: "#a78bfa", chart1: "#a78bfa", chart2: "#22d3ee", chart3: "#fbbf24", chart4: "#f472b6", chart5: "#34d399", sidebar: "#0c0a1a", sidebarForeground: "#c4b5fd", sidebarPrimary: "#a78bfa", sidebarPrimaryForeground: "#ffffff", sidebarAccent: "#1a1533", sidebarAccentForeground: "#c4b5fd", sidebarBorder: "#3b2875", sidebarRing: "#a78bfa" },
    },
  },
];

// ─── CSS Generation ──────────────────────────────────────────────────

function tokensToCSSProperties(tokens: CustomThemeTokens): Record<string, string> {
  return {
    "--background": tokens.background,
    "--foreground": tokens.foreground,
    "--card": tokens.card,
    "--card-foreground": tokens.cardForeground,
    "--popover": tokens.popover,
    "--popover-foreground": tokens.popoverForeground,
    "--primary": tokens.primary,
    "--primary-foreground": tokens.primaryForeground,
    "--secondary": tokens.secondary,
    "--secondary-foreground": tokens.secondaryForeground,
    "--muted": tokens.muted,
    "--muted-foreground": tokens.mutedForeground,
    "--accent": tokens.accent,
    "--accent-foreground": tokens.accentForeground,
    "--destructive": tokens.destructive,
    "--destructive-foreground": tokens.destructiveForeground,
    "--border": tokens.border,
    "--input": tokens.input,
    "--input-background": tokens.inputBackground,
    "--switch-background": tokens.switchBackground,
    "--ring": tokens.ring,
    "--chart-1": tokens.chart1,
    "--chart-2": tokens.chart2,
    "--chart-3": tokens.chart3,
    "--chart-4": tokens.chart4,
    "--chart-5": tokens.chart5,
    "--sidebar": tokens.sidebar,
    "--sidebar-foreground": tokens.sidebarForeground,
    "--sidebar-primary": tokens.sidebarPrimary,
    "--sidebar-primary-foreground": tokens.sidebarPrimaryForeground,
    "--sidebar-accent": tokens.sidebarAccent,
    "--sidebar-accent-foreground": tokens.sidebarAccentForeground,
    "--sidebar-border": tokens.sidebarBorder,
    "--sidebar-ring": tokens.sidebarRing,
  };
}

export function generateCSSBlock(config: CustomThemeConfig): string {
  const props = tokensToCSSProperties(config.tokens);
  const lines = Object.entries(props)
    .map(([k, v]) => `  ${k}: ${v};`)
    .join("\n");

  return `.theme-custom-${config.id.slice(0, 8)} {\n${lines}\n  --radius: ${config.radius / 16}rem;\n  font-family: ${config.fontFamily};\n  color-scheme: ${config.isDark ? "dark" : "light"};\n}`;
}

/** Inject a <style> tag for a custom theme, returns the element for cleanup */
export function injectCustomThemeStyle(config: CustomThemeConfig): HTMLStyleElement {
  // Remove any existing custom theme style
  removeCustomThemeStyle();
  const style = document.createElement("style");
  style.id = "custom-theme-style";
  style.textContent = generateCSSBlock(config);
  document.head.appendChild(style);
  return style;
}

export function removeCustomThemeStyle() {
  document.getElementById("custom-theme-style")?.remove();
}

export function getCustomThemeClass(config: CustomThemeConfig): string {
  return `theme-custom-${config.id.slice(0, 8)}`;
}

// ─── Storage ─────────────────────────────────────────────────────────

const STORAGE_KEY = "rfq-custom-themes";

export function loadCustomThemes(): CustomThemeConfig[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveCustomThemes(themes: CustomThemeConfig[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(themes));
}

export function saveCustomTheme(theme: CustomThemeConfig) {
  const all = loadCustomThemes();
  const idx = all.findIndex((t) => t.id === theme.id);
  if (idx >= 0) {
    all[idx] = { ...theme, updatedAt: Date.now() };
  } else {
    all.push(theme);
  }
  saveCustomThemes(all);
}

export function deleteCustomTheme(id: string) {
  const all = loadCustomThemes().filter((t) => t.id !== id);
  saveCustomThemes(all);
}

// ─── Export / Import ─────────────────────────────────────────────────

export function exportThemeJSON(config: CustomThemeConfig): string {
  const exp: CustomThemeExport = {
    version: "1.0.0",
    name: config.name || "Untitled Theme",
    description: config.description,
    isDark: config.isDark,
    fontFamily: config.fontFamily,
    radius: config.radius,
    tokens: config.tokens,
  };
  return JSON.stringify(exp, null, 2);
}

export function downloadThemeJSON(config: CustomThemeConfig) {
  const json = exportThemeJSON(config);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(config.name || "custom-theme").replace(/\s+/g, "-").toLowerCase()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function downloadThemeCSS(config: CustomThemeConfig) {
  const css = generateCSSBlock(config);
  const blob = new Blob([css], { type: "text/css" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(config.name || "custom-theme").replace(/\s+/g, "-").toLowerCase()}.css`;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseImportedJSON(text: string): CustomThemeConfig {
  const data = JSON.parse(text);

  // Validate required fields
  if (!data.tokens || typeof data.tokens !== "object") {
    throw new Error("Invalid theme: missing tokens object");
  }
  if (!data.tokens.primary || !data.tokens.background) {
    throw new Error("Invalid theme: missing required color tokens (primary, background)");
  }

  // Build a full config from the import
  const isDark = data.isDark ?? false;
  const defaults = getDefaultTokens(isDark);

  return {
    id: crypto.randomUUID(),
    name: data.name || "Imported Theme",
    description: data.description || "",
    isDark,
    fontFamily: data.fontFamily || "system-ui, sans-serif",
    radius: data.radius ?? 10,
    tokens: { ...defaults, ...data.tokens },
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}
