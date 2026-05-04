import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { TypingScreen } from './src/screens/TypingScreen';
import { ResultScreen } from './src/screens/ResultScreen';
import { StatsScreen } from './src/screens/StatsScreen';
import { LeaderboardScreen } from './src/screens/LeaderboardScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { VoiceChallengeScreen } from './src/screens/VoiceChallengeScreen';
import { useUserStore } from './src/store/userStore';
import { THEMES } from './src/constants/themes';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const activeTheme = useUserStore((state) => state.activeTheme);
  const theme = THEMES[activeTheme] || THEMES.dark;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: theme.accentColor,
        tabBarInactiveTintColor: theme.textMuted,
      }}
    >
      <Tab.Screen name="Type" component={TypingScreen} />
      <Tab.Screen name="Stats" component={StatsScreen} />
      <Tab.Screen name="Social" component={LeaderboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const activeTheme = useUserStore((state) => state.activeTheme);
  const theme = THEMES[activeTheme] || THEMES.dark;

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: theme.bg }
        }}
      >
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="Results" component={ResultScreen} />
        <Stack.Screen name="VoiceChallenge" component={VoiceChallengeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
