import React from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../lib/context';
import GlassCard from '../components/GlassCard';
import MacroChip from '../components/MacroChip';
import ProgressBar from '../components/ProgressBar';

export default function MealDetailScreen({ route, navigation }: any) {
  const { colors } = useApp();
  const { meal } = route.params;
  const time = new Date(meal.timestamp).toLocaleString('en-IN', {
    weekday: 'long', year: 'numeric', month: 'short',
    day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.blob1, { backgroundColor: '#6C63FF' }]} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Meal Detail</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Food Identity */}
        <GlassCard style={styles.heroCard}>
          <Text style={styles.heroEmoji}>{meal.emoji}</Text>
          <Text style={[styles.heroName, { color: colors.text }]}>{meal.foodName}</Text>
          <View style={styles.heroBadges}>
            <View style={[styles.badge, { backgroundColor: '#6C63FF' + '20' }]}>
              <Text style={[styles.badgeText, { color: '#6C63FF' }]}>{meal.mealType}</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: colors.inputBg }]}>
              <Ionicons name="scale-outline" size={12} color={colors.textMuted} />
              <Text style={[styles.badgeText, { color: colors.textMuted }]}>{meal.portionGrams}g</Text>
            </View>
            {meal.isAIEstimated && (
              <View style={[styles.badge, { backgroundColor: '#F7971E' + '20' }]}>
                <Ionicons name="flash" size={12} color="#F7971E" />
                <Text style={[styles.badgeText, { color: '#F7971E' }]}>AI Estimated</Text>
              </View>
            )}
          </View>
          <Text style={[styles.heroTime, { color: colors.textMuted }]}>{time}</Text>
        </GlassCard>

        {/* Calories */}
        <GlassCard style={styles.calCard}>
          <Text style={[styles.calValue, { color: '#6C63FF' }]}>{meal.calories}</Text>
          <Text style={[styles.calLabel, { color: colors.textSecondary }]}>Total Calories (kcal)</Text>
          <View style={[styles.calDivider, { backgroundColor: colors.border }]} />
          <Text style={[styles.calNote, { color: colors.textMuted }]}>
            Based on {meal.portionGrams}g serving size
          </Text>
        </GlassCard>

        {/* Macros */}
        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Nutritional Breakdown</Text>
          <View style={styles.macroRow}>
            <MacroChip label="Protein" value={`${meal.protein}g`} color="#4FACFE" emoji="💪" />
            <MacroChip label="Carbs" value={`${meal.carbs}g`} color="#43E97B" emoji="⚡" />
            <MacroChip label="Fats" value={`${meal.fats}g`} color="#F7971E" emoji="🦴" />
          </View>

          <View style={styles.macroDetails}>
            <View style={styles.macroDetailRow}>
              <View style={[styles.macroColorDot, { backgroundColor: '#4FACFE' }]} />
              <Text style={[styles.macroDetailLabel, { color: colors.textSecondary }]}>Protein</Text>
              <Text style={[styles.macroDetailValue, { color: colors.text }]}>{meal.protein}g</Text>
              <Text style={[styles.macroDetailCal, { color: colors.textMuted }]}>{Math.round(meal.protein * 4)} kcal</Text>
            </View>
            <View style={styles.macroDetailRow}>
              <View style={[styles.macroColorDot, { backgroundColor: '#43E97B' }]} />
              <Text style={[styles.macroDetailLabel, { color: colors.textSecondary }]}>Carbohydrates</Text>
              <Text style={[styles.macroDetailValue, { color: colors.text }]}>{meal.carbs}g</Text>
              <Text style={[styles.macroDetailCal, { color: colors.textMuted }]}>{Math.round(meal.carbs * 4)} kcal</Text>
            </View>
            <View style={styles.macroDetailRow}>
              <View style={[styles.macroColorDot, { backgroundColor: '#F7971E' }]} />
              <Text style={[styles.macroDetailLabel, { color: colors.textSecondary }]}>Fats</Text>
              <Text style={[styles.macroDetailValue, { color: colors.text }]}>{meal.fats}g</Text>
              <Text style={[styles.macroDetailCal, { color: colors.textMuted }]}>{Math.round(meal.fats * 9)} kcal</Text>
            </View>
          </View>

          {/* Calorie distribution bar */}
          <View style={styles.calDistRow}>
            <View style={[styles.calDistBar, { flex: meal.protein * 4, backgroundColor: '#4FACFE', borderRadius: 4 }]} />
            <View style={[styles.calDistBar, { flex: meal.carbs * 4, backgroundColor: '#43E97B', borderRadius: 4 }]} />
            <View style={[styles.calDistBar, { flex: meal.fats * 9, backgroundColor: '#F7971E', borderRadius: 4 }]} />
          </View>
        </GlassCard>

        {/* Disclaimer */}
        <View style={[styles.disclaimer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
          <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} />
          <Text style={[styles.disclaimerText, { color: colors.textMuted }]}>
            ⚕️ All calorie values are AI-generated estimates and should not replace professional medical advice.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  blob1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, top: -40, right: -60, opacity: 0.08 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 60 : 50, paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  scroll: { padding: 16, gap: 12 },
  heroCard: { alignItems: 'center', paddingVertical: 24 },
  heroEmoji: { fontSize: 64, marginBottom: 12 },
  heroName: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5, marginBottom: 12 },
  heroBadges: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },
  heroTime: { fontSize: 12 },
  calCard: { alignItems: 'center', paddingVertical: 24 },
  calValue: { fontSize: 56, fontWeight: '900', letterSpacing: -2 },
  calLabel: { fontSize: 14, fontWeight: '600', marginTop: 4 },
  calDivider: { width: 40, height: 1, marginVertical: 12 },
  calNote: { fontSize: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 16 },
  macroRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 20 },
  macroDetails: { gap: 12, marginBottom: 16 },
  macroDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  macroColorDot: { width: 10, height: 10, borderRadius: 5 },
  macroDetailLabel: { flex: 1, fontSize: 14 },
  macroDetailValue: { fontSize: 14, fontWeight: '700' },
  macroDetailCal: { fontSize: 12, width: 60, textAlign: 'right' },
  calDistRow: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden', gap: 1 },
  calDistBar: { height: 8 },
  disclaimer: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, padding: 12, borderRadius: 12, borderWidth: 1 },
  disclaimerText: { flex: 1, fontSize: 11, lineHeight: 16 },
});
