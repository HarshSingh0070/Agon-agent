import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { useApp } from '../lib/context';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
  const { colors } = useApp();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 6, tension: 40, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(onFinish, 2800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Background blobs */}
      <View style={[styles.blob1, { backgroundColor: '#6C63FF' }]} />
      <View style={[styles.blob2, { backgroundColor: '#FF6584' }]} />
      <View style={[styles.blob3, { backgroundColor: '#43E97B' }]} />

      <Animated.View style={[
        styles.content,
        { opacity: fadeAnim, transform: [{ scale: scaleAnim }, { translateY: slideAnim }] }
      ]}>
        <View style={styles.logoContainer}>
          <View style={[styles.logoOuter, { backgroundColor: '#6C63FF' + '20', borderColor: '#6C63FF' + '40' }]}>
            <View style={[styles.logoInner, { backgroundColor: '#6C63FF' }]}>
              <Text style={styles.logoEmoji}>🥗</Text>
            </View>
          </View>
        </View>
        <Text style={[styles.appName, { color: colors.text }]}>FitBite AI</Text>
        <Text style={[styles.tagline, { color: colors.textSecondary }]}>
          AI-Powered Indian Food & Fitness Tracker
        </Text>
        <View style={[styles.divider, { backgroundColor: '#6C63FF' }]} />
        <Text style={[styles.sub, { color: colors.textMuted }]}>
          Powered by OpenAI Vision
        </Text>
      </Animated.View>

      <Animated.View style={[styles.bottom, { opacity: fadeAnim }]}>
        <View style={[styles.loadingBar, { backgroundColor: colors.glass }]}>
          <Animated.View style={[
            styles.loadingFill,
            { backgroundColor: '#6C63FF' }
          ]} />
        </View>
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>Initializing AI Engine...</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  blob1: { position: 'absolute', width: 300, height: 300, borderRadius: 150, top: -80, left: -80, opacity: 0.15 },
  blob2: { position: 'absolute', width: 200, height: 200, borderRadius: 100, bottom: 100, right: -60, opacity: 0.1 },
  blob3: { position: 'absolute', width: 150, height: 150, borderRadius: 75, top: height * 0.4, left: -40, opacity: 0.08 },
  content: { alignItems: 'center' },
  logoContainer: { marginBottom: 24 },
  logoOuter: { width: 120, height: 120, borderRadius: 60, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  logoInner: { width: 90, height: 90, borderRadius: 45, alignItems: 'center', justifyContent: 'center' },
  logoEmoji: { fontSize: 44 },
  appName: { fontSize: 42, fontWeight: '900', letterSpacing: -1, marginBottom: 8 },
  tagline: { fontSize: 15, fontWeight: '500', textAlign: 'center', paddingHorizontal: 40, lineHeight: 22 },
  divider: { width: 40, height: 3, borderRadius: 2, marginVertical: 16 },
  sub: { fontSize: 12, fontWeight: '500', letterSpacing: 0.5 },
  bottom: { position: 'absolute', bottom: 60, alignItems: 'center' },
  loadingBar: { width: 120, height: 3, borderRadius: 2, overflow: 'hidden', marginBottom: 8 },
  loadingFill: { width: '70%', height: '100%', borderRadius: 2 },
  loadingText: { fontSize: 11, letterSpacing: 0.5 },
});
