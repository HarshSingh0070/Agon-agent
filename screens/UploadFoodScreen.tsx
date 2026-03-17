import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
  TextInput, Animated, Alert, Platform, Dimensions,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../lib/context';
import { analyzeFood, AIFoodAnalysis } from '../lib/mockAI';
import { INDIAN_FOODS } from '../lib/indianFoods';
import GlassCard from '../components/GlassCard';
import MacroChip from '../components/MacroChip';
import ProgressBar from '../components/ProgressBar';
import { MealEntry } from '../lib/context';

const { width } = Dimensions.get('window');

export default function UploadFoodScreen({ navigation }: any) {
  const { colors, userProfile, addMeal } = useApp();
  const [selectedFood, setSelectedFood] = useState('');
  const [portion, setPortion] = useState('150');
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AIFoodAnalysis | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [imageSource, setImageSource] = useState<'camera' | 'gallery' | null>(null);
  const resultAnim = useRef(new Animated.Value(0)).current;

  const filteredFoods = searchQuery
    ? INDIAN_FOODS.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : INDIAN_FOODS.slice(0, 12);

  const handleAnalyze = async () => {
    if (!selectedFood.trim()) {
      Alert.alert('Select Food', 'Please select or enter a food item first');
      return;
    }
    setAnalyzing(true);
    setAnalysis(null);
    resultAnim.setValue(0);
    // Simulate AI processing delay
    await new Promise(r => setTimeout(r, 2000));
    const result = analyzeFood(selectedFood, parseInt(portion) || 150, userProfile!);
    setAnalysis(result);
    setAnalyzing(false);
    Animated.spring(resultAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }).start();
  };

  const handleLogMeal = async () => {
    if (!analysis) return;
    const meal: MealEntry = {
      id: Date.now().toString(),
      foodName: analysis.detectedFood.name,
      emoji: analysis.detectedFood.emoji,
      portionGrams: analysis.portionGrams,
      calories: analysis.calories,
      protein: analysis.protein,
      carbs: analysis.carbs,
      fats: analysis.fats,
      mealType: analysis.mealType,
      timestamp: Date.now(),
      isAIEstimated: true,
    };
    await addMeal(meal);
    Alert.alert(
      '✅ Meal Logged!',
      `${analysis.detectedFood.name} (${analysis.calories} kcal) has been added to your diary.`,
      [{ text: 'View Dashboard', onPress: () => navigation.navigate('Dashboard') }]
    );
  };

  const suitabilityColors = ['#FF4757', '#FF6B35', '#FFC312', '#2ECC71', '#00B894'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.blob1, { backgroundColor: '#6C63FF' }]} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>AI Food Scanner</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Upload Area */}
        <GlassCard style={styles.uploadCard}>
          <View style={styles.uploadArea}>
            <View style={[styles.uploadIcon, { backgroundColor: '#6C63FF' + '20', borderColor: '#6C63FF' + '40' }]}>
              <Text style={styles.uploadEmoji}>🤖</Text>
            </View>
            <Text style={[styles.uploadTitle, { color: colors.text }]}>AI Food Recognition</Text>
            <Text style={[styles.uploadSub, { color: colors.textSecondary }]}>
              Select a food item or capture an image for AI analysis
            </Text>
            <View style={styles.uploadBtns}>
              <TouchableOpacity
                style={[
                  styles.uploadBtn,
                  {
                    backgroundColor: imageSource === 'camera' ? '#6C63FF' : colors.inputBg,
                    borderColor: imageSource === 'camera' ? '#6C63FF' : colors.border,
                  }
                ]}
                onPress={() => setImageSource('camera')}
              >
                <Ionicons name="camera" size={20} color={imageSource === 'camera' ? '#fff' : colors.textSecondary} />
                <Text style={[
                  styles.uploadBtnText,
                  { color: imageSource === 'camera' ? '#fff' : colors.textSecondary }
                ]}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.uploadBtn,
                  {
                    backgroundColor: imageSource === 'gallery' ? '#6C63FF' : colors.inputBg,
                    borderColor: imageSource === 'gallery' ? '#6C63FF' : colors.border,
                  }
                ]}
                onPress={() => setImageSource('gallery')}
              >
                <Ionicons name="images" size={20} color={imageSource === 'gallery' ? '#fff' : colors.textSecondary} />
                <Text style={[
                  styles.uploadBtnText,
                  { color: imageSource === 'gallery' ? '#fff' : colors.textSecondary }
                ]}>Gallery</Text>
              </TouchableOpacity>
            </View>
          </View>
        </GlassCard>

        {/* Food Selection */}
        <GlassCard style={styles.foodCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Select Food Item</Text>

          {/* Search */}
          <View style={[styles.searchWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.searchInput, { color: colors.text }]}
              placeholder="Search Indian foods..."
              placeholderTextColor={colors.textMuted}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            ) : null}
          </View>

          {/* Food Grid */}
          <View style={styles.foodGrid}>
            {filteredFoods.map(food => (
              <TouchableOpacity
                key={food.id}
                style={[
                  styles.foodChip,
                  {
                    backgroundColor: selectedFood === food.name ? '#6C63FF' + '25' : colors.inputBg,
                    borderColor: selectedFood === food.name ? '#6C63FF' : colors.border,
                    borderWidth: selectedFood === food.name ? 2 : 1,
                  }
                ]}
                onPress={() => setSelectedFood(food.name)}
                activeOpacity={0.7}
              >
                <Text style={styles.foodChipEmoji}>{food.emoji}</Text>
                <Text style={[
                  styles.foodChipText,
                  { color: selectedFood === food.name ? '#6C63FF' : colors.text }
                ]}>{food.name}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Manual Entry */}
          <View style={styles.manualRow}>
            <View style={[styles.manualInput, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Ionicons name="create-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Or type food name..."
                placeholderTextColor={colors.textMuted}
                value={selectedFood}
                onChangeText={setSelectedFood}
              />
            </View>
          </View>
        </GlassCard>

        {/* Portion Size */}
        <GlassCard style={styles.portionCard}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Portion Size</Text>
          <View style={styles.portionRow}>
            {['50', '100', '150', '200', '250', '300'].map(g => (
              <TouchableOpacity
                key={g}
                style={[
                  styles.portionChip,
                  {
                    backgroundColor: portion === g ? '#6C63FF' : colors.inputBg,
                    borderColor: portion === g ? '#6C63FF' : colors.border,
                  }
                ]}
                onPress={() => setPortion(g)}
              >
                <Text style={[
                  styles.portionText,
                  { color: portion === g ? '#fff' : colors.textSecondary }
                ]}>{g}g</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View style={[styles.portionCustom, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
            <Ionicons name="scale-outline" size={18} color={colors.textMuted} />
            <TextInput
              style={[styles.input, { color: colors.text }]}
              placeholder="Custom grams"
              placeholderTextColor={colors.textMuted}
              value={portion}
              onChangeText={setPortion}
              keyboardType="numeric"
            />
            <Text style={[styles.unit, { color: colors.textMuted }]}>grams</Text>
          </View>
        </GlassCard>

        {/* Analyze Button */}
        <TouchableOpacity
          style={[
            styles.analyzeBtn,
            { backgroundColor: '#6C63FF', opacity: analyzing ? 0.8 : 1 }
          ]}
          onPress={handleAnalyze}
          disabled={analyzing}
          activeOpacity={0.8}
        >
          {analyzing ? (
            <>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.analyzeBtnText}>AI Analyzing...</Text>
            </>
          ) : (
            <>
              <Text style={styles.analyzeBtnEmoji}>🤖</Text>
              <Text style={styles.analyzeBtnText}>Analyze with AI</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Analysis Result */}
        {analysis && (
          <Animated.View style={[
            { opacity: resultAnim, transform: [{ scale: resultAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1] }) }] }
          ]}>
            <GlassCard style={styles.resultCard}>
              {/* Food Header */}
              <View style={styles.resultHeader}>
                <Text style={styles.resultEmoji}>{analysis.detectedFood.emoji}</Text>
                <View style={styles.resultInfo}>
                  <Text style={[styles.resultName, { color: colors.text }]}>{analysis.detectedFood.name}</Text>
                  <Text style={[styles.resultCategory, { color: colors.textMuted }]}>
                    {analysis.detectedFood.category} · {analysis.portionGrams}g
                  </Text>
                  <View style={[styles.aiBadge, { backgroundColor: '#6C63FF' + '20' }]}>
                    <Ionicons name="flash" size={10} color="#6C63FF" />
                    <Text style={[styles.aiText, { color: '#6C63FF' }]}>
                      Estimated by AI • {Math.round(analysis.confidence * 100)}% confidence
                    </Text>
                  </View>
                </View>
              </View>

              {/* Calories */}
              <View style={[styles.calBox, { backgroundColor: '#6C63FF' + '15', borderColor: '#6C63FF' + '25' }]}>
                <Text style={[styles.calValue, { color: '#6C63FF' }]}>{analysis.calories}</Text>
                <Text style={[styles.calLabel, { color: colors.textSecondary }]}>Estimated Calories (kcal)</Text>
              </View>

              {/* Macros */}
              <View style={styles.macroRow}>
                <MacroChip label="Protein" value={`${analysis.protein}g`} color="#4FACFE" emoji="💪" />
                <MacroChip label="Carbs" value={`${analysis.carbs}g`} color="#43E97B" emoji="⚡" />
                <MacroChip label="Fats" value={`${analysis.fats}g`} color="#F7971E" emoji="🦴" />
              </View>

              {/* Digestion */}
              <View style={[styles.infoRow, { borderColor: colors.border }]}>
                <Ionicons name="time-outline" size={16} color={colors.textMuted} />
                <Text style={[styles.infoText, { color: colors.textSecondary }]}>
                  Digestion time: {analysis.detectedFood.digestionTime}
                </Text>
              </View>

              {/* Suitability */}
              <View style={styles.suitSection}>
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Goal Suitability</Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <Ionicons
                      key={i}
                      name={i <= analysis.suitabilityScore ? 'star' : 'star-outline'}
                      size={18}
                      color={suitabilityColors[analysis.suitabilityScore - 1]}
                    />
                  ))}
                </View>
                <Text style={[styles.suitMsg, { color: colors.textSecondary }]}>
                  {analysis.suitabilityMessage}
                </Text>
              </View>

              {/* Benefits */}
              <View style={styles.benefitSection}>
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>✅ Health Benefits</Text>
                {analysis.healthBenefits.map((b, i) => (
                  <View key={i} style={styles.benefitRow}>
                    <View style={[styles.dot, { backgroundColor: '#43E97B' }]} />
                    <Text style={[styles.benefitText, { color: colors.textSecondary }]}>{b}</Text>
                  </View>
                ))}
              </View>

              {/* Disadvantages */}
              <View style={styles.benefitSection}>
                <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>⚠️ Considerations</Text>
                {analysis.disadvantages.map((d, i) => (
                  <View key={i} style={styles.benefitRow}>
                    <View style={[styles.dot, { backgroundColor: '#F7971E' }]} />
                    <Text style={[styles.benefitText, { color: colors.textSecondary }]}>{d}</Text>
                  </View>
                ))}
              </View>

              {/* Alternative */}
              {analysis.alternativeSuggestion && (
                <View style={[styles.altBox, { backgroundColor: '#43E97B' + '10', borderColor: '#43E97B' + '30' }]}>
                  <Ionicons name="leaf" size={16} color="#43E97B" />
                  <Text style={[styles.altText, { color: colors.textSecondary }]}>
                    <Text style={{ color: '#43E97B', fontWeight: '700' }}>Healthier Alternative: </Text>
                    {analysis.alternativeSuggestion}
                  </Text>
                </View>
              )}

              {/* Disclaimer */}
              <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
                ⚕️ {analysis.aiNote}
              </Text>

              {/* Log Button */}
              <TouchableOpacity
                style={[styles.logBtn, { backgroundColor: '#43E97B' }]}
                onPress={handleLogMeal}
                activeOpacity={0.8}
              >
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.logBtnText}>Log This Meal</Text>
              </TouchableOpacity>
            </GlassCard>
          </Animated.View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  blob1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, top: -50, right: -50, opacity: 0.08 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: Platform.OS === 'ios' ? 60 : 50, paddingBottom: 12,
    borderBottomWidth: 1,
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 18, fontWeight: '800' },
  scroll: { padding: 16 },
  uploadCard: { marginBottom: 12 },
  uploadArea: { alignItems: 'center', paddingVertical: 8 },
  uploadIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', borderWidth: 2, marginBottom: 12 },
  uploadEmoji: { fontSize: 40 },
  uploadTitle: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
  uploadSub: { fontSize: 13, textAlign: 'center', marginBottom: 16, lineHeight: 20 },
  uploadBtns: { flexDirection: 'row', gap: 12 },
  uploadBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderRadius: 14, borderWidth: 1 },
  uploadBtnText: { fontSize: 14, fontWeight: '600' },
  foodCard: { marginBottom: 12 },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 14 },
  foodGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  foodChip: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  foodChipEmoji: { fontSize: 16 },
  foodChipText: { fontSize: 13, fontWeight: '600' },
  manualRow: { marginTop: 4 },
  manualInput: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 12 },
  input: { flex: 1, fontSize: 14 },
  portionCard: { marginBottom: 12 },
  portionRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  portionChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  portionText: { fontSize: 13, fontWeight: '600' },
  portionCustom: { flexDirection: 'row', alignItems: 'center', gap: 8, borderRadius: 12, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 12 },
  unit: { fontSize: 13, fontWeight: '600' },
  analyzeBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, padding: 18, borderRadius: 18, marginBottom: 16 },
  analyzeBtnEmoji: { fontSize: 22 },
  analyzeBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  resultCard: { marginBottom: 12 },
  resultHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  resultEmoji: { fontSize: 48 },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 20, fontWeight: '800', marginBottom: 2 },
  resultCategory: { fontSize: 13, marginBottom: 6 },
  aiBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  aiText: { fontSize: 10, fontWeight: '700' },
  calBox: { alignItems: 'center', padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 16 },
  calValue: { fontSize: 42, fontWeight: '900', letterSpacing: -1 },
  calLabel: { fontSize: 13, fontWeight: '500', marginTop: 4 },
  macroRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 10, borderTopWidth: 1, borderBottomWidth: 1, marginBottom: 16 },
  infoText: { fontSize: 13 },
  suitSection: { marginBottom: 16 },
  sectionLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  starsRow: { flexDirection: 'row', gap: 4, marginBottom: 8 },
  suitMsg: { fontSize: 13, lineHeight: 20 },
  benefitSection: { marginBottom: 16 },
  benefitRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, marginTop: 6 },
  benefitText: { flex: 1, fontSize: 13, lineHeight: 20 },
  altBox: { flexDirection: 'row', alignItems: 'flex-start', gap: 8, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 16 },
  altText: { flex: 1, fontSize: 13, lineHeight: 20 },
  disclaimer: { fontSize: 11, textAlign: 'center', lineHeight: 16, marginBottom: 16 },
  logBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 16 },
  logBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
