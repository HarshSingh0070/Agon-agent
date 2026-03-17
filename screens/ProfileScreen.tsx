import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity, Platform,
  TextInput, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../lib/context';
import GlassCard from '../components/GlassCard';
import { getBMICategory } from '../lib/calculations';

export default function ProfileScreen({ navigation }: any) {
  const { colors, userProfile, setUserProfile, logout } = useApp();
  const [editing, setEditing] = useState(false);
  const [editData, setEditData] = useState(userProfile);

  if (!userProfile) return null;

  const bmiCategory = getBMICategory(userProfile.bmi || 22);
  const bmiColor = userProfile.bmi! < 18.5 ? '#4FACFE'
    : userProfile.bmi! < 25 ? '#43E97B'
    : userProfile.bmi! < 30 ? '#F7971E'
    : '#FF6584';

  const goalLabels: Record<string, string> = {
    weight_loss: 'Weight Loss', fat_loss: 'Fat Loss',
    muscle_gain: 'Muscle Gain', maintain: 'Maintain Weight',
  };
  const activityLabels: Record<string, string> = {
    sedentary: 'Sedentary', walker: 'Active Walker', gym: 'Gym Goer',
  };
  const dietLabels: Record<string, string> = {
    veg: 'Vegetarian', nonveg: 'Non-Vegetarian', both: 'Flexitarian',
  };

  const handleSave = async () => {
    if (editData) {
      await setUserProfile(editData);
      setEditing(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.blob1, { backgroundColor: '#FF6584' }]} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Profile</Text>
        <TouchableOpacity
          style={[styles.editBtn, { backgroundColor: editing ? '#6C63FF' : colors.inputBg, borderColor: editing ? '#6C63FF' : colors.border }]}
          onPress={() => editing ? handleSave() : setEditing(true)}
        >
          <Ionicons name={editing ? 'checkmark' : 'pencil'} size={16} color={editing ? '#fff' : colors.text} />
          <Text style={[styles.editBtnText, { color: editing ? '#fff' : colors.text }]}>
            {editing ? 'Save' : 'Edit'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Avatar & Name */}
        <GlassCard style={styles.avatarCard}>
          <View style={[styles.avatar, { backgroundColor: '#6C63FF' }]}>
            <Text style={styles.avatarText}>
              {(userProfile.name || 'U')[0].toUpperCase()}
            </Text>
          </View>
          <Text style={[styles.profileName, { color: colors.text }]}>{userProfile.name}</Text>
          <Text style={[styles.profileEmail, { color: colors.textMuted }]}>{userProfile.email}</Text>
          <View style={[styles.goalBadge, { backgroundColor: '#6C63FF' + '20', borderColor: '#6C63FF' + '30' }]}>
            <Text style={[styles.goalBadgeText, { color: '#6C63FF' }]}>
              🎯 {goalLabels[userProfile.fitnessGoal]}
            </Text>
          </View>
        </GlassCard>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {[
            { label: 'BMI', value: userProfile.bmi?.toString() || '-', color: bmiColor, sub: bmiCategory, emoji: '📊' },
            { label: 'BMR', value: userProfile.bmr?.toString() || '-', color: '#FF6584', sub: 'kcal/day', emoji: '🔥' },
            { label: 'TDEE', value: userProfile.tdee?.toString() || '-', color: '#43E97B', sub: 'kcal/day', emoji: '⚡' },
            { label: 'Cal Goal', value: userProfile.dailyCalorieGoal?.toString() || '-', color: '#F7971E', sub: 'kcal/day', emoji: '🎯' },
            { label: 'Protein', value: `${userProfile.dailyProteinTarget}g`, color: '#4FACFE', sub: 'per day', emoji: '💪' },
            { label: 'Water', value: `${userProfile.dailyWaterIntake}L`, color: '#00D2FF', sub: 'per day', emoji: '💧' },
          ].map((item, i) => (
            <View key={i} style={[
              styles.statCard,
              { backgroundColor: item.color + '12', borderColor: item.color + '25' }
            ]}>
              <Text style={styles.statEmoji}>{item.emoji}</Text>
              <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
              <Text style={[styles.statSub, { color: colors.textMuted }]}>{item.sub}</Text>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Body Details */}
        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Body Details</Text>
          {[
            { label: 'Height', value: `${userProfile.height} cm`, icon: 'resize-outline' },
            { label: 'Weight', value: `${userProfile.weight} kg`, icon: 'barbell-outline' },
            { label: 'Age', value: `${userProfile.age} years`, icon: 'calendar-outline' },
            { label: 'Gender', value: userProfile.gender === 'male' ? '👨 Male' : '👩 Female', icon: 'person-outline' },
          ].map((item, i) => (
            <View key={i} style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Ionicons name={item.icon as any} size={18} color={colors.textMuted} />
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{item.label}</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{item.value}</Text>
            </View>
          ))}
        </GlassCard>

        {/* Preferences */}
        <GlassCard>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Text>
          {[
            { label: 'Diet Type', value: dietLabels[userProfile.dietType], icon: 'restaurant-outline' },
            { label: 'Fitness Goal', value: goalLabels[userProfile.fitnessGoal], icon: 'trophy-outline' },
            { label: 'Activity Level', value: activityLabels[userProfile.activityLevel], icon: 'walk-outline' },
            { label: 'Step Goal', value: `${userProfile.dailyStepGoal?.toLocaleString()} steps/day`, icon: 'footsteps-outline' },
          ].map((item, i) => (
            <View key={i} style={[styles.detailRow, { borderBottomColor: colors.border }]}>
              <Ionicons name={item.icon as any} size={18} color={colors.textMuted} />
              <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>{item.label}</Text>
              <Text style={[styles.detailValue, { color: colors.text }]}>{item.value}</Text>
            </View>
          ))}
        </GlassCard>

        {/* Logout */}
        <TouchableOpacity
          style={[styles.logoutBtn, { backgroundColor: '#FF6584' + '15', borderColor: '#FF6584' + '30' }]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={20} color="#FF6584" />
          <Text style={[styles.logoutText, { color: '#FF6584' }]}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={[styles.version, { color: colors.textMuted }]}>FitBite AI v1.0.0 MVP</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  blob1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, top: -40, left: -60, opacity: 0.07 },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 50, paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  editBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, borderWidth: 1 },
  editBtnText: { fontSize: 14, fontWeight: '600' },
  scroll: { padding: 16, gap: 12 },
  avatarCard: { alignItems: 'center', paddingVertical: 24 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  avatarText: { fontSize: 36, fontWeight: '800', color: '#fff' },
  profileName: { fontSize: 22, fontWeight: '800', marginBottom: 4 },
  profileEmail: { fontSize: 14, marginBottom: 12 },
  goalBadge: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 12, borderWidth: 1 },
  goalBadgeText: { fontSize: 13, fontWeight: '700' },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: { width: '31%', padding: 12, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  statEmoji: { fontSize: 20, marginBottom: 4 },
  statValue: { fontSize: 18, fontWeight: '800', letterSpacing: -0.5 },
  statSub: { fontSize: 10, fontWeight: '500', marginTop: 2 },
  statLabel: { fontSize: 11, fontWeight: '600', marginTop: 4, textAlign: 'center' },
  sectionTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, borderBottomWidth: 1 },
  detailLabel: { flex: 1, fontSize: 14 },
  detailValue: { fontSize: 14, fontWeight: '700' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 16, borderWidth: 1 },
  logoutText: { fontSize: 16, fontWeight: '700' },
  version: { fontSize: 12, textAlign: 'center', marginTop: 8 },
});
