import { useRef, useCallback, useEffect } from 'react';
import { useSharedValue } from 'react-native-reanimated';

export function useTypingEngine(wordsArray) {
  const words = useRef(wordsArray);
  const wordIndex = useRef(0);
  const charIndex = useRef(0);
  const startTime = useRef(null);
  const wordStartTime = useRef(null);
  const isActive = useRef(false);
  const isFinished = useRef(false);
  
  // Detailed Analytics Stats
  const errors = useRef(0);
  const mistypedKeys = useRef({}); // { char: count }
  const wordTimes = useRef({}); // { word: timeMs }
  const correctChars = useRef(0);
  const totalChars = useRef(0);
  
  // For scrolling
  const activeLine = useSharedValue(0);

  // We need to trigger re-renders only for the active word if possible.
  // For now, we will use a callback to notify the UI of state changes.
  const stateUpdateListeners = useRef([]);

  const subscribe = useCallback((listener) => {
    stateUpdateListeners.current.push(listener);
    return () => {
      stateUpdateListeners.current = stateUpdateListeners.current.filter((l) => l !== listener);
    };
  }, []);

  const notify = useCallback(() => {
    stateUpdateListeners.current.forEach((l) => l());
  }, []);

  // charStates: pending | correct | incorrect | extra
  const charStates = useRef(wordsArray.map(word => Array([...word].length).fill('pending')));
  const extraChars = useRef(wordsArray.map(() => [])); // extra characters typed

  const handleKeyPress = useCallback((key) => {
    if (isFinished.current) return;

    if (!isActive.current) {
      isActive.current = true;
      startTime.current = Date.now();
      wordStartTime.current = Date.now();
      notify();
    }

    const currentWord = words.current[wordIndex.current];
    const currentCharIdx = charIndex.current;
    
    if (key === 'Backspace') {
      if (currentCharIdx > 0) {
        charIndex.current -= 1;
        
        // If we have extra characters, remove the last one
        if (extraChars.current[wordIndex.current].length > 0) {
          extraChars.current[wordIndex.current].pop();
        } else {
          // Otherwise revert the state of the normal character
          charStates.current[wordIndex.current][charIndex.current] = 'pending';
        }
        notify();
      } else if (wordIndex.current > 0) {
        // Option: allow going back to previous word if it had errors
        // Currently we do not allow cursor to go before word start easily unless it's incomplete
        // Let's keep it simple: can't go back a word once space is pressed.
      }
      return;
    }

    if (key === ' ') {
      // Space advances to next word
      if (currentCharIdx > 0 || extraChars.current[wordIndex.current].length > 0) {
        // Record word time
        const wordTime = Date.now() - wordStartTime.current;
        wordTimes.current[currentWord] = (wordTimes.current[currentWord] || 0) + wordTime;
        wordStartTime.current = Date.now();

        wordIndex.current += 1;
        charIndex.current = 0;
        notify();
      }
      return;
    }

    // Normal character input
    totalChars.current += 1;
    
    const wordChars = [...currentWord];
    
    if (currentCharIdx < wordChars.length) {
      // Inside word bounds
      const expectedChar = wordChars[currentCharIdx];
      if (key === expectedChar) {
        charStates.current[wordIndex.current][currentCharIdx] = 'correct';
        correctChars.current += 1;
      } else {
        charStates.current[wordIndex.current][currentCharIdx] = 'incorrect';
        errors.current += 1;
        mistypedKeys.current[expectedChar] = (mistypedKeys.current[expectedChar] || 0) + 1;
      }
      charIndex.current += 1;
    } else {
      // Extra characters
      extraChars.current[wordIndex.current].push(key);
      charIndex.current += 1;
      errors.current += 1;
    }
    
    notify();
  }, [notify]);

  const restart = useCallback((newWordsArray) => {
    words.current = newWordsArray;
    wordIndex.current = 0;
    charIndex.current = 0;
    startTime.current = null;
    wordStartTime.current = null;
    isActive.current = false;
    isFinished.current = false;
    errors.current = 0;
    correctChars.current = 0;
    totalChars.current = 0;
    mistypedKeys.current = {};
    wordTimes.current = {};
    charStates.current = newWordsArray.map(w => Array([...w].length).fill('pending'));
    extraChars.current = newWordsArray.map(() => []);
    activeLine.value = 0;
    notify();
  }, [notify, activeLine]);

  return {
    words,
    charStates,
    extraChars,
    wordIndex,
    charIndex,
    startTime,
    isActive,
    isFinished,
    errors,
    correctChars,
    totalChars,
    mistypedKeys,
    wordTimes,
    handleKeyPress,
    subscribe,
    restart,
    activeLine
  };
}
