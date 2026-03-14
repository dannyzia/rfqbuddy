import { useState, useRef, useEffect } from "react";
import { Palette, Check } from "lucide-react";
import { useTheme, THEMES, type Theme } from "../contexts/theme-context";
import { cn } from "./ui/utils";

interface ThemePickerProps {
  /** Show full label next to the swatch dots (expanded sidebar) */
  showLabel?: boolean;
  /** Open the panel downward (header/topbar); default is upward (sidebar bottom) */
  openDown?: boolean;
  /** Extra class names on the trigger button */
  className?: string;
}

export function ThemePicker({
  showLabel = false,
  openDown = false,
  className,
}: ThemePickerProps) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const current = THEMES.find((t) => t.id === theme) ?? THEMES[0];

  return (
    <div ref={ref} className="relative">
      {/* ── Trigger ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Change theme"
        className={cn(
          "flex items-center gap-3 transition-colors w-full",
          showLabel
            ? "px-4 py-3 text-foreground hover:bg-muted"
            : "justify-center px-3 py-2.5 text-foreground hover:bg-muted",
          open && "bg-muted",
          className
        )}
      >
        {/* 3-dot swatch preview of active theme */}
        <span className="flex items-center gap-0.5 shrink-0">
          {current.swatches.map((color, i) => (
            <span
              key={i}
              className="rounded-full border border-black/10 shrink-0"
              style={{
                backgroundColor: color,
                width: i === 0 ? 10 : 7,
                height: i === 0 ? 10 : 7,
                display: "inline-block",
              }}
            />
          ))}
        </span>

        {showLabel && (
          <>
            <span className="text-sm flex-1 text-left truncate">{current.label}</span>
            <Palette className="size-3.5 opacity-40 shrink-0" />
          </>
        )}
      </button>

      {/* ── Panel ── */}
      {open && (
        <div
          className={cn(
            "absolute z-[9999] w-60 rounded-xl p-2",
            // Always use neutral panel colours so it looks right in every theme
            "bg-white border border-gray-200 shadow-2xl",
            // Vertical placement
            openDown ? "top-full mt-2" : "bottom-full mb-2",
            // Horizontal placement — align right if no label (collapsed/topbar)
            showLabel ? "left-0" : "right-0"
          )}
          // Prevent Tailwind dark-class overrides from inverting the panel
          style={{ colorScheme: "light" }}
        >
          <p className="px-2 pt-1 pb-2 text-[10px] font-semibold text-gray-400 uppercase tracking-widest border-b border-gray-100">
            Choose Theme
          </p>

          <div className="mt-1 space-y-0.5">
            {THEMES.map((t) => (
              <ThemeOption
                key={t.id}
                meta={t}
                active={theme === t.id}
                onSelect={() => {
                  setTheme(t.id as Theme);
                  setOpen(false);
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────── ThemeOption ── */

function ThemeOption({
  meta,
  active,
  onSelect,
}: {
  meta: (typeof THEMES)[number];
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={cn(
        "w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-left transition-colors",
        active ? "bg-indigo-50" : "hover:bg-gray-50"
      )}
    >
      <ThemePreviewCard swatches={meta.swatches} isDark={meta.isDark} />

      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm truncate",
            active ? "text-indigo-700 font-semibold" : "text-gray-700"
          )}
        >
          {meta.label}
        </p>
        <p className="text-[10px] text-gray-400 truncate">{meta.description}</p>
      </div>

      {active ? (
        <Check className="size-3.5 shrink-0 text-indigo-600" />
      ) : (
        <span className="size-3.5 shrink-0" />
      )}
    </button>
  );
}

/* ─────────────────────────────── ThemePreviewCard ── */

function ThemePreviewCard({
  swatches,
  isDark,
}: {
  swatches: [string, string, string];
  isDark: boolean;
}) {
  const [bg, accent, secondary] = swatches;
  return (
    <div
      className="w-10 h-7 rounded-md shrink-0 overflow-hidden border border-black/10 flex"
      style={{ backgroundColor: bg }}
    >
      {/* Sidebar strip */}
      <div className="w-3 h-full" style={{ backgroundColor: secondary }} />
      {/* Content area */}
      <div className="flex-1 flex flex-col gap-0.5 p-0.5 pt-1">
        <div style={{ height: 4, borderRadius: 2, backgroundColor: accent, opacity: 0.9 }} />
        <div style={{ height: 3, borderRadius: 2, backgroundColor: accent, opacity: 0.3 }} />
        <div style={{ height: 3, borderRadius: 2, backgroundColor: accent, opacity: 0.15 }} />
      </div>
    </div>
  );
}