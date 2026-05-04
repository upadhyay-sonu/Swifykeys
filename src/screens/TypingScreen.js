import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { TypingEngine } from '../components/TypingEngine';
import { ModeSelector } from '../components/ModeSelector';
import { StatsBar } from '../components/StatsBar';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { useTypingStore } from '../store/typingStore';
import { useUserStore } from '../store/userStore';
import { THEMES } from '../constants/themes';
import { calculateWpm } from '../utils/wpmCalc';
import { calculateAccuracy } from '../utils/accuracyCalc';
import { generateAdaptiveWordList, CODE_SNIPPETS } from '../utils/difficultyEngine';

export const TypingScreen = ({ navigation }) => {
  const { mode, timeLimit, wordLimit, setLiveWpm, setIsFinished } = useTypingStore();
  const activeTheme = useUserStore((state) => state.activeTheme);
  const focusMode = useUserStore((state) => state.focusMode);
  const userProfile = useUserStore((state) => state);
  const currentTheme = THEMES[activeTheme] || THEMES.dark;

  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [wordProgress, setWordProgress] = useState(`0/${wordLimit}`);
  
  const getInitialWords = (currentMode, count) => {
    if (currentMode === 'code') {
      const snippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
      // Split snippet by spaces but keep newlines as part of words or split by whitespace
      // For code, preserving spaces is important, but for now we'll split by whitespace and add a special marker if needed.
      // We will just split by space/newline to treat them as words.
      return snippet.split(/\s+/).filter(Boolean);
    }
    return generateAdaptiveWordList(count, userProfile);
  };

  // We initialize with a large buffer for time mode, or exact count for word mode.
  const initialCount = mode === 'words' ? wordLimit : 100;
  const engine = useTypingEngine(getInitialWords(mode, initialCount));

  const intervalRef = useRef(null);

  const handleRestart = () => {
    const newCount = useTypingStore.getState().mode === 'words' ? useTypingStore.getState().wordLimit : 100;
    engine.restart(getInitialWords(useTypingStore.getState().mode, newCount));
    setTimeLeft(useTypingStore.getState().timeLimit);
    setWordProgress(`0/${useTypingStore.getState().wordLimit}`);
    setLiveWpm(0);
    setIsFinished(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const finishTest = () => {
    engine.isFinished.current = true;
    engine.handleKeyPress(''); // Force update
    setIsFinished(true);
    
    // Calculate final stats
    const elapsed = mode === 'time' ? timeLimit - timeLeft : (Date.now() - engine.startTime.current) / 1000;
    const finalWpm = calculateWpm(engine.correctChars.current, elapsed);
    const finalAccuracy = calculateAccuracy(engine.correctChars.current, engine.totalChars.current);
    
    // Process slow words (time > 1.5x average)
    let totalWordTime = 0;
    let wordCount = 0;
    for (const time of Object.values(engine.wordTimes.current)) {
      totalWordTime += time;
      wordCount++;
    }
    const avgWordTime = wordCount > 0 ? totalWordTime / wordCount : 0;
    
    const slowWords = {};
    for (const [word, time] of Object.entries(engine.wordTimes.current)) {
      if (time > avgWordTime * 1.5) {
        slowWords[word] = 1;
      }
    }

    // Update User Profile with Adaptive Analytics
    useUserStore.getState().updateProfile({
      newMistypedKeys: engine.mistypedKeys.current,
      newSlowWords: slowWords,
      sessionWpm: finalWpm,
      sessionAccuracy: finalAccuracy,
    });
    
    // Navigate to Results Screen
    navigation.navigate('Results', { wpm: finalWpm, accuracy: finalAccuracy, errors: engine.errors.current });
  };

  useEffect(() => {
    if (mode === 'voice') {
      navigation.navigate('VoiceChallenge');
      return;
    }

    // Subscriber to handle logic on keystrokes
    const unsubscribe = engine.subscribe(() => {
      const active = engine.isActive.current;
      const finished = engine.isFinished.current;

      if (!active || finished) return;

      // Start timer if not started
      if (mode === 'time' && !intervalRef.current) {
        intervalRef.current = setInterval(() => {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(intervalRef.current);
              finishTest();
              return 0;
            }
            // Update WPM every second
            const elapsed = timeLimit - prev + 1;
            setLiveWpm(calculateWpm(engine.correctChars.current, elapsed));
            return prev - 1;
          });
        }, 1000);
      }

      // Word mode tracking
      if (mode === 'words') {
        const completedWords = engine.wordIndex.current;
        setWordProgress(`${completedWords}/${wordLimit}`);
        if (completedWords >= wordLimit) {
          finishTest();
        }
      }
      
      // Update WPM for word/custom modes
      if (mode !== 'time') {
        const elapsed = (Date.now() - engine.startTime.current) / 1000;
        if (elapsed > 0) {
          setLiveWpm(calculateWpm(engine.correctChars.current, Math.max(1, elapsed)));
        }
      }

      // Infinite scroll / append words for time mode
      if (mode === 'time' && engine.wordIndex.current >= engine.words.current.length - 10) {
        engine.words.current = [...engine.words.current, ...generateAdaptiveWordList(50, useUserStore.getState())];
        // Note: we'd need to extend charStates and extraChars as well in a real app
        // For now, initializing with 100 is usually enough for 15/30s, but we will fix later.
      } else if (mode === 'code' && engine.wordIndex.current >= engine.words.current.length - 1) {
        // End of code snippet
        finishTest();
      }
    });

    return () => {
      unsubscribe();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [mode, timeLimit, wordLimit]);

  return (
    <KeyboardAvoidingView 
      style={[styles.container, { backgroundColor: currentTheme.bg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <Text style={[styles.logo, { color: currentTheme.textPrimary, opacity: focusMode ? 0.3 : 1 }]}>SwiftKeys</Text>
      </View>
      
      {!engine.isActive.current && <ModeSelector onRestart={handleRestart} />}
      
      {(!focusMode || !engine.isActive.current) && mode !== 'voice' && <StatsBar timeLeft={timeLeft} wordProgress={wordProgress} />}
      
      {mode !== 'voice' && <TypingEngine engine={engine} />}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    alignItems: 'center',
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  }
});
