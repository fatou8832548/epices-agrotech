import AsyncStorage from '@react-native-async-storage/async-storage';
import { Asset } from 'expo-asset';
import { Image as ExpoImage } from 'expo-image';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedView } from '@/components/themed-view';
import iconImg from '../../assets/images/favicon.png';

export default function Splash() {
  const router = useRouter();
  useEffect(() => {
    let mounted = true;
    Asset.loadAsync([iconImg]).catch(() => {});
    (async () => {
      console.log('[Splash] mounted', 'platform=', Platform.OS);
      try {
        await AsyncStorage.setItem('hasSeenSplash_v1', 'true');
      } catch {}
      // Ensure native splash is hidden so our index logo is visible
      try {
        await SplashScreen.hideAsync();
      } catch {}
      const timer = setTimeout(() => {
        if (!mounted) return;
        try {
          console.log('[Splash] navigating to /home after 800ms');
          router.replace('/home');
        } catch (e) {
          console.warn('[Splash] router.replace failed', e);
          try {
            router.push('/home');
          } catch (e2) {
            console.warn('[Splash] router.push fallback failed', e2);
          }
        }
      }, 800);
      return () => {
        mounted = false;
        clearTimeout(timer);
      };
    })();
    return () => {
      mounted = false;
    };
  }, []);
  const iconSrc = Platform.OS === 'web' ? Asset.fromModule(iconImg).uri : iconImg;
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.center}>
          {Platform.OS === 'web' ? (
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            <img src={iconSrc} alt="logo" style={styles.splashLogoWeb} />
          ) : (
            <ExpoImage source={iconImg} style={styles.splashLogo} contentFit="contain" />
          )}
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  splashLogo: { width: 120, height: 120 },
  splashLogoWeb: { width: 120, height: 120, objectFit: 'contain' },
});
