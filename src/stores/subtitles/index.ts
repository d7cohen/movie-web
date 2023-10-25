import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface SubtitleStyling {
  /**
   * Text color of subtitles, hex string
   */
  color: string;

  /**
   * size percentage, ranges between 0.01 and 2
   */
  size: number;

  /**
   * background opacity, ranges between 0 and 1
   */
  backgroundOpacity: number;
}

export interface SubtitleStore {
  enabled: boolean;
  lastSelectedLanguage: string | null;
  styling: SubtitleStyling;
  overrideCasing: boolean;
  delay: number;
  updateStyling(newStyling: Partial<SubtitleStyling>): void;
  setLanguage(language: string | null): void;
  setCustomSubs(): void;
  setOverrideCasing(enabled: boolean): void;
  setDelay(delay: number): void;
}

// TODO add migration from previous stored settings
export const useSubtitleStore = create(
  persist(
    immer<SubtitleStore>((set) => ({
      enabled: false,
      lastSelectedLanguage: null,
      overrideCasing: false,
      delay: 0,
      styling: {
        color: "#ffffff",
        backgroundOpacity: 0.5,
        size: 1,
      },
      updateStyling(newStyling) {
        set((s) => {
          if (newStyling.backgroundOpacity !== undefined)
            s.styling.backgroundOpacity = newStyling.backgroundOpacity;
          if (newStyling.color !== undefined)
            s.styling.color = newStyling.color.toLowerCase();
          if (newStyling.size !== undefined)
            s.styling.size = Math.min(2, Math.max(0.01, newStyling.size));
        });
      },
      setLanguage(lang) {
        set((s) => {
          s.enabled = !!lang;
          if (lang) s.lastSelectedLanguage = lang;
        });
      },
      setCustomSubs() {
        set((s) => {
          s.enabled = true;
          s.lastSelectedLanguage = null;
        });
      },
      setOverrideCasing(enabled) {
        set((s) => {
          s.overrideCasing = enabled;
        });
      },
      setDelay(delay) {
        set((s) => {
          s.delay = Math.max(Math.min(500, delay), -500);
        });
      },
    })),
    {
      name: "__MW::subtitles",
    }
  )
);
