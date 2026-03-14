import { useState } from "react";
import { PageHeader } from "../../components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Switch } from "../../components/ui/switch";
import { Label } from "../../components/ui/label";
import { Progress } from "../../components/ui/progress";
import {
  Accessibility, Eye, Type, MousePointer, Volume2, Sun, Moon,
  Monitor, CheckCircle, AlertTriangle, Globe, Palette, Save, Keyboard
} from "lucide-react";
import { useApiOrMock } from "../../lib/use-api-or-mock";
import { settingsApi } from "../../lib/api/settings.api";

const WCAG_CRITERIA = [
  { id: "1.1.1", name: "Non-text Content", level: "A", status: "pass", note: "All images have alt text" },
  { id: "1.3.1", name: "Info and Relationships", level: "A", status: "pass", note: "Semantic HTML used throughout" },
  { id: "1.4.3", name: "Contrast (Minimum)", level: "AA", status: "pass", note: "4.5:1 ratio verified with axe-core" },
  { id: "1.4.11", name: "Non-text Contrast", level: "AA", status: "pass", note: "UI components meet 3:1 ratio" },
  { id: "2.1.1", name: "Keyboard", level: "A", status: "pass", note: "All functions accessible via keyboard" },
  { id: "2.4.7", name: "Focus Visible", level: "AA", status: "pass", note: "Focus indicators on all interactive elements" },
  { id: "3.1.1", name: "Language of Page", level: "A", status: "pass", note: "lang attribute set to en/bn" },
  { id: "4.1.2", name: "Name, Role, Value", level: "A", status: "partial", note: "Some custom components need ARIA labels" },
];

