import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import {
  Palette, Download, Upload, Trash2, Copy, Check, Plus, ArrowLeft,
  Sun, Moon, Eye, Save, FileJson, FileCode, RotateCcw, Sparkles,
  ChevronDown, MoreHorizontal, PaintBucket,
  BarChart3, PanelLeft, CircleDot, Layers,
  Layout as LayoutIcon,
} from "lucide-react";
import { PageHeader } from "../../components/page-header";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
import { Slider } from "../../components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/tabs";
import { Card, CardContent } from "../../components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from "../../components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { cn } from "../../components/ui/utils";
import { useTheme, THEMES, type Theme } from "../../contexts/theme-context";
import {
  type CustomThemeConfig,
  type CustomThemeTokens,
  type ThemeTemplate,
  FONT_OPTIONS,
  THEME_TEMPLATES,
  createBlankTheme,
  getDefaultTokens,
  loadCustomThemes,
  saveCustomTheme,
  deleteCustomTheme as removeFromStorage,
  downloadThemeJSON,
  downloadThemeCSS,
  exportThemeJSON,
  parseImportedJSON,
} from "../../utils/custom-theme";

// ─── Color Sections (grouped editor) ────────────────────────────────

interface TokenField {
  key: keyof CustomThemeTokens;
  label: string;
}

const COLOR_SECTIONS: { title: string; icon: typeof PaintBucket; fields: TokenField[] }[] = [
  {
    title: "Core Colors",
    icon: CircleDot,
    fields: [
      { key: "background", label: "Background" },
      { key: "foreground", label: "Foreground" },
      { key: "primary", label: "Primary" },
      { key: "primaryForeground", label: "Primary Text" },
    ],
  },
  {
    title: "Surface Colors",
    icon: Layers,
    fields: [
      { key: "card", label: "Card" },
      { key: "cardForeground", label: "Card Text" },
      { key: "popover", label: "Popover" },
      { key: "popoverForeground", label: "Popover Text" },
    ],
  },
  {
    title: "UI Colors",
    icon: PaintBucket,
    fields: [
      { key: "secondary", label: "Secondary" },
      { key: "secondaryForeground", label: "Secondary Text" },
      { key: "muted", label: "Muted" },
      { key: "mutedForeground", label: "Muted Text" },
      { key: "accent", label: "Accent" },
      { key: "accentForeground", label: "Accent Text" },
      { key: "destructive", label: "Destructive" },
      { key: "destructiveForeground", label: "Destructive Text" },
    ],
  },
  {
    title: "Controls",
    icon: LayoutIcon,
    fields: [
      { key: "border", label: "Border" },
      { key: "input", label: "Input Border" },
      { key: "inputBackground", label: "Input Background" },
      { key: "switchBackground", label: "Switch Track" },
      { key: "ring", label: "Focus Ring" },
    ],
  },
  {
    title: "Charts",
    icon: BarChart3,
    fields: [
      { key: "chart1", label: "Chart 1" },
      { key: "chart2", label: "Chart 2" },
      { key: "chart3", label: "Chart 3" },
      { key: "chart4", label: "Chart 4" },
      { key: "chart5", label: "Chart 5" },
    ],
  },
  {
    title: "Sidebar",
    icon: PanelLeft,
    fields: [
      { key: "sidebar", label: "Background" },
      { key: "sidebarForeground", label: "Text" },
      { key: "sidebarPrimary", label: "Primary" },
      { key: "sidebarPrimaryForeground", label: "Primary Text" },
      { key: "sidebarAccent", label: "Accent" },
      { key: "sidebarAccentForeground", label: "Accent Text" },
      { key: "sidebarBorder", label: "Border" },
      { key: "sidebarRing", label: "Ring" },
    ],
  },
];

