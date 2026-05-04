import { create } from 'zustand';

export const useTypingStore = create((set) => ({
  mode: 'time', // time, word, custom
  timeLimit: 15,
  wordLimit: 25,
  
  setMode: (mode) => set({ mode }),
  setTimeLimit: (time) => set({ timeLimit: time }),
  setWordLimit: (words) => set({ wordLimit: words }),

  // Runtime stats updated periodically or at end
  liveWpm: 0,
  setLiveWpm: (wpm) => set({ liveWpm: wpm }),
  
  isFinished: false,
  setIsFinished: (status) => set({ isFinished: status })
}));
