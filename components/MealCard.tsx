import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp, MealEntry } from '../lib/context';

interface MealCardProps {
  meal: MealEntry;
  onDelete?: () => void;
  onPress?: () => void;
}

export default function MealCard({ meal, onDelete, onPress }: MealCardProps) {
  const { colors } = useApp();
  const time = new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <TouchableOpacity
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.cardBorder,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.left}>
        <Text style={styles.emoji}>{meal.emoji}</Text>
        <View style={styles.info}>
          <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>{meal.foodName}</Text>
          <View style={styles.meta}>
            <Text style={[styles.mealType, { color: colors.primary }]}>{meal.mealType}</Text>
            <Text style={[styles.dot, { color: colors.textMuted }]}> · </Text>
            <Text style={[styles.time, { color: colors.textMuted }]}>{time}</Text>
            <Text style={[styles.dot, { color: colors.textMuted }]}> · </Text>
            <Text style={[styles.portion, { color: colors.textMuted }]}>{meal.portionGrams}g</Text>
          </View>
          <View style={styles.macros}>
            <Text style={[styles.macro, { color: '#4FACFE' }]}>P: {meal.protein}g</Text>
            <Text style={[styles.macro, { color: '#43E97B' }]}>C: {meal.carbs}g</Text>
            <Text style={[styles.macro, { color: '#F7971E' }]}>F: {meal.fats}g</Text>
          </View>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={[styles.calories, { color: colors.primary }]}>{meal.calories}</Text>
        <Text style={[styles.kcal, { color: colors.textMuted }]}>kcal</Text>
        {meal.isAIEstimated && (
          <View style={[styles.aiBadge, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[styles.aiText, { color: colors.primary }]}>AI</Text>
          </View>
        )}
        {onDelete && (
          <TouchableOpacity onPress={onDelete} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={16} color={colors.error} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    marginVertical: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  left: { flexDirection: 'row', alignItems: 'center', flex: 1 },
  emoji: { fontSize: 28, marginRight: 12 },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: '700', marginBottom: 3 },
  meta: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  mealType: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  dot: { fontSize: 11 },
  time: { fontSize: 11 },
  portion: { fontSize: 11 },
  macros: { flexDirection: 'row', gap: 8 },
  macro: { fontSize: 11, fontWeight: '600' },
  right: { alignItems: 'center', minWidth: 60 },
  calories: { fontSize: 20, fontWeight: '800' },
  kcal: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  aiBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, marginTop: 4 },
  aiText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  deleteBtn: { marginTop: 6, padding: 4 },
});
