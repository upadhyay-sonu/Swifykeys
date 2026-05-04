import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { KeyboardHeatmap } from '../components/KeyboardHeatmap';
import { useUserStore } from '../store/userStore';
import { useGamificationStore } from '../store/gamificationStore';
import { THEMES } from '../constants/themes';
import { calculateLevel, LEVELS } from '../constants/levels';

export const StatsScreen = () => {
  const userProfile = useUserStore((state) => state);
  const activeTheme = useUserStore((state) => state.activeTheme);
  const { totalXp, currentLevel, streakDays, longestStreak } = useGamificationStore();
  const theme = THEMES[activeTheme] || THEMES.dark;

  const currentLevelData = calculateLevel(totalXp);
  const nextLevelData = LEVELS.find(l => l.level === currentLevel + 1) || currentLevelData;
  const progressToNextLevel = currentLevel === nextLevelData.level 
    ? 1 
    : (totalXp - currentLevelData.xpRequired) / (nextLevelData.xpRequired - currentLevelData.xpRequired);

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.header, { color: theme.textPrimary }]}>Analytics & Progress</Text>
      
      {/* Gamification Card */}
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.row}>
          <View>
            <Text style={[styles.levelTitle, { color: theme.textPrimary }]}>Level {currentLevel}</Text>
            <Text style={[styles.levelSubtitle, { color: theme.accentColor }]}>{currentLevelData.title}</Text>
          </View>
          <View style={styles.streakBox}>
            <Text style={[styles.streakText, { color: '#f97316' }]}>🔥 {streakDays} Day Streak</Text>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>Best: {longestStreak}</Text>
          </View>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { backgroundColor: theme.accentColor, width: `${progressToNextLevel * 100}%` }]} />
        </View>
        <Text style={[styles.xpText, { color: theme.textMuted }]}>{totalXp} / {nextLevelData.xpRequired} XP</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.cardTitle, { color: theme.textPrimary }]}>Overview</Text>
        <View style={styles.row}>
          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>AVG WPM</Text>
            <Text style={[styles.statValue, { color: theme.accentColor }]}>{userProfile.avgWpm}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>AVG ACCURACY</Text>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>{userProfile.avgAccuracy}%</Text>
          </View>
        </View>
        <View style={styles.row}>
          <View style={styles.statBox}>
            <Text style={[styles.statLabel, { color: theme.textMuted }]}>DIFFICULTY TIER</Text>
            <Text style={[styles.statValue, { color: theme.correct }]}>{userProfile.difficultyLevel.toUpperCase()}</Text>
          </View>
        </View>
      </View>

      <KeyboardHeatmap />
      
      {/* Additional graphs (Rhythm, WPM over time) would go here */}
      <View style={[styles.card, { backgroundColor: theme.surface, height: 200, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: theme.textMuted }}>Typing Rhythm Graph (Coming Soon)</Text>
      </View>
      
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  levelTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  levelSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  streakBox: {
    alignItems: 'flex-end',
  },
  streakText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  progressBarBg: {
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 5,
    marginTop: 20,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 5,
  },
  xpText: {
    fontSize: 12,
    textAlign: 'right',
    marginTop: 8,
  }
});
