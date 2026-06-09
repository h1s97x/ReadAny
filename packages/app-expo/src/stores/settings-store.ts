/**
 * Settings store — global reading settings, translation config
 */
import type { ReadSettings } from "@readany/core/types";
import type { TranslationConfig, TranslationTargetLang } from "@readany/core/types/translation";
import { create } from "zustand";
import { withPersist } from "./persist";

export interface SettingsState {
  readSettings: ReadSettings;
  translationConfig: TranslationConfig;
  settingsUpdatedAt: number;
  hasCompletedOnboarding: boolean;
  showOnboardingGuide: boolean;
  _hasHydrated: boolean;

  completeOnboarding: () => void;
  setShowOnboardingGuide: (show: boolean) => void;
  updateReadSettings: (updates: Partial<ReadSettings>) => void;
  updateTranslationConfig: (updates: Partial<TranslationConfig>) => void;
  setTranslationLang: (lang: TranslationTargetLang) => void;
  resetToDefaults: () => Promise<void>;
}

const defaultReadSettings: ReadSettings = {
  fontSize: 16,
  lineHeight: 1.6,
  fontTheme: "classic",
  viewMode: "paginated",
  paginatedLayout: "double",
  pageMargin: 40,
  paragraphSpacing: 16,
  showTopTitleProgress: true,
  showBottomTimeBattery: true,
  volumeButtonsPageTurn: false,
  defaultHighlightColor: "yellow",
};

const defaultTranslationConfig: TranslationConfig = {
  provider: { id: "ai", name: "AI 翻译" },
  targetLang: "zh-CN",
};

export const useSettingsStore = create<SettingsState>()(
  withPersist("settings", (set, get, api) => {
    return {
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
        })),

      resetToDefaults: async () => {
        set({
          readSettings: defaultReadSettings,
          translationConfig: defaultTranslationConfig,
        });
      },
    };
  }),
);
