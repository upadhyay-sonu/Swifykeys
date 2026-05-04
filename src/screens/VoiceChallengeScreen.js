import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
// import Voice from '@react-native-voice/voice'; // Note: Requires custom dev client in Expo
import { useUserStore } from '../store/userStore';
import { THEMES } from '../constants/themes';
import { calculateWpm } from '../utils/wpmCalc';
import { calculateAccuracy } from '../utils/accuracyCalc';

export const VoiceChallengeScreen = ({ navigation }) => {
  const activeTheme = useUserStore((state) => state.activeTheme);
  const theme = THEMES[activeTheme] || THEMES.dark;

  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState('');
  const [voiceWpm, setVoiceWpm] = useState(0);
  const [voiceAccuracy, setVoiceAccuracy] = useState(0);

  const targetPhrase = "The quick brown fox jumps over the lazy dog";

  /* 
    Mocking the Voice integration for standard Expo Go. 
    In a real app with expo-dev-client, we would use:
    Voice.onSpeechResults = (e) => setVoiceText(e.value[0]);
  */

  const startRecording = () => {
    setIsRecording(true);
    setVoiceText('');
    
    // Mock simulation of voice recognition after 3 seconds
    setTimeout(() => {
      setVoiceText("The quick brown fox jumped over the lazy dog");
      setVoiceWpm(calculateWpm(40, 3)); // Mock 40 chars in 3 seconds
      setVoiceAccuracy(calculateAccuracy(40, 43));
      setIsRecording(false);
    }, 3000);
  };

  const startTypingTest = () => {
    // We would navigate to standard TypingScreen and pass the specific phrase
    navigation.navigate('Typing', { customPhrase: targetPhrase, challengeMode: 'voice' });
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <Text style={[styles.header, { color: theme.textPrimary }]}>Voice vs Typing</Text>
      
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.label, { color: theme.textMuted }]}>TARGET PHRASE</Text>
        <Text style={[styles.phrase, { color: theme.textPrimary }]}>{targetPhrase}</Text>
      </View>

      <View style={styles.comparisonContainer}>
        {/* Voice Section */}
        <View style={[styles.column, { borderRightColor: theme.surface, borderRightWidth: 1 }]}>
          <Text style={[styles.columnTitle, { color: theme.accentColor }]}>VOICE</Text>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: isRecording ? theme.incorrect : theme.surface }]}
            onPress={startRecording}
          >
            <Text style={{ color: theme.textPrimary }}>{isRecording ? 'Listening...' : 'Hold to Speak'}</Text>
          </TouchableOpacity>
          <Text style={[styles.transcribedText, { color: theme.textMuted }]}>{voiceText}</Text>
          
          {voiceWpm > 0 && (
            <View style={styles.stats}>
              <Text style={{ color: theme.correct, fontWeight: 'bold' }}>{voiceWpm} WPM</Text>
              <Text style={{ color: theme.textPrimary }}>{voiceAccuracy}% ACC</Text>
            </View>
          )}
        </View>

        {/* Typing Section */}
        <View style={styles.column}>
          <Text style={[styles.columnTitle, { color: theme.accentColor }]}>TYPING</Text>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.surface }]}
            onPress={startTypingTest}
          >
            <Text style={{ color: theme.textPrimary }}>Start Typing</Text>
          </TouchableOpacity>
          <Text style={[styles.transcribedText, { color: theme.textMuted }]}>Completed: --</Text>
          
          <View style={styles.stats}>
            <Text style={{ color: theme.correct, fontWeight: 'bold' }}>-- WPM</Text>
            <Text style={{ color: theme.textPrimary }}>--% ACC</Text>
          </View>
        </View>
      </View>

      {voiceWpm > 0 && (
        <View style={[styles.verdictCard, { backgroundColor: theme.surface }]}>
          <Text style={[styles.verdictText, { color: theme.textPrimary }]}>
            Verdict: You speak 2.3x faster than you type! 🎙️⚡
          </Text>
        </View>
      )}
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
    textAlign: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  phrase: {
    fontSize: 18,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  comparisonContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  column: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
  },
  columnTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  transcribedText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    height: 40,
  },
  stats: {
    alignItems: 'center',
  },
  verdictCard: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  verdictText: {
    fontSize: 16,
    fontWeight: 'bold',
  }
});
