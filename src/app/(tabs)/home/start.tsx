import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GhostButton } from '@/components/ui/ghost-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { File, UploadType } from 'expo-file-system';
import { Image as ExpoImage } from 'expo-image';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

async function detectProduct(imageUri: string, apiUrl: string) {
  // Downscale the photo first: large camera photos slow down the upload and
  // the AI's response time. 1024px on the longest side is plenty for identification.
  const resized = await ImageManipulator.manipulateAsync(imageUri, [{ resize: { width: 1024 } }], {
    compress: 0.6,
    format: ImageManipulator.SaveFormat.JPEG,
  });

  // Upload the photo to the AI scan server for real fruit detection.
  // Expo SDK 57's built-in fetch/FormData no longer accepts the legacy
  // React Native { uri, name, type } part shape, so we upload via
  // expo-file-system's File.upload (multipart) instead.
  const file = new File(resized.uri);
  const result = await file.upload(apiUrl, {
    uploadType: UploadType.MULTIPART,
    fieldName: 'file',
    mimeType: 'image/jpeg',
  });

  if (result.status < 200 || result.status >= 300) {
    if (result.status === 429) {
      throw new Error("Quota quotidien de l'IA atteint. Réessaie plus tard ou demain.");
    }
    throw new Error(`Détection IA indisponible (${result.status})`);
  }

  return JSON.parse(result.body) as {
    name: string;
    scientificName?: string;
    confidence?: number;
    keyInfo?: string[];
  };
}