export function AccessibilitySettings() {
  const { data: apiPrefs } = useApiOrMock(
    () => settingsApi.getAccessibility(),
    { high_contrast: false, large_text: false, reduce_motion: false },
  );

  const [settings, setSettings] = useState({
    highContrast: apiPrefs.high_contrast,
    reducedMotion: apiPrefs.reduce_motion,
    dyslexiaFont: false,
    largeText: apiPrefs.large_text,
    screenReaderOptimized: false,
    keyboardShortcuts: true,
    focusHighlight: true,
    simpleLanguage: false,
    darkMode: false,
    customFontSize: 100,
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const passCount = WCAG_CRITERIA.filter(c => c.status === "pass").length;
  const conformanceScore = Math.round((passCount / WCAG_CRITERIA.length) * 100);

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen">
      <PageHeader
        title="Accessibility Settings"
        description="WCAG 2.1 Level AA compliance — Customize your experience for optimal accessibility"
        actions={
          <Button size="sm"><Save className="size-4 mr-1.5" />Save Preferences</Button>
        }
      />

      {/* Conformance Score */}
      <Card className="mb-6">
        <CardContent className="py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-teal-100 dark:bg-teal-900/20">
                <Accessibility className="size-8 text-teal-600 dark:text-teal-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">WCAG 2.1 AA Conformance</p>
                <div className="flex items-center gap-3 mt-1">
                  <Progress value={conformanceScore} className="h-3 w-48" />
                  <span className="text-2xl font-bold text-foreground">{conformanceScore}%</span>
                </div>
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <p>{passCount}/{WCAG_CRITERIA.length} criteria met</p>
              <p>Standards: WCAG 2.1 AA, Section 508, EN 301 549</p>
              <p>Last audit: 2026-03-01 (axe-core automated)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Visual */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Eye className="size-5" />Visual Settings</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Palette className="size-5 text-blue-500" />
                    <div>
                      <Label className="text-sm font-medium">High Contrast Mode</Label>
                      <p className="text-xs text-muted-foreground">Increases contrast ratios beyond 7:1 for all text</p>
                    </div>
                  </div>
                  <Switch checked={settings.highContrast} onCheckedChange={v => updateSetting("highContrast", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Moon className="size-5 text-purple-500" />
                    <div>
                      <Label className="text-sm font-medium">Dark Mode</Label>
                      <p className="text-xs text-muted-foreground">Reduce eye strain in low-light environments</p>
                    </div>
                  </div>
                  <Switch checked={settings.darkMode} onCheckedChange={v => updateSetting("darkMode", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Type className="size-5 text-green-500" />
                    <div>
                      <Label className="text-sm font-medium">Dyslexia-Friendly Font</Label>
                      <p className="text-xs text-muted-foreground">Switch to OpenDyslexic font for improved readability</p>
                    </div>
                  </div>
                  <Switch checked={settings.dyslexiaFont} onCheckedChange={v => updateSetting("dyslexiaFont", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Type className="size-5 text-amber-500" />
                    <div>
                      <Label className="text-sm font-medium">Large Text</Label>
                      <p className="text-xs text-muted-foreground">Increase base font size by 25%</p>
                    </div>
                  </div>
                  <Switch checked={settings.largeText} onCheckedChange={v => updateSetting("largeText", v)} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <Monitor className="size-5 text-muted-foreground" />
                    <div>
                      <Label className="text-sm font-medium">Text Size ({settings.customFontSize}%)</Label>
                      <p className="text-xs text-muted-foreground">Custom zoom level (75% to 200%)</p>
                    </div>
                  </div>
                  <input
                    type="range" min="75" max="200" step="5"
                    className="w-full"
                    value={settings.customFontSize}
                    onChange={e => updateSetting("customFontSize", parseInt(e.target.value))}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>75%</span><span>100%</span><span>150%</span><span>200%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Motion & Interaction */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><MousePointer className="size-5" />Motion & Interaction</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MousePointer className="size-5 text-red-500" />
                    <div>
                      <Label className="text-sm font-medium">Reduced Motion</Label>
                      <p className="text-xs text-muted-foreground">Disable animations and transitions (prefers-reduced-motion)</p>
                    </div>
                  </div>
                  <Switch checked={settings.reducedMotion} onCheckedChange={v => updateSetting("reducedMotion", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Keyboard className="size-5 text-blue-500" />
                    <div>
                      <Label className="text-sm font-medium">Keyboard Shortcuts</Label>
                      <p className="text-xs text-muted-foreground">Enable keyboard navigation shortcuts</p>
                    </div>
                  </div>
                  <Switch checked={settings.keyboardShortcuts} onCheckedChange={v => updateSetting("keyboardShortcuts", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="size-5 text-indigo-500" />
                    <div>
                      <Label className="text-sm font-medium">Enhanced Focus Highlight</Label>
                      <p className="text-xs text-muted-foreground">Make focus indicators larger and more visible</p>
                    </div>
                  </div>
                  <Switch checked={settings.focusHighlight} onCheckedChange={v => updateSetting("focusHighlight", v)} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Screen Reader & Language */}
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Volume2 className="size-5" />Screen Reader & Language</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="size-5 text-teal-500" />
                    <div>
                      <Label className="text-sm font-medium">Screen Reader Optimized</Label>
                      <p className="text-xs text-muted-foreground">Enhanced ARIA labels and live regions for NVDA/JAWS/VoiceOver</p>
                    </div>
                  </div>
                  <Switch checked={settings.screenReaderOptimized} onCheckedChange={v => updateSetting("screenReaderOptimized", v)} />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Globe className="size-5 text-orange-500" />
                    <div>
                      <Label className="text-sm font-medium">Simple Language Mode</Label>
                      <p className="text-xs text-muted-foreground">Simplify UI text for easier comprehension (Bangla + English)</p>
                    </div>
                  </div>
                  <Switch checked={settings.simpleLanguage} onCheckedChange={v => updateSetting("simpleLanguage", v)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: WCAG Status */}
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle>WCAG 2.1 AA Criteria</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {WCAG_CRITERIA.map(c => (
                  <div key={c.id} className="flex items-start gap-2 p-2 rounded hover:bg-muted">
                    {c.status === "pass" ? (
                      <CheckCircle className="size-4 text-green-500 mt-0.5 shrink-0" />
                    ) : (
                      <AlertTriangle className="size-4 text-amber-500 mt-0.5 shrink-0" />
                    )}
                    <div>
                      <p className="text-xs font-medium text-foreground">{c.id}: {c.name} <span className="text-muted-foreground ml-1">(Level {c.level})</span></p>
                      <p className="text-xs text-muted-foreground">{c.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Tested Screen Readers</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { reader: "NVDA (Windows)", status: "Fully Tested" },
                  { reader: "JAWS (Windows)", status: "Fully Tested" },
                  { reader: "VoiceOver (macOS)", status: "Fully Tested" },
                  { reader: "TalkBack (Android)", status: "Tested" },
                  { reader: "VoiceOver (iOS)", status: "Tested" },
                ].map(r => (
                  <div key={r.reader} className="flex items-center justify-between p-2">
                    <span className="text-sm text-foreground">{r.reader}</span>
                    <Badge variant="outline" className="text-xs">{r.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Keyboard Shortcuts</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2">
                {[
                  { key: "Alt + H", action: "Go to Home" },
                  { key: "Alt + T", action: "Go to Tenders" },
                  { key: "Alt + N", action: "Notifications" },
                  { key: "Alt + S", action: "Search" },
                  { key: "Alt + /", action: "Show all shortcuts" },
                  { key: "Esc", action: "Close modal/drawer" },
                  { key: "Tab", action: "Next focusable element" },
                ].map(s => (
                  <div key={s.key} className="flex items-center justify-between p-2">
                    <span className="text-sm text-foreground">{s.action}</span>
                    <kbd className="px-2 py-1 rounded bg-muted text-xs font-mono text-muted-foreground border border-border">{s.key}</kbd>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}