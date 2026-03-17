import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useApp } from '../lib/context';

interface MacroChipProps {
  label: string;
  value: string;
  color: string;
  emoji?: string;
}

export default function MacroChip({ label, value, color, emoji }: MacroChipProps) {
  const { colors } = useApp();
  return (
    <View style={[
      styles.chip,
      { backgroundColor: color + '18', borderColor: color + '30' }
    ]}>
      {emoji && <Text style={styles.emoji}>{emoji}</Text>}
      <Text style={[styles.value, { color }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    minWidth: 72,
  },
  emoji: { fontSize: 16, marginBottom: 2 },
  value: { fontSize: 16, fontWeight: '800', letterSpacing: -0.3 },
  label: { fontSize: 10, fontWeight: '600', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
});
