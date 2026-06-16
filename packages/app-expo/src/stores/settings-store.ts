/**
 * Settings store — global reading settings
 */
import type { ReadSettings } from "@readany/core/types";
import { create } from "zustand";
import { withPersist } from "./persist";

export interface SettingsState {
  readSettings: ReadSettings;
  settingsUpdatedAt: number;
  hasCompletedOnboarding: boolean;
  showOnboardingGuide: boolean;
  _hasHydrated: boolean;

  completeOnboarding: () => void;
  setShowOnboardingGuide: (show: boolean) => void;
  updateReadSettings: (updates: Partial<ReadSettings>) => void;
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

export const useSettingsStore = create<SettingsState>()(
  withPersist("settings", (set, get, api) => {
    return {
      readSettings: defaultReadSettings,
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

      resetToDefaults: async () => {
        set({
          readSettings: defaultReadSettings,
        });
      },
    };
  }),
);
