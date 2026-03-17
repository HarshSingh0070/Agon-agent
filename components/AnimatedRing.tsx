import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useApp } from '../lib/context';

interface AnimatedRingProps {
  progress: number; // 0-1
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  value?: string;
  subtitle?: string;
}

export default function AnimatedRing({
  progress,
  size = 160,
  strokeWidth = 14,
  color = '#6C63FF',
  label,
  value,
  subtitle,
}: AnimatedRingProps) {
  const { colors } = useApp();
  const animValue = useRef(new Animated.Value(0)).current;
  const clampedProgress = Math.min(1, Math.max(0, progress));

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: clampedProgress,
      duration: 1200,
      useNativeDriver: false,
    }).start();
  }, [clampedProgress]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  // We'll use a View-based ring with rotation trick for React Native Web compatibility
  const rotation = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const pct = Math.round(clampedProgress * 100);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      {/* Background ring */}
      <View style={[
        styles.ring,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: colors.glass,
          position: 'absolute',
        }
      ]} />
      {/* Progress arc using clipping technique */}
      <View style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: strokeWidth,
          borderColor: 'transparent',
          borderTopColor: color,
          borderRightColor: clampedProgress > 0.25 ? color : 'transparent',
          borderBottomColor: clampedProgress > 0.5 ? color : 'transparent',
          borderLeftColor: clampedProgress > 0.75 ? color : 'transparent',
          position: 'absolute',
          transform: [{ rotate: '-90deg' }],
        }
      ]} />
      {/* Center content */}
      <View style={styles.center}>
        {value && <Text style={[styles.value, { color: colors.text }]}>{value}</Text>}
        {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}
        {subtitle && <Text style={[styles.subtitle, { color: colors.textMuted }]}>{subtitle}</Text>}
        {!value && <Text style={[styles.pct, { color }]}>{pct}%</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ring: {},
  center: { alignItems: 'center' },
  value: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5 },
  label: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  subtitle: { fontSize: 10, marginTop: 1 },
  pct: { fontSize: 22, fontWeight: '800' },
});
