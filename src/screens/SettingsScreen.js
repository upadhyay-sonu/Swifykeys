import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { useUserStore } from '../store/userStore';
import { THEMES } from '../constants/themes';

export const SettingsScreen = () => {
  const { activeTheme, setTheme, soundEnabled, toggleSound, hapticsEnabled, toggleHaptics, focusMode, toggleFocusMode, language, setLanguage } = useUserStore();
  const theme = THEMES[activeTheme] || THEMES.dark;

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.header, { color: theme.textPrimary }]}>Settings</Text>

      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Sound Effects</Text>
          <Switch value={soundEnabled} onValueChange={toggleSound} trackColor={{ true: theme.accentColor }} />
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Haptics</Text>
          <Switch value={hapticsEnabled} onValueChange={toggleHaptics} trackColor={{ true: theme.accentColor }} />
        </View>
        <View style={styles.row}>
          <Text style={[styles.label, { color: theme.textPrimary }]}>Focus Mode</Text>
          <Switch value={focusMode} onValueChange={toggleFocusMode} trackColor={{ true: theme.accentColor }} />
        </View>
      </View>

      <Text style={[styles.subHeader, { color: theme.textMuted }]}>THEME</Text>
      <View style={styles.chipContainer}>
        {Object.keys(THEMES).map((key) => (
          <TouchableOpacity 
            key={key} 
            style={[styles.chip, { backgroundColor: THEMES[key].surface, borderColor: activeTheme === key ? theme.accentColor : 'transparent' }]}
            onPress={() => setTheme(key)}
          >
            <Text style={{ color: THEMES[key].textPrimary }}>{THEMES[key].name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={[styles.subHeader, { color: theme.textMuted, marginTop: 30 }]}>LANGUAGE</Text>
      <View style={styles.chipContainer}>
        {['en', 'hi', 'hinglish'].map((lang) => (
          <TouchableOpacity 
            key={lang} 
            style={[styles.chip, { backgroundColor: theme.surface, borderColor: language === lang ? theme.accentColor : 'transparent' }]}
            onPress={() => setLanguage(lang)}
          >
            <Text style={{ color: theme.textPrimary, textTransform: 'capitalize' }}>{lang}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  subHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    letterSpacing: 1,
  },
  card: {
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 2,
  }
});