// ─── Color Swatch Picker ─────────────────────────────────────────────

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  // For non-hex values (like "transparent" or rgba), show a text input
  const isHex = /^#[0-9a-f]{3,8}$/i.test(value);

  return (
    <div className="flex items-center gap-2 group">
      <div className="relative">
        <input
          type="color"
          value={isHex ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <div
          className="w-7 h-7 rounded-md border border-border shadow-sm cursor-pointer group-hover:ring-2 ring-ring/30 transition-shadow"
          style={{ backgroundColor: value }}
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-muted-foreground truncate">{label}</p>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-xs text-foreground font-mono border-none outline-none p-0"
        />
      </div>
    </div>
  );
}

// ─── Live Preview Component ──────────────────────────────────────────

function LivePreview({ config }: { config: CustomThemeConfig }) {
  const t = config.tokens;

  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        backgroundColor: t.background,
        color: t.foreground,
        fontFamily: config.fontFamily,
        borderColor: t.border,
        borderRadius: `${config.radius}px`,
      }}
    >
      {/* Fake top bar */}
      <div
        className="flex items-center gap-3 px-4 py-2.5 border-b"
        style={{ backgroundColor: t.sidebar, borderColor: t.sidebarBorder }}
      >
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: t.sidebarPrimary }} />
        <span className="text-xs font-medium" style={{ color: t.sidebarForeground }}>
          Dashboard
        </span>
        <div className="ml-auto flex gap-1.5">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.chart1 }} />
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.chart2 }} />
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.chart3 }} />
        </div>
      </div>

      {/* Content area */}
      <div className="p-4 space-y-3" style={{ backgroundColor: t.background }}>
        {/* Stat cards row */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Revenue", value: "BDT 2.4M", color: t.chart1 },
            { label: "Orders", value: "1,284", color: t.chart2 },
            { label: "Savings", value: "18.5%", color: t.chart3 },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-2.5 rounded-lg border"
              style={{ backgroundColor: t.card, borderColor: t.border, borderRadius: `${Math.max(config.radius - 4, 2)}px` }}
            >
              <p className="text-[9px] mb-0.5" style={{ color: t.mutedForeground }}>{stat.label}</p>
              <p className="text-sm font-semibold" style={{ color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Card with content */}
        <div
          className="p-3 rounded-lg border space-y-2"
          style={{ backgroundColor: t.card, borderColor: t.border, borderRadius: `${Math.max(config.radius - 4, 2)}px` }}
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium" style={{ color: t.cardForeground }}>Recent Tenders</p>
            <span
              className="text-[9px] px-1.5 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: t.secondary, color: t.secondaryForeground }}
            >
              12 Active
            </span>
          </div>

          {/* Table-like rows */}
          {["Tender T-2024-001", "Tender T-2024-002", "Tender T-2024-003"].map((item, i) => (
            <div
              key={item}
              className="flex items-center justify-between py-1.5 border-b last:border-0"
              style={{ borderColor: t.border }}
            >
              <span className="text-[10px]" style={{ color: t.cardForeground }}>{item}</span>
              <span
                className="text-[9px] px-1.5 py-0.5 rounded-full"
                style={{
                  backgroundColor: i === 0 ? t.primary : i === 1 ? t.accent : t.muted,
                  color: i === 0 ? t.primaryForeground : i === 1 ? t.accentForeground : t.mutedForeground,
                }}
              >
                {i === 0 ? "Open" : i === 1 ? "Evaluating" : "Draft"}
              </span>
            </div>
          ))}
        </div>

        {/* Controls preview */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            className="px-3 py-1.5 text-[10px] font-medium rounded-md transition-colors"
            style={{
              backgroundColor: t.primary,
              color: t.primaryForeground,
              borderRadius: `${Math.max(config.radius - 4, 2)}px`,
            }}
          >
            Primary
          </button>
          <button
            className="px-3 py-1.5 text-[10px] font-medium rounded-md border transition-colors"
            style={{
              backgroundColor: t.secondary,
              color: t.secondaryForeground,
              borderColor: t.border,
              borderRadius: `${Math.max(config.radius - 4, 2)}px`,
            }}
          >
            Secondary
          </button>
          <button
            className="px-3 py-1.5 text-[10px] font-medium rounded-md transition-colors"
            style={{
              backgroundColor: t.destructive,
              color: t.destructiveForeground,
              borderRadius: `${Math.max(config.radius - 4, 2)}px`,
            }}
          >
            Danger
          </button>
          <div
            className="px-3 py-1 text-[10px] rounded-md border"
            style={{
              backgroundColor: t.inputBackground,
              borderColor: t.border,
              color: t.mutedForeground,
              borderRadius: `${Math.max(config.radius - 4, 2)}px`,
            }}
          >
            Input field...
          </div>
        </div>

        {/* Mini chart bars */}
        <div className="flex items-end gap-1 h-8">
          {[t.chart1, t.chart2, t.chart3, t.chart4, t.chart5, t.chart1, t.chart2, t.chart3].map((color, i) => (
            <div
              key={i}
              className="flex-1 rounded-t"
              style={{
                backgroundColor: color,
                height: `${20 + Math.sin(i * 1.2) * 15 + 10}%`,
                opacity: 0.85,
                borderRadius: `${Math.max(config.radius / 4, 1)}px ${Math.max(config.radius / 4, 1)}px 0 0`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Template Picker ─────────────────────────────────────────────────

function TemplatePicker({
  onSelect,
  onBlank,
}: {
  onSelect: (template: ThemeTemplate) => void;
  onBlank: (isDark: boolean) => void;
}) {
  const [category, setCategory] = useState<string>("all");

  const filtered =
    category === "all"
      ? THEME_TEMPLATES
      : THEME_TEMPLATES.filter((t) => t.category === category);

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="size-7 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Start with a Template</h2>
        <p className="text-sm text-muted-foreground">Choose a starting point, or begin from a blank canvas</p>
      </div>

      {/* Category tabs */}
      <div className="flex justify-center gap-2 flex-wrap">
        {["all", "professional", "startup", "creative", "dark"].map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={cn(
              "px-3 py-1.5 text-xs rounded-full border transition-colors capitalize",
              category === cat
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-card text-muted-foreground border-border hover:border-primary/40"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {/* Blank cards */}
        <button
          onClick={() => onBlank(false)}
          className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors min-h-[140px]"
        >
          <Sun className="size-6 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Blank Light</span>
          <span className="text-[10px] text-muted-foreground">Start from scratch</span>
        </button>
        <button
          onClick={() => onBlank(true)}
          className="border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:border-primary/50 transition-colors min-h-[140px]"
        >
          <Moon className="size-6 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">Blank Dark</span>
          <span className="text-[10px] text-muted-foreground">Start from scratch</span>
        </button>

        {/* Template cards */}
        {filtered.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className="border border-border rounded-xl overflow-hidden text-left hover:border-primary/50 hover:shadow-md transition-all group"
          >
            {/* Mini preview */}
            <div
              className="h-16 flex items-end gap-1 px-3 pb-2"
              style={{ backgroundColor: template.config.tokens.background }}
            >
              {[template.config.tokens.primary, template.config.tokens.chart2, template.config.tokens.chart3].map((c, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t"
                  style={{ backgroundColor: c, height: `${40 + i * 15}%` }}
                />
              ))}
            </div>
            <div className="p-3 bg-card">
              <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                {template.name}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">{template.description}</p>
              <Badge variant="secondary" className="mt-2 text-[9px] capitalize">{template.category}</Badge>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Theme Studio Editor ─────────────────────────────────────────────

function StudioEditor({
  config,
  onChange,
  onSave,
  onBack,
}: {
  config: CustomThemeConfig;
  onChange: (c: CustomThemeConfig) => void;
  onSave: () => void;
  onBack: () => void;
}) {
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["Core Colors"]));
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const toggleSection = (title: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      next.has(title) ? next.delete(title) : next.add(title);
      return next;
    });
  };

  const updateToken = (key: keyof CustomThemeTokens, value: string) => {
    onChange({
      ...config,
      tokens: { ...config.tokens, [key]: value },
      updatedAt: Date.now(),
    });
  };

  const handleDarkModeToggle = (isDark: boolean) => {
    // Optionally reset tokens to dark/light defaults
    onChange({
      ...config,
      isDark,
      tokens: getDefaultTokens(isDark),
      updatedAt: Date.now(),
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
      {/* Left: Editor panels */}
      <div className="flex-1 min-w-0 space-y-4 order-2 lg:order-1">
        {/* Theme metadata */}
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1">
                <Label className="text-xs">Theme Name</Label>
                <Input
                  placeholder="My Custom Theme"
                  value={config.name}
                  onChange={(e) => onChange({ ...config, name: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs">Description</Label>
                <Input
                  placeholder="A brief description..."
                  value={config.description}
                  onChange={(e) => onChange({ ...config, description: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Label className="text-xs">Dark Mode</Label>
                <Switch
                  checked={config.isDark}
                  onCheckedChange={(checked) => handleDarkModeToggle(!!checked)}
                />
              </div>

              <div className="flex-1 min-w-[180px]">
                <Label className="text-xs">Font Family</Label>
                <select
                  value={config.fontFamily}
                  onChange={(e) => onChange({ ...config, fontFamily: e.target.value })}
                  className="mt-1 w-full h-9 rounded-md border border-border bg-input-background px-3 text-sm text-foreground outline-none"
                >
                  {FONT_OPTIONS.map((f) => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>

              <div className="w-36">
                <Label className="text-xs">Radius: {config.radius}px</Label>
                <Slider
                  min={0}
                  max={24}
                  value={[config.radius]}
                  onValueChange={([v]) => onChange({ ...config, radius: v })}
                  className="mt-2"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Color sections */}
        {COLOR_SECTIONS.map((section) => {
          const Icon = section.icon;
          const isOpen = openSections.has(section.title);
          return (
            <Card key={section.title}>
              <button
                onClick={() => toggleSection(section.title)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/30 transition-colors rounded-t-xl"
              >
                <Icon className="size-4 text-primary shrink-0" />
                <span className="text-sm font-medium text-foreground flex-1">{section.title}</span>
                <span className="text-[10px] text-muted-foreground">{section.fields.length} tokens</span>
                <ChevronDown
                  className={cn("size-4 text-muted-foreground transition-transform", isOpen && "rotate-180")}
                />
              </button>
              {isOpen && (
                <CardContent className="pt-0 pb-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                    {section.fields.map((field) => (
                      <ColorField
                        key={field.key}
                        label={field.label}
                        value={config.tokens[field.key]}
                        onChange={(v) => updateToken(field.key, v)}
                      />
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          );
        })}

        {/* Action bar */}
        <div className="flex flex-wrap items-center gap-2 pb-4">
          <Button onClick={onSave} className="gap-1.5">
            <Save className="size-4" /> Save to Gallery
          </Button>
          <Button variant="outline" onClick={() => setExportDialogOpen(true)} className="gap-1.5">
            <Download className="size-4" /> Export
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              onChange({ ...config, tokens: getDefaultTokens(config.isDark), updatedAt: Date.now() });
              toast.info("Tokens reset to defaults");
            }}
            className="gap-1.5 text-muted-foreground"
          >
            <RotateCcw className="size-4" /> Reset
          </Button>
        </div>
      </div>

      {/* Right: Live preview (sticky on desktop) */}
      <div className="w-full lg:w-80 xl:w-96 shrink-0 order-1 lg:order-2">
        <div className="lg:sticky lg:top-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <Eye className="size-3.5" /> Live Preview
            </p>
            <Badge variant="secondary" className="text-[9px]">
              {config.isDark ? "Dark" : "Light"} Mode
            </Badge>
          </div>
          <LivePreview config={config} />
        </div>
      </div>

      {/* Export dialog */}
      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Theme</DialogTitle>
            <DialogDescription>Download your theme as JSON or CSS</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => { downloadThemeJSON(config); setExportDialogOpen(false); toast.success("JSON downloaded!"); }}
            >
              <FileJson className="size-5 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium">Download JSON</p>
                <p className="text-[10px] text-muted-foreground">Full theme config — can be re-imported later</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => { downloadThemeCSS(config); setExportDialogOpen(false); toast.success("CSS downloaded!"); }}
            >
              <FileCode className="size-5 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium">Download CSS</p>
                <p className="text-[10px] text-muted-foreground">CSS custom properties — paste into your theme.css</p>
              </div>
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3"
              onClick={() => {
                navigator.clipboard.writeText(exportThemeJSON(config));
                toast.success("JSON copied to clipboard!");
                setExportDialogOpen(false);
              }}
            >
              <Copy className="size-5 text-primary" />
              <div className="text-left">
                <p className="text-sm font-medium">Copy JSON to Clipboard</p>
                <p className="text-[10px] text-muted-foreground">Paste and share anywhere</p>
              </div>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Gallery Card ────────────────────────────────────────────────────

function GalleryThemeCard({
  theme,
  isActive,
  isSystem,
  onApply,
  onEdit,
  onDuplicate,
  onDownload,
  onDelete,
}: {
  theme: { id: string; name: string; description: string; isDark: boolean; tokens: CustomThemeTokens; primary: string };
  isActive: boolean;
  isSystem?: boolean;
  onApply: () => void;
  onEdit?: () => void;
  onDuplicate?: () => void;
  onDownload?: () => void;
  onDelete?: () => void;
}) {
  const t = theme.tokens;

  return (
    <div className={cn(
      "border rounded-xl overflow-hidden transition-all group",
      isActive ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/30 hover:shadow-md"
    )}>
      {/* Preview bar */}
      <div className="h-14 flex" style={{ backgroundColor: t.background }}>
        <div className="w-8" style={{ backgroundColor: t.sidebar }} />
        <div className="flex-1 flex items-end gap-1 px-2 pb-1.5">
          {[t.chart1, t.chart2, t.chart3, t.chart4, t.chart5].map((c, i) => (
            <div
              key={i}
              className="flex-1 rounded-t"
              style={{ backgroundColor: c, height: `${30 + ((i * 17) % 40)}%` }}
            />
          ))}
        </div>
      </div>

      <div className="p-3 bg-card space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-medium text-foreground truncate">{theme.name}</p>
              {isActive && (
                <span className="shrink-0 flex items-center gap-0.5 text-[9px] font-semibold text-primary">
                  <Check className="size-3" /> Active
                </span>
              )}
            </div>
            <p className="text-[10px] text-muted-foreground truncate">{theme.description}</p>
          </div>

          {(!isSystem || onDuplicate) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="size-7 shrink-0 opacity-0 group-hover:opacity-100">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {onEdit && <DropdownMenuItem onClick={onEdit}><Palette className="size-3.5 mr-2" /> Edit</DropdownMenuItem>}
                {onDuplicate && <DropdownMenuItem onClick={onDuplicate}><Copy className="size-3.5 mr-2" /> Duplicate</DropdownMenuItem>}
                {onDownload && <DropdownMenuItem onClick={onDownload}><Download className="size-3.5 mr-2" /> Download</DropdownMenuItem>}
                {onDelete && (
                  <DropdownMenuItem onClick={onDelete} className="text-destructive">
                    <Trash2 className="size-3.5 mr-2" /> Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Swatch dots */}
          {[t.background, t.primary, t.card].map((c, i) => (
            <div
              key={i}
              className="w-4 h-4 rounded-full border border-border"
              style={{ backgroundColor: c }}
            />
          ))}
          <Badge variant="secondary" className="ml-auto text-[9px]">
            {theme.isDark ? "Dark" : "Light"}
          </Badge>
        </div>

        <Button
          size="sm"
          variant={isActive ? "secondary" : "default"}
          className="w-full text-xs"
          disabled={isActive}
          onClick={onApply}
        >
          {isActive ? "Currently Active" : "Apply Theme"}
        </Button>
      </div>
    </div>
  );
}

// ─── Upload Dialog ───────────────────────────────────────────────────

function UploadDialog({
  open,
  onOpenChange,
  onImport,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onImport: (config: CustomThemeConfig) => void;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState("");
  const [parsing, setParsing] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setError("");
    setParsing(true);
    try {
      if (!file.name.endsWith(".json")) {
        throw new Error("Please upload a .json theme file");
      }
      if (file.size > 2 * 1024 * 1024) {
        throw new Error("File too large (max 2MB)");
      }
      const text = await file.text();
      const config = parseImportedJSON(text);
      onImport(config);
      onOpenChange(false);
      toast.success(`Imported "${config.name}"!`);
    } catch (err: any) {
      setError(err.message || "Failed to parse theme file");
    } finally {
      setParsing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Theme</DialogTitle>
          <DialogDescription>Upload a .json theme file exported from Theme Studio</DialogDescription>
        </DialogHeader>

        <div
          onDragEnter={() => setDragActive(true)}
          onDragLeave={() => setDragActive(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={cn(
            "border-2 border-dashed rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
          )}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])}
          />
          {parsing ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
              Validating theme...
            </div>
          ) : (
            <>
              <Upload className="size-8 text-muted-foreground" />
              <p className="text-sm text-foreground font-medium">
                Drop .json file here or click to browse
              </p>
              <p className="text-[10px] text-muted-foreground">JSON theme files up to 2MB</p>
            </>
          )}
        </div>

        {error && (
          <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────

export function ThemeStudio() {
  const { theme: activeBuiltIn, setTheme: setBuiltInTheme, applyCustomTheme, clearCustomTheme, activeCustomThemeId } = useTheme();

  const [mainTab, setMainTab] = useState<string>("gallery");
  const [customThemes, setCustomThemes] = useState<CustomThemeConfig[]>([]);
  const [editorConfig, setEditorConfig] = useState<CustomThemeConfig | null>(null);
  const [showTemplates, setShowTemplates] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);

  // Load custom themes from localStorage
  useEffect(() => {
    setCustomThemes(loadCustomThemes());
  }, []);

  // ─── Gallery actions ───────────────────────────────────────────────

  const handleApplyCustom = (config: CustomThemeConfig) => {
    applyCustomTheme(config);
    toast.success(`Applied "${config.name || "Custom Theme"}"`);
  };

  const handleApplySystem = (themeId: string) => {
    clearCustomTheme();
    setBuiltInTheme(themeId as Theme);
    toast.success(`Applied "${THEMES.find(t => t.id === themeId)?.label}"`);
  };

  const handleDeleteCustom = (id: string) => {
    removeFromStorage(id);
    setCustomThemes((prev) => prev.filter((t) => t.id !== id));
    if (activeCustomThemeId === id) {
      clearCustomTheme();
    }
    toast.success("Theme deleted");
  };

  const handleDuplicateCustom = (config: CustomThemeConfig) => {
    const copy: CustomThemeConfig = {
      ...config,
      id: crypto.randomUUID(),
      name: `${config.name} (Copy)`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    saveCustomTheme(copy);
    setCustomThemes((prev) => [...prev, copy]);
    toast.success("Theme duplicated");
  };

  const handleImport = (config: CustomThemeConfig) => {
    saveCustomTheme(config);
    setCustomThemes((prev) => [...prev, config]);
  };

  // ─── Studio actions ────────────────────────────────────────────────

  const startEditing = (config: CustomThemeConfig) => {
    setEditorConfig({ ...config });
    setShowTemplates(false);
    setMainTab("studio");
  };

  const handleTemplateSelect = (template: ThemeTemplate) => {
    const config = createBlankTheme(template.config.isDark);
    setEditorConfig({
      ...config,
      ...template.config,
      id: config.id,
      createdAt: config.createdAt,
      updatedAt: config.updatedAt,
    });
    setShowTemplates(false);
  };

  const handleBlankStart = (isDark: boolean) => {
    setEditorConfig(createBlankTheme(isDark));
    setShowTemplates(false);
  };

  const handleSaveFromEditor = () => {
    if (!editorConfig) return;
    if (!editorConfig.name.trim()) {
      toast.error("Please give your theme a name");
      return;
    }
    saveCustomTheme(editorConfig);
    setCustomThemes(loadCustomThemes());
    toast.success(`Saved "${editorConfig.name}"!`);
  };

  const handleBackToTemplates = () => {
    setShowTemplates(true);
    setEditorConfig(null);
  };

  // Map system themes to gallery card format
  const systemThemeCards = THEMES.map((t) => {
    const tokenMap: Record<string, Partial<CustomThemeTokens>> = {
      light: {
        background: "#ffffff", foreground: "#1c1c1e", card: "#ffffff", cardForeground: "#1c1c1e",
        primary: "#030213", primaryForeground: "#ffffff", secondary: "#ececf0", secondaryForeground: "#030213",
        muted: "#ececf0", mutedForeground: "#717182", accent: "#e9ebef", accentForeground: "#030213",
        destructive: "#d4183d", destructiveForeground: "#ffffff", border: "#e5e5e5",
        sidebar: "#fafafa", sidebarForeground: "#1c1c1e", sidebarPrimary: "#030213",
        chart1: "#f97316", chart2: "#22c55e", chart3: "#3b82f6", chart4: "#eab308", chart5: "#a855f7",
      },
      dark: {
        background: "#1c1c1e", foreground: "#fafafa", card: "#1c1c1e", cardForeground: "#fafafa",
        primary: "#fafafa", primaryForeground: "#1c1c1e", secondary: "#2c2c2e", secondaryForeground: "#fafafa",
        muted: "#2c2c2e", mutedForeground: "#a0a0a0", accent: "#2c2c2e", accentForeground: "#fafafa",
        destructive: "#ef4444", destructiveForeground: "#ffffff", border: "#2c2c2e",
        sidebar: "#161618", sidebarForeground: "#fafafa", sidebarPrimary: "#818cf8",
        chart1: "#818cf8", chart2: "#34d399", chart3: "#fbbf24", chart4: "#f472b6", chart5: "#a78bfa",
      },
      day: {
        background: "#FFFFFF", foreground: "#303030", card: "#F0F7FF", cardForeground: "#303030",
        primary: "#369FFF", primaryForeground: "#FFFFFF", secondary: "#E6F3FF", secondaryForeground: "#1565C0",
        muted: "#F5F8FF", mutedForeground: "#7E89AC", accent: "#E6F3FF", accentForeground: "#369FFF",
        destructive: "#D4183D", destructiveForeground: "#FFFFFF", border: "#d6e8f7",
        sidebar: "#FFFFFF", sidebarForeground: "#303030", sidebarPrimary: "#369FFF",
        chart1: "#369FFF", chart2: "#5AC53E", chart3: "#FFD143", chart4: "#FF993A", chart5: "#006ED3",
      },
      sky: {
        background: "#F3F7FF", foreground: "#303030", card: "#FFFFFF", cardForeground: "#303030",
        primary: "#369FFF", primaryForeground: "#FFFFFF", secondary: "#e6f1ff", secondaryForeground: "#006ED3",
        muted: "#EAF2FF", mutedForeground: "#8EA3B7", accent: "#e6f1ff", accentForeground: "#369FFF",
        destructive: "#D4183D", destructiveForeground: "#FFFFFF", border: "#d0e2f5",
        sidebar: "#FFFFFF", sidebarForeground: "#303030", sidebarPrimary: "#369FFF",
        chart1: "#369FFF", chart2: "#8AC53E", chart3: "#FFD143", chart4: "#FF993A", chart5: "#006ED3",
      },
      night: {
        background: "#081028", foreground: "#FFFFFF", card: "#0A1330", cardForeground: "#FFFFFF",
        primary: "#CB3CFF", primaryForeground: "#FFFFFF", secondary: "#0B1739", secondaryForeground: "#AEB9E1",
        muted: "#0B1739", mutedForeground: "#7E89AC", accent: "#0D1D4A", accentForeground: "#D1DBF9",
        destructive: "#FF4D6D", destructiveForeground: "#FFFFFF", border: "#0B1739",
        sidebar: "#081028", sidebarForeground: "#AEB9E1", sidebarPrimary: "#CB3CFF",
        chart1: "#CB3CFF", chart2: "#7B61FF", chart3: "#3CFFB4", chart4: "#FF6B6B", chart5: "#FFD93D",
      },
    };

    const tokens: CustomThemeTokens = {
      ...getDefaultTokens(t.isDark),
      ...(tokenMap[t.id] || {}),
    } as CustomThemeTokens;

    return {
      id: t.id,
      name: t.label,
      description: t.description,
      isDark: t.isDark,
      tokens,
      primary: tokens.primary,
    };
  });

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <PageHeader
        title="Theme Studio"
        description="Create, manage, and apply custom themes for your platform"
        actions={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setUploadOpen(true)} className="gap-1.5">
              <Upload className="size-4" /> Import
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setShowTemplates(true);
                setEditorConfig(null);
                setMainTab("studio");
              }}
              className="gap-1.5"
            >
              <Plus className="size-4" /> Create Theme
            </Button>
          </div>
        }
      />

      <Tabs value={mainTab} onValueChange={setMainTab} className="mt-2">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="gallery" className="gap-1.5 flex-1 sm:flex-initial">
            <Palette className="size-3.5" /> Gallery
          </TabsTrigger>
          <TabsTrigger value="studio" className="gap-1.5 flex-1 sm:flex-initial">
            <Sparkles className="size-3.5" /> Create / Edit
          </TabsTrigger>
        </TabsList>

        {/* ═══════════════════ Gallery Tab ═══════════════════ */}
        <TabsContent value="gallery">
          <div className="space-y-6 mt-4">
            {/* System Themes */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                System Themes
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                {systemThemeCards.map((st) => (
                  <GalleryThemeCard
                    key={st.id}
                    theme={st}
                    isActive={!activeCustomThemeId && activeBuiltIn === st.id}
                    isSystem
                    onApply={() => handleApplySystem(st.id)}
                    onDuplicate={() => {
                      // Create a custom theme from system theme
                      const config = createBlankTheme(st.isDark);
                      const newConfig: CustomThemeConfig = {
                        ...config,
                        name: `${st.name} (Custom)`,
                        description: st.description,
                        isDark: st.isDark,
                        tokens: { ...st.tokens },
                      };
                      saveCustomTheme(newConfig);
                      setCustomThemes(loadCustomThemes());
                      toast.success(`Duplicated "${st.name}" — edit it in the Studio tab`);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Custom Themes */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-chart-2" />
                Your Custom Themes ({customThemes.length})
              </h3>

              {customThemes.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="py-8 flex flex-col items-center gap-3 text-center">
                    <Palette className="size-10 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No custom themes yet</p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setShowTemplates(true); setEditorConfig(null); setMainTab("studio"); }}
                      className="gap-1.5"
                    >
                      <Plus className="size-4" /> Create your first theme
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {customThemes.map((ct) => (
                    <GalleryThemeCard
                      key={ct.id}
                      theme={{ ...ct, primary: ct.tokens.primary }}
                      isActive={activeCustomThemeId === ct.id}
                      onApply={() => handleApplyCustom(ct)}
                      onEdit={() => startEditing(ct)}
                      onDuplicate={() => handleDuplicateCustom(ct)}
                      onDownload={() => { downloadThemeJSON(ct); toast.success("Downloaded!"); }}
                      onDelete={() => handleDeleteCustom(ct.id)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        {/* ═══════════════════ Studio Tab ═══════════════════ */}
        <TabsContent value="studio">
          <div className="mt-4">
            {showTemplates ? (
              <TemplatePicker
                onSelect={handleTemplateSelect}
                onBlank={handleBlankStart}
              />
            ) : editorConfig ? (
              <>
                <div className="mb-4">
                  <button
                    onClick={handleBackToTemplates}
                    className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group"
                  >
                    <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
                    Back to Templates
                  </button>
                </div>
                <StudioEditor
                  config={editorConfig}
                  onChange={setEditorConfig}
                  onSave={handleSaveFromEditor}
                  onBack={handleBackToTemplates}
                />
              </>
            ) : null}
          </div>
        </TabsContent>
      </Tabs>

      {/* Upload dialog */}
      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} onImport={handleImport} />
    </div>
  );
}