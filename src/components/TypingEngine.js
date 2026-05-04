import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useUserStore } from '../store/userStore';
import { THEMES } from '../constants/themes';

const Word = React.memo(({ word, wordIdx, engine, activeTheme }) => {
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    return engine.subscribe(() => {
      if (engine.wordIndex.current === wordIdx || engine.wordIndex.current === wordIdx - 1) {
        setUpdate(u => u + 1);
      }
    });
  }, [engine, wordIdx]);

  const chars = [...word];
  const states = engine.charStates.current[wordIdx];
  const extras = engine.extraChars.current[wordIdx];
  const isCurrentWord = engine.wordIndex.current === wordIdx;
  const currentTheme = THEMES[activeTheme] || THEMES.dark;

  return (
    <View style={styles.word}>
      {chars.map((char, charIdx) => {
        const state = states[charIdx];
        let color = currentTheme.textMuted;
        if (state === 'correct') color = currentTheme.correct;
        else if (state === 'incorrect') color = currentTheme.incorrect;

        const isCursorHere = isCurrentWord && engine.charIndex.current === charIdx;

        return (
          <View key={charIdx} style={styles.charContainer}>
            {isCursorHere && <View style={[styles.cursor, { backgroundColor: currentTheme.cursor }]} />}
            <Text style={[styles.char, { color }]}>{char}</Text>
          </View>
        );
      })}
      {extras.map((char, charIdx) => {
        const isCursorHere = isCurrentWord && engine.charIndex.current === chars.length + charIdx;
        return (
          <View key={`extra-${charIdx}`} style={styles.charContainer}>
            {isCursorHere && <View style={[styles.cursor, { backgroundColor: currentTheme.cursor }]} />}
            <Text style={[styles.char, { color: currentTheme.extra }]}>{char}</Text>
          </View>
        );
      })}
      {/* Cursor at the end of the word */}
      {isCurrentWord && engine.charIndex.current === chars.length + extras.length && (
        <View style={[styles.cursor, { backgroundColor: currentTheme.cursor, position: 'absolute', right: -2 }]} />
      )}
    </View>
  );
});

export const TypingEngine = ({ engine }) => {
  const activeTheme = useUserStore((state) => state.activeTheme);
  const hapticsEnabled = useUserStore((state) => state.hapticsEnabled);
  const currentTheme = THEMES[activeTheme] || THEMES.dark;

  const inputRef = React.useRef(null);

  const handleKeyPress = (e) => {
    const key = e.nativeEvent.key;
    
    // Check if it's an error before processing to play the right haptic
    const currentWord = engine.words.current[engine.wordIndex.current];
    const expectedChar = currentWord ? currentWord[engine.charIndex.current] : null;
    
    if (hapticsEnabled) {
      if (key !== 'Backspace' && key !== ' ' && key !== expectedChar) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }

    engine.handleKeyPress(key);
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: withSpring(-engine.activeLine.value * 40) }]
    };
  });

  return (
    <View style={[styles.container, { backgroundColor: currentTheme.bg }]} onTouchEnd={() => inputRef.current?.focus()}>
      <TextInput
        ref={inputRef}
        style={styles.hiddenInput}
        autoFocus
        autoCorrect={false}
        autoCapitalize="none"
        onKeyPress={handleKeyPress}
        blurOnSubmit={false}
        caretHidden={true}
      />
      <View style={styles.textContainer}>
        <Animated.View style={[styles.textWrapper, animatedStyle]}>
          {engine.words.current.map((word, idx) => (
            <Word key={idx} word={word} wordIdx={idx} engine={engine} activeTheme={activeTheme} />
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  hiddenInput: {
    position: 'absolute',
    top: -1000,
    left: -1000,
    width: 0,
    height: 0,
  },
  textContainer: {
    height: 120, // 3 lines approximately
    overflow: 'hidden',
  },
  textWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  word: {
    flexDirection: 'row',
    marginRight: 10,
    marginBottom: 10,
  },
  charContainer: {
    position: 'relative',
  },
  char: {
    fontSize: 24,
    fontFamily: 'monospace',
  },
  cursor: {
    position: 'absolute',
    left: 0,
    bottom: 4,
    width: 2,
    height: 24,
    zIndex: -1,
  }
});
