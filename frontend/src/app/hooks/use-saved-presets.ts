import { useState, useEffect, useCallback } from "react";

export interface SavedPreset {
  id: string;
  name: string;
  tenderType: string;
  enabledSections: string[];
  disabledFields: string[];
  sectionCount: number;
  fieldCount: number;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_KEY = "rfq_saved_presets";

function loadPresets(): SavedPreset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function persistPresets(presets: SavedPreset[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
}

export function useSavedPresets() {
  const [presets, setPresets] = useState<SavedPreset[]>(loadPresets);

  // Sync with localStorage on mount (handles other tabs)
  useEffect(() => {
    const handler = () => setPresets(loadPresets());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const savePreset = useCallback((preset: Omit<SavedPreset, "id" | "createdAt" | "updatedAt">) => {
    const now = new Date().toISOString();
    const newPreset: SavedPreset = {
      ...preset,
      id: `preset_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      createdAt: now,
      updatedAt: now,
    };
    const updated = [...loadPresets(), newPreset];
    persistPresets(updated);
    setPresets(updated);
    return newPreset;
  }, []);

  const deletePreset = useCallback((id: string) => {
    const updated = loadPresets().filter((p) => p.id !== id);
    persistPresets(updated);
    setPresets(updated);
  }, []);

  const updatePreset = useCallback((id: string, changes: Partial<Omit<SavedPreset, "id" | "createdAt">>) => {
    const updated = loadPresets().map((p) =>
      p.id === id ? { ...p, ...changes, updatedAt: new Date().toISOString() } : p
    );
    persistPresets(updated);
    setPresets(updated);
  }, []);

  return { presets, savePreset, deletePreset, updatePreset };
}
