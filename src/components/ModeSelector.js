import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';
import { useTypingStore } from '../store/typingStore';
import { useUserStore } from '../store/userStore';
import { THEMES } from '../constants/themes';

export const ModeSelector = ({ onRestart }) => {
  const { mode, setMode, timeLimit, setTimeLimit, wordLimit, setWordLimit } = useTypingStore();
  const activeTheme = useUserStore((state) => state.activeTheme);
  const theme = THEMES[activeTheme] || THEMES.dark;

  const handleModeChange = (newMode) => {
    setMode(newMode);
    onRestart();
  };

  const handleTimeChange = (time) => {
    setTimeLimit(time);
    onRestart();
  };

  const handleWordChange = (words) => {
    setWordLimit(words);
    onRestart();
  };

  return (
    <View style={styles.container}>
      <View style={[styles.pillGroup, { backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => handleModeChange('time')}>
          <Text style={[styles.pillText, { color: mode === 'time' ? theme.accentColor : theme.textMuted }]}>
            time
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleModeChange('words')}>
          <Text style={[styles.pillText, { color: mode === 'words' ? theme.accentColor : theme.textMuted }]}>
            words
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleModeChange('custom')}>
          <Text style={[styles.pillText, { color: mode === 'custom' ? theme.accentColor : theme.textMuted }]}>
            custom
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleModeChange('code')}>
          <Text style={[styles.pillText, { color: mode === 'code' ? theme.accentColor : theme.textMuted }]}>
            code
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleModeChange('voice')}>
          <Text style={[styles.pillText, { color: mode === 'voice' ? theme.accentColor : theme.textMuted }]}>
            voice
          </Text>
        </TouchableOpacity>
      </View>

      {mode === 'time' && (
        <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={styles.subGroup}>
          {[15, 30, 60].map((t) => (
            <TouchableOpacity key={t} onPress={() => handleTimeChange(t)}>
              <Text style={[styles.subText, { color: timeLimit === t ? theme.accentColor : theme.textMuted }]}>
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}

      {mode === 'words' && (
        <Animated.View entering={FadeInUp} exiting={FadeOutUp} style={styles.subGroup}>
          {[10, 25, 50].map((w) => (
            <TouchableOpacity key={w} onPress={() => handleWordChange(w)}>
              <Text style={[styles.subText, { color: wordLimit === w ? theme.accentColor : theme.textMuted }]}>
                {w}
              </Text>
            </TouchableOpacity>
          ))}
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 20,
    zIndex: 10,
  },
  pillGroup: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 20,
  },
  pillText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  subGroup: {
    flexDirection: 'row',
    marginTop: 10,
    gap: 20,
  },
  subText: {
    fontSize: 14,
    fontWeight: 'bold',
  }
});
