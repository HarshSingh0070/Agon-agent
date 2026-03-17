import React, { useRef, useEffect, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Animated, Dimensions, RefreshControl, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../lib/context';
import GlassCard from '../components/GlassCard';
import AnimatedRing from '../components/AnimatedRing';
import ProgressBar from '../components/ProgressBar';
import WaterTracker from '../components/WaterTracker';
import MealCard from '../components/MealCard';
import { getMotivationalQuote } from '../lib/mockAI';

const { width } = Dimensions.get('window');

const GREETINGS = ['Good morning', 'Good afternoon', 'Good evening', 'Good night'];
function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return GREETINGS[0];
  if (h < 17) return GREETINGS[1];
  if (h < 21) return GREETINGS[2];
  return GREETINGS[3];
}

export default function DashboardScreen({ navigation }: any) {
  const { colors, userProfile, dailyProgress, addWater, removeMeal } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [quote] = useState(getMotivationalQuote());
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, { toValue: 1, duration: 600, useNativeDriver: true }).start();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await new Promise(r => setTimeout(r, 1000));
    setRefreshing(false);
  };

  const calorieGoal = userProfile?.dailyCalorieGoal || 2000;
  const proteinGoal = userProfile?.dailyProteinTarget || 120;
  const waterGoal = userProfile?.dailyWaterIntake || 2.5;
  const stepGoal = userProfile?.dailyStepGoal || 10000;

  const calProgress = Math.min(1, dailyProgress.caloriesConsumed / calorieGoal);
  const proteinProgress = Math.min(1, dailyProgress.proteinConsumed / proteinGoal);
  const waterGlassesGoal = Math.round(waterGoal * 4);
  const waterProgress = Math.min(1, dailyProgress.waterIntake / waterGlassesGoal);
  const stepProgress = Math.min(1, dailyProgress.steps / stepGoal);

  const remaining = Math.max(0, calorieGoal - dailyProgress.caloriesConsumed);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background blobs */}
      <View style={[styles.blob1, { backgroundColor: '#6C63FF' }]} />
      <View style={[styles.blob2, { backgroundColor: '#FF6584' }]} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
        }
      >
        {/* Header */}
        <Animated.View style={[
          styles.header,
          { opacity: headerAnim, transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }
        ]}>
          <View>
            <Text style={[styles.greeting, { color: colors.textSecondary }]}>{getGreeting()},</Text>
            <Text style={[styles.userName, { color: colors.text }]}>
              {userProfile?.name || 'Fitness Hero'} 💪
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.notifBtn, { backgroundColor: colors.glass, borderColor: colors.glassBorder }]}
            onPress={() => {}}
          >
            <Ionicons name="notifications-outline" size={22} color={colors.text} />
            <View style={[styles.notifDot, { backgroundColor: colors.secondary }]} />
          </TouchableOpacity>
        </Animated.View>

        {/* Motivational Quote */}
        <View style={styles.px}>
          <GlassCard style={styles.quoteCard}>
            <Text style={styles.quoteEmoji}>✨</Text>
            <Text style={[styles.quoteText, { color: colors.textSecondary }]}>{quote}</Text>
          </GlassCard>

          {/* Main Calorie Ring */}
          <GlassCard style={styles.calorieCard}>
            <View style={styles.calorieHeader}>
              <View>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Calories</Text>
                <Text style={[styles.sectionSub, { color: colors.textMuted }]}>
                  {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
                </Text>
              </View>
              <TouchableOpacity
                style={[styles.logBtn, { backgroundColor: '#6C63FF' }]}
                onPress={() => navigation.navigate('Upload')}
              >
                <Ionicons name="add" size={18} color="#fff" />
                <Text style={styles.logBtnText}>Log Meal</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.ringRow}>
              <AnimatedRing
                progress={calProgress}
                size={160}
                strokeWidth={14}
                color="#6C63FF"
                value={dailyProgress.caloriesConsumed.toString()}
                label="kcal eaten"
                subtitle={`Goal: ${calorieGoal}`}
              />
              <View style={styles.calStats}>
                <View style={[styles.statBox, { backgroundColor: '#6C63FF' + '15', borderColor: '#6C63FF' + '25' }]}>
                  <Text style={[styles.statValue, { color: '#6C63FF' }]}>{calorieGoal}</Text>
                  <Text style={[styles.statLabel, { color: colors.textMuted }]}>Goal</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: '#43E97B' + '15', borderColor: '#43E97B' + '25' }]}>
                  <Text style={[styles.statValue, { color: '#43E97B' }]}>{remaining}</Text>
                  <Text style={[styles.statLabel, { color: colors.textMuted }]}>Left</Text>
                </View>
                <View style={[styles.statBox, { backgroundColor: '#FF6584' + '15', borderColor: '#FF6584' + '25' }]}>
                  <Text style={[styles.statValue, { color: '#FF6584' }]}>{dailyProgress.meals.length}</Text>
                  <Text style={[styles.statLabel, { color: colors.textMuted }]}>Meals</Text>
                </View>
              </View>
            </View>

            {/* Macro bars */}
            <View style={styles.macroSection}>
              <ProgressBar
                progress={proteinProgress}
                color="#4FACFE"
                label="Protein"
                value={`${dailyProgress.proteinConsumed}g / ${proteinGoal}g`}
                height={8}
                showPercent
              />
              <ProgressBar
                progress={Math.min(1, dailyProgress.carbsConsumed / (calorieGoal * 0.5 / 4))}
                color="#43E97B"
                label="Carbs"
                value={`${dailyProgress.carbsConsumed}g`}
                height={8}
              />
              <ProgressBar
                progress={Math.min(1, dailyProgress.fatsConsumed / (calorieGoal * 0.25 / 9))}
                color="#F7971E"
                label="Fats"
                value={`${dailyProgress.fatsConsumed}g`}
                height={8}
              />
            </View>
          </GlassCard>

          {/* Water & Steps row */}
          <View style={styles.twoCol}>
            <GlassCard style={styles.halfCard}>
              <WaterTracker
                current={dailyProgress.waterIntake}
                goal={waterGoal}
                onAdd={() => addWater(1)}
              />
            </GlassCard>
          </View>

          {/* Steps */}
          <GlassCard>
            <View style={styles.stepsHeader}>
              <View style={styles.stepsLeft}>
                <Text style={{ fontSize: 20 }}>👟</Text>
                <Text style={[styles.sectionTitle, { color: colors.text }]}>Steps Today</Text>
              </View>
              <Text style={[styles.stepsCount, { color: '#A8FF78' }]}>
                {dailyProgress.steps.toLocaleString()} / {stepGoal.toLocaleString()}
              </Text>
            </View>
            <ProgressBar
              progress={stepProgress}
              color="#A8FF78"
              height={10}
            />
            <TouchableOpacity
              style={[styles.stepsBtn, { backgroundColor: '#A8FF78' + '20', borderColor: '#A8FF78' + '40' }]}
              onPress={() => {}}
            >
              <Ionicons name="add-circle" size={16} color="#A8FF78" />
              <Text style={[styles.stepsBtnText, { color: '#A8FF78' }]}>Update Steps</Text>
            </TouchableOpacity>
          </GlassCard>

          {/* Meals List */}
          <View style={styles.mealsSection}>
            <View style={styles.mealsHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Meals</Text>
              {dailyProgress.meals.length > 0 && (
                <Text style={[styles.mealCount, { color: colors.textMuted }]}>
                  {dailyProgress.meals.length} logged
                </Text>
              )}
            </View>

            {dailyProgress.meals.length === 0 ? (
              <GlassCard style={styles.emptyMeals}>
                <Text style={styles.emptyEmoji}>🍽️</Text>
                <Text style={[styles.emptyTitle, { color: colors.text }]}>No meals logged yet</Text>
                <Text style={[styles.emptySub, { color: colors.textMuted }]}>Tap "Log Meal" to track your food</Text>
                <TouchableOpacity
                  style={[styles.emptyBtn, { backgroundColor: '#6C63FF' }]}
                  onPress={() => navigation.navigate('Upload')}
                >
                  <Ionicons name="camera" size={16} color="#fff" />
                  <Text style={styles.emptyBtnText}>Scan Food with AI</Text>
                </TouchableOpacity>
              </GlassCard>
            ) : (
              dailyProgress.meals.map(meal => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  onDelete={() => removeMeal(meal.id)}
                  onPress={() => navigation.navigate('MealDetail', { meal })}
                />
              ))
            )}
          </View>

          {/* Disclaimer */}
          <View style={[styles.disclaimer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Ionicons name="information-circle-outline" size={14} color={colors.textMuted} />
            <Text style={[styles.disclaimerText, { color: colors.textMuted }]}>
              All calorie values are AI-generated estimates and should not replace professional medical advice.
            </Text>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  blob1: { position: 'absolute', width: 300, height: 300, borderRadius: 150, top: -100, right: -80, opacity: 0.08 },
  blob2: { position: 'absolute', width: 200, height: 200, borderRadius: 100, top: 200, left: -60, opacity: 0.06 },
  px: { paddingHorizontal: 16 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 50, paddingBottom: 16,
  },
  greeting: { fontSize: 14, fontWeight: '500' },
  userName: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  notifBtn: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  notifDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4 },
  quoteCard: { marginBottom: 12, flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  quoteEmoji: { fontSize: 18, marginTop: 2 },
  quoteText: { flex: 1, fontSize: 13, fontStyle: 'italic', lineHeight: 20 },
  calorieCard: { marginBottom: 12 },
  calorieHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 17, fontWeight: '700' },
  sectionSub: { fontSize: 12, marginTop: 2 },
  logBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 },
  logBtnText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  ringRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  calStats: { gap: 10, flex: 1, marginLeft: 16 },
  statBox: { padding: 10, borderRadius: 12, borderWidth: 1, alignItems: 'center' },
  statValue: { fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  statLabel: { fontSize: 10, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 2 },
  macroSection: { gap: 8 },
  twoCol: { marginBottom: 12 },
  halfCard: { flex: 1 },
  stepsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  stepsLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  stepsCount: { fontSize: 14, fontWeight: '700' },
  stepsBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 10, padding: 8, borderRadius: 10, borderWidth: 1 },
  stepsBtnText: { fontSize: 13, fontWeight: '600' },
  mealsSection: { marginTop: 8 },
  mealsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  mealCount: { fontSize: 13, fontWeight: '600' },
  emptyMeals: { alignItems: 'center', paddingVertical: 32 },
  emptyEmoji: { fontSize: 48, marginBottom: 12 },
  emptyTitle: { fontSize: 17, fontWeight: '700', marginBottom: 6 },
  emptySub: { fontSize: 13, textAlign: 'center', marginBottom: 16 },
  emptyBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14 },
  emptyBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  disclaimer: { flexDirection: 'row', alignItems: 'flex-start', gap: 6, padding: 12, borderRadius: 12, borderWidth: 1, marginTop: 16 },
  disclaimerText: { flex: 1, fontSize: 11, lineHeight: 16 },
});
