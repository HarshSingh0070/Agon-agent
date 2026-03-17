import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  Animated, Dimensions, TextInput, Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../lib/context';
import { UserProfile, computeFullProfile } from '../lib/calculations';

const { width, height } = Dimensions.get('window');

const STEPS = [
  { id: 'basic', title: 'Basic Info', subtitle: 'Tell us about yourself', emoji: '👤' },
  { id: 'body', title: 'Body Stats', subtitle: 'Help us calculate your needs', emoji: '📏' },
  { id: 'diet', title: 'Diet & Goals', subtitle: 'Personalize your journey', emoji: '🎯' },
  { id: 'activity', title: 'Activity Level', subtitle: 'How active are you?', emoji: '🏃' },
  { id: 'summary', title: 'Your Plan', subtitle: 'Here is what we calculated', emoji: '✨' },
];

function OptionButton({ label, selected, onPress, emoji, colors }: any) {
  return (
    <TouchableOpacity
      style={[
        styles.option,
        {
          backgroundColor: selected ? '#6C63FF' + '20' : colors.inputBg,
          borderColor: selected ? '#6C63FF' : colors.border,
          borderWidth: selected ? 2 : 1,
        }
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {emoji && <Text style={styles.optionEmoji}>{emoji}</Text>}
      <Text style={[styles.optionText, { color: selected ? '#6C63FF' : colors.text }]}>{label}</Text>
      {selected && <Ionicons name="checkmark-circle" size={20} color="#6C63FF" />}
    </TouchableOpacity>
  );
}

export default function OnboardingScreen() {
  const { colors, setUserProfile, setIsOnboarded, userProfile } = useApp();
  const [step, setStep] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const [data, setData] = useState<Partial<UserProfile>>({
    name: userProfile?.name || '',
    email: userProfile?.email || '',
    height: 170,
    weight: 70,
    age: 25,
    gender: 'male',
    dietType: 'both',
    fitnessGoal: 'maintain',
    activityLevel: 'walker',
  });

  const computed = computeFullProfile(data as UserProfile);

  const goNext = () => {
    if (step < STEPS.length - 1) {
      Animated.timing(slideAnim, { toValue: -width, duration: 250, useNativeDriver: true }).start(() => {
        setStep(s => s + 1);
        slideAnim.setValue(width);
        Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
      });
    } else {
      handleFinish();
    }
  };

  const goBack = () => {
    if (step > 0) {
      Animated.timing(slideAnim, { toValue: width, duration: 250, useNativeDriver: true }).start(() => {
        setStep(s => s - 1);
        slideAnim.setValue(-width);
        Animated.timing(slideAnim, { toValue: 0, duration: 250, useNativeDriver: true }).start();
      });
    }
  };

  const handleFinish = async () => {
    await setUserProfile(data as UserProfile);
    await setIsOnboarded(true);
  };

  const update = (key: keyof UserProfile, value: any) => {
    setData(prev => ({ ...prev, [key]: value }));
  };

  const renderStep = () => {
    switch (step) {
      case 0: return (
        <View style={styles.stepContent}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Your Name</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Ionicons name="person-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Enter your name"
                placeholderTextColor={colors.textMuted}
                value={data.name || ''}
                onChangeText={v => update('name', v)}
                autoCapitalize="words"
              />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Gender</Text>
            <View style={styles.optionRow}>
              <OptionButton label="Male" emoji="👨" selected={data.gender === 'male'} onPress={() => update('gender', 'male')} colors={colors} />
              <OptionButton label="Female" emoji="👩" selected={data.gender === 'female'} onPress={() => update('gender', 'female')} colors={colors} />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Age</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Ionicons name="calendar-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="25"
                placeholderTextColor={colors.textMuted}
                value={data.age?.toString() || ''}
                onChangeText={v => update('age', parseInt(v) || 0)}
                keyboardType="numeric"
              />
              <Text style={[styles.unit, { color: colors.textMuted }]}>years</Text>
            </View>
          </View>
        </View>
      );
      case 1: return (
        <View style={styles.stepContent}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Height</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Ionicons name="resize-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="170"
                placeholderTextColor={colors.textMuted}
                value={data.height?.toString() || ''}
                onChangeText={v => update('height', parseInt(v) || 0)}
                keyboardType="numeric"
              />
              <Text style={[styles.unit, { color: colors.textMuted }]}>cm</Text>
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Weight</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Ionicons name="barbell-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="70"
                placeholderTextColor={colors.textMuted}
                value={data.weight?.toString() || ''}
                onChangeText={v => update('weight', parseFloat(v) || 0)}
                keyboardType="numeric"
              />
              <Text style={[styles.unit, { color: colors.textMuted }]}>kg</Text>
            </View>
          </View>
          {/* BMI Preview */}
          {data.height && data.weight ? (
            <View style={[styles.previewBox, { backgroundColor: '#6C63FF' + '15', borderColor: '#6C63FF' + '30' }]}>
              <Text style={[styles.previewLabel, { color: colors.textSecondary }]}>BMI Preview</Text>
              <Text style={[styles.previewValue, { color: '#6C63FF' }]}>
                {computed.bmi}
              </Text>
              <Text style={[styles.previewSub, { color: colors.textMuted }]}>
                {computed.bmi < 18.5 ? 'Underweight' : computed.bmi < 25 ? '✅ Normal' : computed.bmi < 30 ? 'Overweight' : 'Obese'}
              </Text>
            </View>
          ) : null}
        </View>
      );
      case 2: return (
        <View style={styles.stepContent}>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Diet Type</Text>
            <View style={styles.optionCol}>
              <OptionButton label="Vegetarian 🥦" selected={data.dietType === 'veg'} onPress={() => update('dietType', 'veg')} colors={colors} />
              <OptionButton label="Non-Vegetarian 🍗" selected={data.dietType === 'nonveg'} onPress={() => update('dietType', 'nonveg')} colors={colors} />
              <OptionButton label="Both (Flexitarian) 🍱" selected={data.dietType === 'both'} onPress={() => update('dietType', 'both')} colors={colors} />
            </View>
          </View>
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Fitness Goal</Text>
            <View style={styles.optionCol}>
              <OptionButton label="Weight Loss ⚖️" selected={data.fitnessGoal === 'weight_loss'} onPress={() => update('fitnessGoal', 'weight_loss')} colors={colors} />
              <OptionButton label="Fat Loss 🔥" selected={data.fitnessGoal === 'fat_loss'} onPress={() => update('fitnessGoal', 'fat_loss')} colors={colors} />
              <OptionButton label="Muscle Gain 💪" selected={data.fitnessGoal === 'muscle_gain'} onPress={() => update('fitnessGoal', 'muscle_gain')} colors={colors} />
              <OptionButton label="Maintain Weight 🎯" selected={data.fitnessGoal === 'maintain'} onPress={() => update('fitnessGoal', 'maintain')} colors={colors} />
            </View>
          </View>
        </View>
      );
      case 3: return (
        <View style={styles.stepContent}>
          <View style={styles.optionCol}>
            <OptionButton
              label="Sedentary"
              emoji="🪑"
              selected={data.activityLevel === 'sedentary'}
              onPress={() => update('activityLevel', 'sedentary')}
              colors={colors}
            />
            <Text style={[styles.optionDesc, { color: colors.textMuted }]}>Desk job, little to no exercise</Text>
            <OptionButton
              label="Active Walker"
              emoji="🚶"
              selected={data.activityLevel === 'walker'}
              onPress={() => update('activityLevel', 'walker')}
              colors={colors}
            />
            <Text style={[styles.optionDesc, { color: colors.textMuted }]}>Light exercise, walks daily</Text>
            <OptionButton
              label="Gym Goer"
              emoji="🏋️"
              selected={data.activityLevel === 'gym'}
              onPress={() => update('activityLevel', 'gym')}
              colors={colors}
            />
            <Text style={[styles.optionDesc, { color: colors.textMuted }]}>Regular intense workouts</Text>
          </View>
        </View>
      );
      case 4: return (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.summaryGrid}>
            {[
              { label: 'BMI', value: computed.bmi?.toString(), unit: '', color: '#6C63FF', emoji: '📊' },
              { label: 'BMR', value: computed.bmr?.toString(), unit: 'kcal', color: '#FF6584', emoji: '🔥' },
              { label: 'TDEE', value: computed.tdee?.toString(), unit: 'kcal', color: '#43E97B', emoji: '⚡' },
              { label: 'Daily Calories', value: computed.dailyCalorieGoal?.toString(), unit: 'kcal', color: '#F7971E', emoji: '🎯' },
              { label: 'Protein Target', value: computed.dailyProteinTarget?.toString(), unit: 'g/day', color: '#4FACFE', emoji: '💪' },
              { label: 'Water Intake', value: computed.dailyWaterIntake?.toString(), unit: 'L/day', color: '#00D2FF', emoji: '💧' },
              { label: 'Step Goal', value: computed.dailyStepGoal?.toLocaleString(), unit: 'steps', color: '#A8FF78', emoji: '👟' },
            ].map((item, i) => (
              <View key={i} style={[
                styles.summaryCard,
                { backgroundColor: item.color + '15', borderColor: item.color + '30' }
              ]}>
                <Text style={styles.summaryEmoji}>{item.emoji}</Text>
                <Text style={[styles.summaryValue, { color: item.color }]}>{item.value}</Text>
                <Text style={[styles.summaryUnit, { color: colors.textMuted }]}>{item.unit}</Text>
                <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>{item.label}</Text>
              </View>
            ))}
          </View>
          <View style={[styles.noteBox, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Text style={[styles.noteText, { color: colors.textMuted }]}>
              ⚕️ These values are calculated using the Mifflin-St Jeor formula and are estimates. Consult a healthcare professional for personalized advice.
            </Text>
          </View>
        </ScrollView>
      );
      default: return null;
    }
  };

  const currentStep = STEPS[step];
  const progress = (step + 1) / STEPS.length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Progress */}
      <View style={styles.progressContainer}>
        <View style={[styles.progressTrack, { backgroundColor: colors.glass }]}>
          <Animated.View style={[
            styles.progressFill,
            { backgroundColor: '#6C63FF', width: `${progress * 100}%` }
          ]} />
        </View>
        <Text style={[styles.stepIndicator, { color: colors.textMuted }]}>
          {step + 1} of {STEPS.length}
        </Text>
      </View>

      {/* Header */}
      <View style={styles.stepHeader}>
        <Text style={styles.stepEmoji}>{currentStep.emoji}</Text>
        <Text style={[styles.stepTitle, { color: colors.text }]}>{currentStep.title}</Text>
        <Text style={[styles.stepSubtitle, { color: colors.textSecondary }]}>{currentStep.subtitle}</Text>
      </View>

      {/* Content */}
      <Animated.View style={[styles.content, { transform: [{ translateX: slideAnim }] }]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderStep()}
        </ScrollView>
      </Animated.View>

      {/* Navigation */}
      <View style={styles.navRow}>
        {step > 0 ? (
          <TouchableOpacity
            style={[styles.backBtn, { backgroundColor: colors.inputBg, borderColor: colors.border }]}
            onPress={goBack}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text} />
          </TouchableOpacity>
        ) : <View style={{ width: 52 }} />}
        <TouchableOpacity
          style={[styles.nextBtn, { backgroundColor: '#6C63FF' }]}
          onPress={goNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextText}>
            {step === STEPS.length - 1 ? "Let's Go! 🚀" : 'Continue'}
          </Text>
          <Ionicons name={step === STEPS.length - 1 ? 'rocket' : 'arrow-forward'} size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  progressContainer: { paddingHorizontal: 24, paddingTop: 60, paddingBottom: 8 },
  progressTrack: { height: 4, borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
  progressFill: { height: '100%', borderRadius: 2 },
  stepIndicator: { fontSize: 12, fontWeight: '600', textAlign: 'right' },
  stepHeader: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 24 },
  stepEmoji: { fontSize: 48, marginBottom: 12 },
  stepTitle: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5, marginBottom: 6 },
  stepSubtitle: { fontSize: 15, textAlign: 'center' },
  content: { flex: 1, paddingHorizontal: 24 },
  stepContent: {},
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 14 },
  input: { flex: 1, fontSize: 16, fontWeight: '500' },
  unit: { fontSize: 13, fontWeight: '600' },
  optionRow: { flexDirection: 'row', gap: 12 },
  optionCol: { gap: 10 },
  option: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 14, borderRadius: 14 },
  optionEmoji: { fontSize: 20 },
  optionText: { flex: 1, fontSize: 15, fontWeight: '600' },
  optionDesc: { fontSize: 12, marginLeft: 14, marginTop: -6, marginBottom: 4 },
  previewBox: { padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center', marginTop: 8 },
  previewLabel: { fontSize: 12, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },
  previewValue: { fontSize: 36, fontWeight: '900', letterSpacing: -1 },
  previewSub: { fontSize: 13, fontWeight: '600' },
  summaryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  summaryCard: { width: (width - 48 - 12) / 2, padding: 16, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  summaryEmoji: { fontSize: 24, marginBottom: 6 },
  summaryValue: { fontSize: 22, fontWeight: '900', letterSpacing: -0.5 },
  summaryUnit: { fontSize: 11, fontWeight: '600', marginTop: 2 },
  summaryLabel: { fontSize: 12, fontWeight: '600', marginTop: 4, textAlign: 'center' },
  noteBox: { padding: 14, borderRadius: 14, borderWidth: 1, marginBottom: 20 },
  noteText: { fontSize: 12, lineHeight: 18, textAlign: 'center' },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, paddingBottom: Platform.OS === 'ios' ? 40 : 24 },
  backBtn: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 1 },
  nextBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginLeft: 12, padding: 16, borderRadius: 16 },
  nextText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
