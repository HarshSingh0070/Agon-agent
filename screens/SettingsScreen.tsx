import React, { useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Switch, Platform, Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../lib/context';
import GlassCard from '../components/GlassCard';

export default function SettingsScreen() {
  const { colors, isDark, toggleTheme } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [waterReminder, setWaterReminder] = useState(true);
  const [mealReminder, setMealReminder] = useState(true);
  const [motivational, setMotivational] = useState(true);

  const SettingRow = ({ icon, label, value, onPress, toggle, toggleValue, onToggle, color, sub }: any) => (
    <TouchableOpacity
      style={[styles.settingRow, { borderBottomColor: colors.border }]}
      onPress={onPress || (() => {})}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.settingIcon, { backgroundColor: (color || '#6C63FF') + '20' }]}>
        <Ionicons name={icon} size={18} color={color || '#6C63FF'} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={[styles.settingLabel, { color: colors.text }]}>{label}</Text>
        {sub && <Text style={[styles.settingSub, { color: colors.textMuted }]}>{sub}</Text>}
      </View>
      {toggle ? (
        <Switch
          value={toggleValue}
          onValueChange={onToggle}
          trackColor={{ false: colors.border, true: '#6C63FF' + '80' }}
          thumbColor={toggleValue ? '#6C63FF' : colors.textMuted}
        />
      ) : value ? (
        <Text style={[styles.settingValue, { color: colors.textMuted }]}>{value}</Text>
      ) : onPress ? (
        <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
      ) : null}
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.blob1, { backgroundColor: '#43E97B' }]} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Appearance */}
        <Text style={[styles.groupLabel, { color: colors.textMuted }]}>APPEARANCE</Text>
        <GlassCard style={styles.group}>
          <SettingRow
            icon="moon-outline"
            label="Dark Mode"
            sub={isDark ? 'Currently dark theme' : 'Currently light theme'}
            toggle
            toggleValue={isDark}
            onToggle={toggleTheme}
          />
        </GlassCard>

        {/* Notifications */}
        <Text style={[styles.groupLabel, { color: colors.textMuted }]}>NOTIFICATIONS</Text>
        <GlassCard style={styles.group}>
          <SettingRow
            icon="notifications-outline"
            label="Push Notifications"
            sub="Enable all notifications"
            toggle
            toggleValue={notifications}
            onToggle={setNotifications}
          />
          <SettingRow
            icon="water-outline"
            label="Water Reminder"
            sub="Every 2 hours"
            color="#4FACFE"
            toggle
            toggleValue={waterReminder}
            onToggle={setWaterReminder}
          />
          <SettingRow
            icon="restaurant-outline"
            label="Meal Reminder"
            sub="3 times a day"
            color="#43E97B"
            toggle
            toggleValue={mealReminder}
            onToggle={setMealReminder}
          />
          <SettingRow
            icon="sunny-outline"
            label="Daily Motivation"
            sub="Morning motivational quote"
            color="#F7971E"
            toggle
            toggleValue={motivational}
            onToggle={setMotivational}
          />
        </GlassCard>

        {/* Health & Fitness */}
        <Text style={[styles.groupLabel, { color: colors.textMuted }]}>HEALTH & FITNESS</Text>
        <GlassCard style={styles.group}>
          <SettingRow
            icon="calculator-outline"
            label="Calorie Formula"
            value="Mifflin-St Jeor"
            color="#FF6584"
          />
          <SettingRow
            icon="fitness-outline"
            label="Activity Multiplier"
            value="Standard"
            color="#A8FF78"
          />
          <SettingRow
            icon="flag-outline"
            label="Units"
            value="Metric (kg/cm)"
            color="#6C63FF"
          />
        </GlassCard>

        {/* About */}
        <Text style={[styles.groupLabel, { color: colors.textMuted }]}>ABOUT</Text>
        <GlassCard style={styles.group}>
          <SettingRow
            icon="information-circle-outline"
            label="App Version"
            value="1.0.0 MVP"
          />
          <SettingRow
            icon="shield-checkmark-outline"
            label="Privacy Policy"
            color="#43E97B"
            onPress={() => {}}
          />
          <SettingRow
            icon="document-text-outline"
            label="Terms of Service"
            color="#4FACFE"
            onPress={() => {}}
          />
          <SettingRow
            icon="mail-outline"
            label="Contact Support"
            color="#F7971E"
            onPress={() => {}}
          />
        </GlassCard>

        {/* AI Disclaimer */}
        <View style={[styles.disclaimer, { backgroundColor: '#6C63FF' + '10', borderColor: '#6C63FF' + '25' }]}>
          <Ionicons name="flash" size={16} color="#6C63FF" />
          <View style={styles.disclaimerContent}>
            <Text style={[styles.disclaimerTitle, { color: '#6C63FF' }]}>AI-Powered Analysis</Text>
            <Text style={[styles.disclaimerText, { color: colors.textMuted }]}>
              FitBite AI uses OpenAI Vision API to analyze food images. All calorie values are AI-generated estimates and should not replace professional medical advice.
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  blob1: { position: 'absolute', width: 200, height: 200, borderRadius: 100, bottom: 100, right: -60, opacity: 0.06 },
  header: {
    paddingHorizontal: 20, paddingTop: Platform.OS === 'ios' ? 60 : 50, paddingBottom: 16,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  scroll: { padding: 16 },
  groupLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8, marginTop: 16, marginLeft: 4 },
  group: { padding: 0, overflow: 'hidden' },
  settingRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1,
  },
  settingIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  settingInfo: { flex: 1 },
  settingLabel: { fontSize: 15, fontWeight: '600' },
  settingSub: { fontSize: 12, marginTop: 2 },
  settingValue: { fontSize: 13, fontWeight: '500' },
  disclaimer: { flexDirection: 'row', gap: 10, padding: 14, borderRadius: 16, borderWidth: 1, marginTop: 16 },
  disclaimerContent: { flex: 1 },
  disclaimerTitle: { fontSize: 13, fontWeight: '700', marginBottom: 4 },
  disclaimerText: { fontSize: 12, lineHeight: 18 },
});
