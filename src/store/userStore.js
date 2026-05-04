import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { THEMES } from '../constants/themes';

export const useUserStore = create(
  persist(
    (set) => ({
      // Theme
      activeTheme: 'dark',
      setTheme: (themeName) => set({ activeTheme: themeName }),

      // Settings
      soundEnabled: true,
      hapticsEnabled: true,
      focusMode: false,
      language: 'en', // 'en' | 'hi' | 'hinglish'
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      toggleHaptics: () => set((state) => ({ hapticsEnabled: !state.hapticsEnabled })),
      toggleFocusMode: () => set((state) => ({ focusMode: !state.focusMode })),
      setLanguage: (lang) => set({ language: lang }),

      // User Profile / Adaptive AI data
      weakKeys: {},
      slowWords: {},
      avgWpm: 0,
      avgAccuracy: 0,
      difficultyLevel: 'easy',
      sessionHistory: [],
      
      recordSession: (sessionSummary) => set((state) => {
        // Here we'd normally calculate the rolling average
        const newHistory = [...state.sessionHistory, sessionSummary].slice(-30);
        return {
          sessionHistory: newHistory,
        };
      }),

      updateProfile: ({ newMistypedKeys, newSlowWords, sessionWpm, sessionAccuracy }) => set((state) => {
        const weakKeys = { ...state.weakKeys };
        for (const [key, count] of Object.entries(newMistypedKeys)) {
          weakKeys[key] = (weakKeys[key] || 0) + count;
        }

        const slowWords = { ...state.slowWords };
        for (const [word, count] of Object.entries(newSlowWords)) {
          slowWords[word] = (slowWords[word] || 0) + count;
        }

        // Rolling average (simplified)
        const avgWpm = state.avgWpm === 0 ? sessionWpm : Math.round((state.avgWpm * 9 + sessionWpm) / 10);
        const avgAccuracy = state.avgAccuracy === 0 ? sessionAccuracy : Number(((state.avgAccuracy * 9 + sessionAccuracy) / 10).toFixed(1));

        // Adaptive Difficulty Logic
        let difficultyLevel = state.difficultyLevel;
        if (avgAccuracy < 85) difficultyLevel = 'easy';
        else if (avgAccuracy > 95 && avgWpm > 60) difficultyLevel = 'hard';
        else if (avgWpm > 80) difficultyLevel = 'expert';
        else difficultyLevel = 'medium';

        return { weakKeys, slowWords, avgWpm, avgAccuracy, difficultyLevel };
      }),
    }),
    {
      name: 'swiftkeys-user-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
