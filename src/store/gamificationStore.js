import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { calculateLevel, calculateXpEarned } from '../constants/levels';

export const useGamificationStore = create(
  persist(
    (set, get) => ({
      totalXp: 0,
      currentLevel: 1,
      streakDays: 0,
      longestStreak: 0,
      lastPracticeDate: null,
      
      addXpFromSession: (wpm, accuracy, isPersonalBest, noMistakes) => {
        const state = get();
        
        // Streak logic
        const today = new Date().toISOString().split('T')[0];
        let newStreak = state.streakDays;
        
        if (state.lastPracticeDate) {
          const lastDate = new Date(state.lastPracticeDate);
          const currDate = new Date(today);
          const diffDays = Math.floor((currDate - lastDate) / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            newStreak += 1; // Consecutive day
          } else if (diffDays > 1) {
            newStreak = 0; // Streak broken
          }
        } else {
          newStreak = 1; // First time practicing
        }

        const xpEarned = calculateXpEarned(wpm, accuracy, isPersonalBest, newStreak, noMistakes);
        const newTotalXp = state.totalXp + xpEarned;
        const newLevel = calculateLevel(newTotalXp).level;

        set({
          totalXp: newTotalXp,
          currentLevel: newLevel,
          streakDays: newStreak,
          longestStreak: Math.max(state.longestStreak, newStreak),
          lastPracticeDate: today,
        });

        return { xpEarned, newLevel, leveledUp: newLevel > state.currentLevel };
      }
    }),
    {
      name: 'swiftkeys-gamification-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
