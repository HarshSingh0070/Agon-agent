import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../lib/context';

interface WaterTrackerProps {
  current: number;
  goal: number; // in liters
  onAdd: () => void;
}

export default function WaterTracker({ current, goal, onAdd }: WaterTrackerProps) {
  const { colors } = useApp();
  const glassesGoal = Math.round(goal * 4); // 250ml per glass
  const glasses = Math.min(current, glassesGoal);

  return (
    <View>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <Text style={{ fontSize: 18 }}>💧</Text>
          <Text style={[styles.title, { color: colors.text }]}>Water Intake</Text>
        </View>
        <Text style={[styles.count, { color: colors.accentBlue }]}>
          {glasses}/{glassesGoal} glasses
        </Text>
      </View>
      <View style={styles.glassesRow}>
        {Array.from({ length: glassesGoal }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.glass,
              {
                backgroundColor: i < glasses
                  ? colors.accentBlue + 'CC'
                  : colors.glass,
                borderColor: i < glasses
                  ? colors.accentBlue
                  : colors.border,
              }
            ]}
          />
        ))}
      </View>
      <TouchableOpacity
        style={[styles.addBtn, { backgroundColor: colors.accentBlue + '20', borderColor: colors.accentBlue + '40' }]}
        onPress={onAdd}
        activeOpacity={0.7}
      >
        <Ionicons name="add-circle" size={18} color={colors.accentBlue} />
        <Text style={[styles.addText, { color: colors.accentBlue }]}>Add Glass (250ml)</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  title: { fontSize: 15, fontWeight: '700' },
  count: { fontSize: 13, fontWeight: '700' },
  glassesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  glass: { width: 22, height: 28, borderRadius: 4, borderWidth: 1 },
  addBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, padding: 10, borderRadius: 12, borderWidth: 1 },
  addText: { fontSize: 13, fontWeight: '600' },
});
