import { create } from "zustand";
import type { ReadSettings } from "../types";
import type { TranslationConfig, TranslationTargetLang } from "../types/translation";
import { withPersist } from "./persist";

export interface SettingsState {
  readSettings: ReadSettings;
  translationConfig: TranslationConfig;
  settingsUpdatedAt: number;
  hasCompletedOnboarding: boolean;
  showOnboardingGuide: boolean;
  _hasHydrated: boolean;

  // Actions
  completeOnboarding: () => void;
  setShowOnboardingGuide: (show: boolean) => void;
  updateReadSettings: (updates: Partial<ReadSettings>) => void;
  updateTranslationConfig: (updates: Partial<TranslationConfig>) => void;
  setTranslationLang: (lang: TranslationTargetLang) => void;
  resetToDefaults: () => void;
}

const defaultReadSettings: ReadSettings = {
  fontSize: 16,
  lineHeight: 1.6,
  fontTheme: "system",
  viewMode: "paginated",
  paginatedLayout: "double",
  pageMargin: 40,
  paragraphSpacing: 16,
  showTopTitleProgress: true,
  showBottomTimeBattery: true,
  volumeButtonsPageTurn: false,
  defaultHighlightColor: "yellow",
  followSystemFontScale: false,
};

const defaultTranslationConfig: TranslationConfig = {
  provider: { id: "microsoft", name: "微软翻译 (免费)" },
  targetLang: "zh-CN",
};

export const useSettingsStore = create<SettingsState>()(
  withPersist("settings", (set, get) => ({
    readSettings: defaultReadSettings,
    translationConfig: defaultTranslationConfig,
    settingsUpdatedAt: 0,
    hasCompletedOnboarding: false,
    showOnboardingGuide: true,
    _hasHydrated: false,

    completeOnboarding: () => set({ hasCompletedOnboarding: true }),
    setShowOnboardingGuide: (show: boolean) => set({ showOnboardingGuide: show }),

    updateReadSettings: (updates) =>
      set((state) => ({
        readSettings: { ...state.readSettings, ...updates },
        settingsUpdatedAt: Date.now(),
      })),

    updateTranslationConfig: (updates) =>
      set((state) => ({
        translationConfig: { ...state.translationConfig, ...updates },
        settingsUpdatedAt: Date.now(),
      })),

    setTranslationLang: (lang) =>
      set((state) => ({
        translationConfig: { ...state.translationConfig, targetLang: lang },
        settingsUpdatedAt: Date.now(),
      })),

    resetToDefaults: () =>
      set({
        readSettings: defaultReadSettings,
        translationConfig: defaultTranslationConfig,
        settingsUpdatedAt: Date.now(),
      }),
  })),
);
