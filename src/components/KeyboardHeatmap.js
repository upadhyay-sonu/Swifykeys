import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Svg, { Rect, Text as SvgText } from 'react-native-svg';
import { useUserStore } from '../store/userStore';
import { THEMES } from '../constants/themes';

const ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['z','x','c','v','b','n','m']
];

export const KeyboardHeatmap = () => {
  const activeTheme = useUserStore((state) => state.activeTheme);
  const theme = THEMES[activeTheme] || THEMES.dark;
  const weakKeys = useUserStore((state) => state.weakKeys);

  const maxErrors = Math.max(1, ...Object.values(weakKeys));

  const getKeyColor = (key) => {
    const errors = weakKeys[key] || 0;
    if (errors === 0) return theme.surface;

    const ratio = errors / maxErrors;
    // Interpolate between green -> yellow -> red
    // For simplicity, we'll use predefined hex blends or opacity on red
    if (ratio > 0.6) return '#ef4444'; // Red
    if (ratio > 0.2) return '#eab308'; // Yellow
    return '#22c55e'; // Green
  };

  const keyWidth = 30;
  const keyHeight = 40;
  const spacing = 4;

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.textPrimary }]}>Keyboard Heatmap</Text>
      
      <Svg width="100%" height={200} viewBox="0 0 350 150">
        {ROWS.map((row, rowIdx) => {
          const rowOffset = rowIdx * 15;
          return row.map((key, keyIdx) => {
            const x = rowOffset + keyIdx * (keyWidth + spacing);
            const y = rowIdx * (keyHeight + spacing);
            return (
              <React.Fragment key={key}>
                <Rect
                  x={x}
                  y={y}
                  width={keyWidth}
                  height={keyHeight}
                  rx={4}
                  fill={getKeyColor(key)}
                />
                <SvgText
                  x={x + keyWidth / 2}
                  y={y + keyHeight / 2 + 5}
                  fill={theme.textPrimary}
                  fontSize="14"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  {key.toUpperCase()}
                </SvgText>
              </React.Fragment>
            );
          });
        })}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  }
});
