import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { useApp } from '../lib/context';

interface ProgressBarProps {
  progress: number; // 0-1
  color?: string;
  label?: string;
  value?: string;
  height?: number;
  showPercent?: boolean;
}

export default function ProgressBar({
  progress,
  color = '#6C63FF',
  label,
  value,
  height = 8,
  showPercent = false,
}: ProgressBarProps) {
  const { colors } = useApp();
  const animWidth = useRef(new Animated.Value(0)).current;
  const clampedProgress = Math.min(1, Math.max(0, progress));

  useEffect(() => {
    Animated.timing(animWidth, {
      toValue: clampedProgress,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [clampedProgress]);

  return (
    <View style={styles.container}>
      {(label || value || showPercent) && (
        <View style={styles.header}>
          {label && <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>}
          <View style={styles.rightInfo}>
            {value && <Text style={[styles.value, { color: colors.text }]}>{value}</Text>}
            {showPercent && (
              <Text style={[styles.pct, { color }]}> {Math.round(clampedProgress * 100)}%</Text>
            )}
          </View>
        </View>
      )}
      <View style={[
        styles.track,
        { height, backgroundColor: colors.glass, borderRadius: height / 2 }
      ]}>
        <Animated.View
          style={[
            styles.fill,
            {
              height,
              borderRadius: height / 2,
              backgroundColor: color,
              width: animWidth.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 4 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  label: { fontSize: 13, fontWeight: '500' },
  rightInfo: { flexDirection: 'row', alignItems: 'center' },
  value: { fontSize: 13, fontWeight: '700' },
  pct: { fontSize: 12, fontWeight: '600' },
  track: { overflow: 'hidden' },
  fill: {},
});