export default function StartScreen() {
  const router = useRouter();
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    name: string;
    scientificName?: string;
    confidence?: number;
    keyInfo?: string[];
  } | null>(null);

  const pickGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', "L'accès à la galerie est nécessaire pour choisir une photo.");
        return;
      }
      const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.8, base64: false });
      if (!res.canceled && res.assets && res.assets.length) {
        const uri = res.assets[0].uri;
        setImage(uri);
        runDetect(uri);
      }
    } catch (e) {
      console.warn('pickGallery failed', e);
      Alert.alert('Erreur', "Impossible d'ouvrir la galerie.");
    }
  };

  const takePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', "L'accès à la caméra est nécessaire pour prendre une photo.");
        return;
      }
      const res = await ImagePicker.launchCameraAsync({ quality: 0.8, base64: false });
      if (!res.canceled && res.assets && res.assets.length) {
        const uri = res.assets[0].uri;
        setImage(uri);
        runDetect(uri);
      }
    } catch (e) {
      console.warn('takePhoto failed', e);
      Alert.alert('Erreur', "Impossible d'ouvrir la caméra.");
    }
  };

  const runDetect = async (uri: string) => {
    setResult(null);
    setLoading(true);
    const apiUrl = process.env.EXPO_PUBLIC_SCAN_API_URL;
    if (!apiUrl) {
      setResult({ name: "Serveur IA non configuré (EXPO_PUBLIC_SCAN_API_URL)", confidence: 0 });
      setLoading(false);
      return;
    }
    try {
      const r = await detectProduct(uri, apiUrl);
      setResult({
        name: r.name ?? 'Produit inconnu',
        scientificName: r.scientificName ?? '',
        confidence: r.confidence ?? 0,
        keyInfo: r.keyInfo ?? [],
      });
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      console.warn('detectProduct failed', message);
      Alert.alert('Détection impossible', message);
      setResult({ name: 'Erreur de détection', confidence: 0 });
    }
    setLoading(false);
  };

  const confirmResult = () => {
    if (!image || !result) return;
    router.push({
      pathname: '/home/result',
      params: {
        image,
        name: result.name,
        scientificName: result.scientificName ?? '',
        keyInfo: JSON.stringify(result.keyInfo ?? []),
      },
    });
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Retour" style={styles.backButton}>
            <SymbolView
              tintColor="#1b8a2a"
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'chevron-left' }}
              size={22}
            />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Identifier la matière première</ThemedText>
        </View>

        <ThemedText style={styles.subtitle}>
          Prenez une photo de votre matière première pour découvrir les produits que vous pouvez réaliser
        </ThemedText>

        <View style={styles.heroFrame}>
          {image ? (
            <ExpoImage source={image} style={styles.heroImage} contentFit="cover" />
          ) : (
            <SymbolView
              tintColor="#666"
              name={{ ios: 'photo.on.rectangle.angled', android: 'photo_camera', web: 'camera' }}
              size={48}
            />
          )}
          <View style={[styles.corner, styles.cornerTopLeft]} />
          <View style={[styles.corner, styles.cornerTopRight]} />
          <View style={[styles.corner, styles.cornerBottomLeft]} />
          <View style={[styles.corner, styles.cornerBottomRight]} />
        </View>

        <View style={styles.cameraButtonRow}>
          <TouchableOpacity onPress={takePhoto} style={styles.cameraButton} accessibilityLabel="Prendre une photo">
            <SymbolView
              tintColor="#fff"
              name={{ ios: 'camera.fill', android: 'photo_camera', web: 'camera' }}
              size={32}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.actionsRow}>
          <GhostButton
            title="Galerie"
            onPress={pickGallery}
            style={styles.actionBtn}
            icon={{ ios: 'photo.on.rectangle', android: 'photo_library', web: 'image' }}
          />
          <GhostButton
            title="Conseils"
            onPress={() => {}}
            style={styles.actionBtn}
            icon={{ ios: 'lightbulb.fill', android: 'lightbulb', web: 'lightbulb' }}
          />
        </View>

        {image ? (
          <PrimaryButton
            title="OK"
            onPress={confirmResult}
            disabled={loading || !result}
            style={styles.okButton}
          />
        ) : null}

        <View style={styles.resultArea}>
          {loading ? (
            <View style={{ alignItems: 'center' }}>
              <ActivityIndicator />
              <ThemedText style={styles.hint}>Analyse en cours…</ThemedText>
            </View>
          ) : result ? (
            <View>
              <ThemedText type="title" style={styles.resultTitle}>{result.name}</ThemedText>
              <ThemedText>Confiance: {Math.round((result.confidence ?? 0) * 100)}%</ThemedText>
            </View>
          ) : (
            <ThemedText style={styles.hint}>Aucune détection pour l'instant</ThemedText>
          )}
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  safeArea: { flex: 1, width: '100%', paddingHorizontal: Spacing.four, paddingBottom: BottomTabInset },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.two },
  backButton: { padding: Spacing.one, marginRight: Spacing.one },
  headerTitle: { color: '#1b8a2a', fontSize: 20, fontWeight: '700', flexShrink: 1 },
  subtitle: { marginTop: Spacing.two, color: '#333', textAlign: 'center' },
  heroFrame: {
    marginTop: Spacing.four,
    height: 260,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  heroImage: { width: '100%', height: '100%' },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: '#1b8a2a',
  },
  cornerTopLeft: { top: 12, left: 12, borderTopWidth: 4, borderLeftWidth: 4, borderTopLeftRadius: 8 },
  cornerTopRight: { top: 12, right: 12, borderTopWidth: 4, borderRightWidth: 4, borderTopRightRadius: 8 },
  cornerBottomLeft: { bottom: 12, left: 12, borderBottomWidth: 4, borderLeftWidth: 4, borderBottomLeftRadius: 8 },
  cornerBottomRight: { bottom: 12, right: 12, borderBottomWidth: 4, borderRightWidth: 4, borderBottomRightRadius: 8 },
  cameraButtonRow: { alignItems: 'center', marginTop: -32 },
  cameraButton: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1b8a2a',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
    borderWidth: 4,
    borderColor: '#fff',
  },
  actionsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: Spacing.three },
  actionBtn: { flex: 1, marginHorizontal: 6 },
  okButton: { marginTop: Spacing.three },
  resultArea: { marginTop: Spacing.four, alignItems: 'center' },
  resultTitle: { fontSize: 22, lineHeight: 26 },
  hint: { color: '#666' },
});
