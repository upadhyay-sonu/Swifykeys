import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Share } from 'react-native';
import { useUserStore } from '../store/userStore';
import { useGamificationStore } from '../store/gamificationStore';
import { THEMES } from '../constants/themes';
import { calculateLevel } from '../constants/levels';

export const ProfileScreen = () => {
  const activeTheme = useUserStore((state) => state.activeTheme);
  const theme = THEMES[activeTheme] || THEMES.dark;
  
  const { avgWpm, avgAccuracy } = useUserStore();
  const { totalXp, currentLevel, streakDays } = useGamificationStore();
  const levelData = calculateLevel(totalXp);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `I'm a Level ${currentLevel} ${levelData.title} on SwiftKeys! My average WPM is ${avgWpm} at ${avgAccuracy}% accuracy. Can you beat me?`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.header, { color: theme.textPrimary }]}>Your Profile</Text>
      
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarText}>🧑‍💻</Text>
        </View>
        <Text style={[styles.name, { color: theme.textPrimary }]}>Guest User</Text>
        <Text style={[styles.title, { color: theme.accentColor }]}>{levelData.title} • Lvl {currentLevel}</Text>
      </View>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.sectionTitle, { color: theme.textMuted }]}>CAREER STATS</Text>
        <View style={styles.statRow}>
          <Text style={{ color: theme.textPrimary }}>Average Speed</Text>
          <Text style={{ color: theme.correct, fontWeight: 'bold' }}>{avgWpm} WPM</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={{ color: theme.textPrimary }}>Average Accuracy</Text>
          <Text style={{ color: theme.textPrimary, fontWeight: 'bold' }}>{avgAccuracy}%</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={{ color: theme.textPrimary }}>Total XP</Text>
          <Text style={{ color: theme.accentColor, fontWeight: 'bold' }}>{totalXp} XP</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={{ color: theme.textPrimary }}>Current Streak</Text>
          <Text style={{ color: '#f97316', fontWeight: 'bold' }}>🔥 {streakDays} Days</Text>
        </View>
      </View>

      <TouchableOpacity style={[styles.shareButton, { backgroundColor: theme.accentColor }]} onPress={handleShare}>
        <Text style={styles.shareButtonText}>Share Stats Card</Text>
      </TouchableOpacity>
    </View>
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
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  shareButton: {
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 20,
  },
  shareButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  }
});
