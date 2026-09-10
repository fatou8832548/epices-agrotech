import { Asset } from 'expo-asset';
import { Image as ExpoImage } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GhostButton } from '@/components/ui/ghost-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import iconImg from '../../../../assets/images/favicon.png';
import heroImg from '../../../../assets/images/hero_fruits.png';

export default function HomeScreen() {
  const router = useRouter();
  useEffect(() => {
    // Preload assets so they are available on device
    Asset.loadAsync([iconImg, heroImg]).catch(() => {});
  }, []);
  const iconSrc = Platform.OS === 'web' ? Asset.fromModule(iconImg).uri : iconImg;
  const heroSrc = Platform.OS === 'web' ? Asset.fromModule(heroImg).uri : heroImg;
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={[styles.safeArea, Platform.OS === 'web' ? styles.safeAreaWeb : undefined]}>
        <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            {Platform.OS === 'web' ? (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              <img src={iconSrc} alt="logo" style={{ ...styles.logo, display: 'block', objectFit: 'cover' }} />
            ) : (
              <ExpoImage source={iconImg} style={styles.logo} contentFit="cover" />
            )}
          </View>

          <View style={styles.titleBlock}>
            <ThemedText type="title" style={styles.titleLine}>
              Apprenez.
            </ThemedText>
            <ThemedText type="title" style={styles.titleLine}>
              Transformez.
            </ThemedText>
            <ThemedText type="title" style={styles.titleLine}>
              Entreprenez.
            </ThemedText>
            <View style={styles.titleUnderline} />
          </View>

          <ThemedText type="default" style={styles.description}>
            La plateforme intelligente de formation et d'accompagnement en transformation agroalimentaire pour
            les femmes et les jeunes
          </ThemedText>

          <View style={styles.heroWrapper}>
            <View style={styles.heroBackdrop} />
            {Platform.OS === 'web' ? (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              <img src={heroSrc} alt="hero" style={{ ...styles.heroImageWeb, display: 'block', objectFit: 'contain' }} />
            ) : (
              <ExpoImage source={heroImg} style={styles.heroImage} contentFit="contain" />
            )}
          </View>

          <PrimaryButton
            title="Commencer"
            onPress={() => router.push('/home/start')}
            style={styles.primaryButton}
          />

          <GhostButton
            title="Se connecter"
            style={styles.secondaryButton}
            onPress={() => router.push('/login')}
          />

          <View style={styles.footerCard}>
            <View style={styles.footerIcon}>
              <ThemedText type="default" style={{ color: '#1b8a2a', fontSize: 22 }}>🎓</ThemedText>
            </View>
            <View style={styles.footerContent}>
              <ThemedText type="default" style={styles.footerTitle} numberOfLines={1}>
                Apprendre · Produire · Innover
              </ThemedText>
              <ThemedText type="default" style={styles.footerText}>
                Construisons ensemble une agriculture durable et rentable.
              </ThemedText>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
    width: '100%',
    paddingHorizontal: Spacing.four,
    alignItems: 'flex-start',
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
    zIndex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  safeAreaWeb: {
    maxWidth: 420,
    alignSelf: 'center',
  },
  header: {
    width: '100%',
    alignItems: 'flex-start',
    marginTop: Spacing.two,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 8,
  },
  scrollContent: {
    width: '100%',
    alignItems: 'flex-start',
    paddingTop: Spacing.two,
    paddingBottom: 120,
  },
  titleBlock: {
    marginTop: Spacing.three,
    alignItems: 'flex-start',
    width: '100%',
  },
  titleUnderline: {
    marginTop: Spacing.two,
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1b8a2a',
  },
  titleLine: {
    color: '#1b8a2a',
    lineHeight: 40,
    fontSize: 34,
    fontWeight: '800',
  },
  description: {
    marginTop: Spacing.three,
    width: '100%',
    textAlign: 'left',
    color: '#4a4a4a',
    fontSize: 16,
    lineHeight: 22,
  },
  heroWrapper: {
    marginTop: Spacing.four,
    width: '100%',
    height: 260,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroBackdrop: {
    position: 'absolute',
    width: '75%',
    height: '75%',
    right: 0,
    top: '8%',
    borderRadius: 999,
    backgroundColor: '#eef6ea',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroImageWeb: {
    width: '100%',
    height: 260,
  },
  footerCard: {
    marginTop: Spacing.four,
    width: '100%',
    backgroundColor: '#f1f7ef',
    borderRadius: 12,
    padding: Spacing.four,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  footerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e6f4e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.two,
  },
  footerContent: {
    flex: 1,
  },
  footerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1b8a2a',
    marginBottom: 4,
  },
  footerText: {
    fontSize: 14,
    color: '#4a4a4a',
    lineHeight: 20,
  },
  primaryButton: {
    marginTop: Spacing.four,
  },
  secondaryButton: {
    marginTop: Spacing.three,
  },
});
