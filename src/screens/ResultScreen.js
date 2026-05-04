import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing, withDelay } from 'react-native-reanimated';
import { useUserStore } from '../store/userStore';
import { useGamificationStore } from '../store/gamificationStore';
import { THEMES } from '../constants/themes';
import { calculateLevel } from '../constants/levels';

const AnimatedNumber = ({ value, style, duration = 1000 }) => {
  // Using Reanimated for layout/scale:

  // For React Native, animating text content directly via Reanimated is tricky without custom components.
  // We'll just display the final value with a fade/scale animation for simplicity,
  // or a basic JS interval for the count-up effect if preferred.
  // Using Reanimated for layout/scale:
  const rStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(1, { duration }),
      transform: [{ scale: withTiming(1, { duration }) }],
    };
  });

  return (
    <Animated.Text style={[style, rStyle, { opacity: 0, transform: [{ scale: 0.5 }] }]}>
      {value}
    </Animated.Text>
  );
};

export const ResultScreen = ({ route, navigation }) => {
  const { wpm, accuracy, errors } = route.params;
  const activeTheme = useUserStore((state) => state.activeTheme);
  const theme = THEMES[activeTheme] || THEMES.dark;
  const { addXpFromSession, totalXp } = useGamificationStore();
  
  const [xpData, setXpData] = React.useState(null);

  useEffect(() => {
    // Determine if it's a PB
    const isPB = wpm > useUserStore.getState().avgWpm;
    const noMistakes = errors === 0;
    const data = addXpFromSession(wpm, accuracy, isPB, noMistakes);
    setXpData(data);
  }, []);

  const handleNewTest = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Typing' }],
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Results</Text>
      
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={[styles.statLabel, { color: theme.textMuted }]}>WPM</Text>
          <AnimatedNumber value={wpm} style={[styles.statValue, { color: theme.accentColor }]} />
        </View>

        <View style={styles.row}>
          <View style={styles.subStatBox}>
            <Text style={[styles.subStatLabel, { color: theme.textMuted }]}>ACCURACY</Text>
            <AnimatedNumber value={`${accuracy}%`} style={[styles.subStatValue, { color: theme.textPrimary }]} />
          </View>
          
          <View style={styles.subStatBox}>
            <Text style={[styles.subStatLabel, { color: theme.textMuted }]}>ERRORS</Text>
            <AnimatedNumber value={errors} style={[styles.subStatValue, { color: theme.incorrect }]} />
          </View>
        </View>
      </View>

      {/* Placeholder for Sparkline Graph */}
      <View style={[styles.graphPlaceholder, { borderColor: theme.surface }]}>
        <Text style={{ color: theme.textMuted }}>WPM Sparkline Graph Here</Text>
      </View>

      {/* XP and Level Section */}
      {xpData && (
        <Animated.View style={[styles.xpContainer, { backgroundColor: theme.surface }]}>
          <Text style={[styles.xpText, { color: theme.accentColor }]}>+{xpData.xpEarned} XP</Text>
          <Text style={[styles.levelText, { color: theme.textPrimary }]}>
            Level {calculateLevel(totalXp).level} - {calculateLevel(totalXp).title}
          </Text>
          {xpData.leveledUp && <Text style={[styles.levelUpText, { color: theme.correct }]}>🎉 Level Up!</Text>}
        </Animated.View>
      )}

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, { backgroundColor: theme.surface }]} onPress={handleNewTest}>
          <Text style={[styles.buttonText, { color: theme.textPrimary }]}>Next Test</Text>
        </TouchableOpacity>
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
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  statsContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  statBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  statValue: {
    fontSize: 72,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  row: {
    flexDirection: 'row',
    gap: 40,
  },
  subStatBox: {
    alignItems: 'center',
  },
  subStatLabel: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  subStatValue: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  graphPlaceholder: {
    height: 150,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  xpContainer: {
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 40,
  },
  xpText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  levelText: {
    fontSize: 14,
    marginTop: 4,
  },
  levelUpText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 8,
  }
});
