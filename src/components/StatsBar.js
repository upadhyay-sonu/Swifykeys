import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTypingStore } from '../store/typingStore';
import { useUserStore } from '../store/userStore';
import { THEMES } from '../constants/themes';

export const StatsBar = ({ timeLeft, wordProgress }) => {
  const { mode, liveWpm } = useTypingStore();
  const activeTheme = useUserStore((state) => state.activeTheme);
  const theme = THEMES[activeTheme] || THEMES.dark;

  return (
    <View style={styles.container}>
      <View style={styles.statBox}>
        <Text style={[styles.statLabel, { color: theme.textMuted }]}>WPM</Text>
        <Text style={[styles.statValue, { color: theme.accentColor }]}>{liveWpm}</Text>
      </View>

      {mode === 'time' && (
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>TIME</Text>
          <Text style={[styles.statValue, { color: theme.textPrimary }]}>{timeLeft}s</Text>
        </View>
      )}

      {(mode === 'words' || mode === 'custom') && (
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>WORDS</Text>
          <Text style={[styles.statValue, { color: theme.textPrimary }]}>{wordProgress}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  }
});
