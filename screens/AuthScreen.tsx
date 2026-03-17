import React, { useState, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, Animated, Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useApp } from '../lib/context';
import { UserProfile } from '../lib/calculations';

const { height } = Dimensions.get('window');

export default function AuthScreen() {
  const { colors, login } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const handleSubmit = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
    if (!isLogin && !name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    // In production this would call FastAPI /auth/login or /auth/register
    const mockProfile: Partial<UserProfile> = {
      name: name || email.split('@')[0],
      email,
      height: 170,
      weight: 70,
      age: 28,
      gender: 'male',
      dietType: 'both',
      fitnessGoal: 'maintain',
      activityLevel: 'walker',
    };
    await login(mockProfile as UserProfile);
    setLoading(false);
  };

  const toggleMode = () => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 150, useNativeDriver: true }).start(() => {
      setIsLogin(!isLogin);
      setError('');
      Animated.timing(fadeAnim, { toValue: 1, duration: 150, useNativeDriver: true }).start();
    });
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.blob1, { backgroundColor: '#6C63FF' }]} />
      <View style={[styles.blob2, { backgroundColor: '#FF6584' }]} />

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={[styles.logoWrap, { backgroundColor: '#6C63FF' }]}>
            <Text style={styles.logoEmoji}>🥗</Text>
          </View>
          <Text style={[styles.appName, { color: colors.text }]}>FitBite AI</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            {isLogin ? 'Welcome back! Ready to track?' : 'Start your fitness journey today'}
          </Text>
        </View>

        {/* Card */}
        <Animated.View style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.cardBorder,
            opacity: fadeAnim,
          }
        ]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </Text>

          {!isLogin && (
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Full Name</Text>
              <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
                <Ionicons name="person-outline" size={18} color={colors.textMuted} />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="Your name"
                  placeholderTextColor={colors.textMuted}
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Email</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Ionicons name="mail-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="your@email.com"
                placeholderTextColor={colors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Password</Text>
            <View style={[styles.inputWrap, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
              <Ionicons name="lock-closed-outline" size={18} color={colors.textMuted} />
              <TextInput
                style={[styles.input, { color: colors.text }]}
                placeholder="Min 6 characters"
                placeholderTextColor={colors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
              </TouchableOpacity>
            </View>
          </View>

          {error ? (
            <View style={[styles.errorBox, { backgroundColor: colors.error + '15', borderColor: colors.error + '30' }]}>
              <Ionicons name="alert-circle-outline" size={14} color={colors.error} />
              <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: '#6C63FF', opacity: loading ? 0.7 : 1 }]}
            onPress={handleSubmit}
            disabled={loading}
            activeOpacity={0.8}
          >
            <Text style={styles.submitText}>
              {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
            </Text>
            {!loading && <Ionicons name="arrow-forward" size={18} color="#fff" />}
          </TouchableOpacity>

          <TouchableOpacity style={styles.toggleBtn} onPress={toggleMode}>
            <Text style={[styles.toggleText, { color: colors.textSecondary }]}>
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <Text style={{ color: '#6C63FF', fontWeight: '700' }}>
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>

        <Text style={[styles.disclaimer, { color: colors.textMuted }]}>
          ⚕️ All calorie values are AI-generated estimates and should not replace professional medical advice.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  blob1: { position: 'absolute', width: 250, height: 250, borderRadius: 125, top: -60, right: -60, opacity: 0.12 },
  blob2: { position: 'absolute', width: 180, height: 180, borderRadius: 90, bottom: 80, left: -50, opacity: 0.08 },
  scroll: { flexGrow: 1, padding: 24, justifyContent: 'center', minHeight: height },
  header: { alignItems: 'center', marginBottom: 32 },
  logoWrap: { width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  logoEmoji: { fontSize: 36 },
  appName: { fontSize: 32, fontWeight: '900', letterSpacing: -0.8, marginBottom: 8 },
  subtitle: { fontSize: 15, textAlign: 'center' },
  card: {
    borderRadius: 24, borderWidth: 1, padding: 24,
    shadowColor: '#6C63FF', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 24, elevation: 10,
  },
  cardTitle: { fontSize: 22, fontWeight: '800', marginBottom: 20 },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, borderWidth: 1, paddingHorizontal: 14, paddingVertical: 14 },
  input: { flex: 1, fontSize: 15, fontWeight: '500' },
  errorBox: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 10, borderRadius: 10, borderWidth: 1, marginBottom: 12 },
  errorText: { fontSize: 13, fontWeight: '500' },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, padding: 16, borderRadius: 16, marginTop: 8 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  toggleBtn: { alignItems: 'center', marginTop: 16 },
  toggleText: { fontSize: 14 },
  disclaimer: { fontSize: 11, textAlign: 'center', marginTop: 24, lineHeight: 16, paddingHorizontal: 16 },
});
