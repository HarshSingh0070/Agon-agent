import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useApp } from '../lib/context';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export default function GlassCard({ children, style, padding = 16 }: GlassCardProps) {
  const { colors, isDark } = useApp();
  return (
    <View style={[
      styles.card,
      {
        backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.85)',
        borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(108,99,255,0.15)',
        padding,
        shadowColor: isDark ? '#6C63FF' : '#6C63FF',
        shadowOpacity: isDark ? 0.15 : 0.08,
      },
      style,
    ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 16,
    elevation: 8,
  },
});
