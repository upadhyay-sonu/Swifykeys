import React from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { useUserStore } from '../store/userStore';
import { THEMES } from '../constants/themes';

const MOCK_LEADERBOARD = [
  { id: '1', name: 'AlexTheTypist', wpm: 154, accuracy: 99, level: 'Legend' },
  { id: '2', name: 'SpeedDemon', wpm: 142, accuracy: 98, level: 'Blazing' },
  { id: '3', name: 'NinjaKeys', wpm: 138, accuracy: 96, level: 'Blazing' },
  { id: '4', name: 'CodeSlinger', wpm: 121, accuracy: 95, level: 'Rapid' },
  { id: '5', name: 'You', wpm: 115, accuracy: 97, level: 'Swift', isUser: true },
  { id: '6', name: 'Rookie101', wpm: 95, accuracy: 92, level: 'Typist' },
];

export const LeaderboardScreen = () => {
  const activeTheme = useUserStore((state) => state.activeTheme);
  const theme = THEMES[activeTheme] || THEMES.dark;

  const renderItem = ({ item, index }) => {
    return (
      <View style={[styles.row, { backgroundColor: item.isUser ? theme.accentColor + '22' : theme.surface, borderColor: item.isUser ? theme.accentColor : 'transparent', borderWidth: item.isUser ? 1 : 0 }]}>
        <Text style={[styles.rank, { color: theme.textMuted }]}>#{index + 1}</Text>
        <View style={styles.userInfo}>
          <Text style={[styles.name, { color: theme.textPrimary }]}>{item.name}</Text>
          <Text style={[styles.level, { color: theme.accentColor }]}>{item.level}</Text>
        </View>
        <View style={styles.stats}>
          <Text style={[styles.wpm, { color: theme.correct }]}>{item.wpm} WPM</Text>
          <Text style={[styles.accuracy, { color: theme.textMuted }]}>{item.accuracy}%</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.header, { color: theme.textPrimary }]}>Global Leaderboard</Text>
      <Text style={[styles.subHeader, { color: theme.textMuted }]}>Top Typists Today</Text>
      
      <FlatList
        data={MOCK_LEADERBOARD}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
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
  },
  subHeader: {
    fontSize: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  rank: {
    fontSize: 18,
    fontWeight: 'bold',
    width: 40,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  level: {
    fontSize: 12,
  },
  stats: {
    alignItems: 'flex-end',
  },
  wpm: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  accuracy: {
    fontSize: 12,
  }
});
