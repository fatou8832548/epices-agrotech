import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { Image as ExpoImage } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ResultScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    image?: string;
    name?: string;
    scientificName?: string;
    keyInfo?: string;
  }>();

  const name = params.name || 'Produit inconnu';
  const scientificName = params.scientificName || '';
  let keyInfo: string[] = [];
  try {
    keyInfo = params.keyInfo ? JSON.parse(params.keyInfo) : [];
  } catch {
    keyInfo = [];
  }

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
          <ThemedText style={styles.headerTitle}>Résultats de l'identification</ThemedText>
        </View>

        <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.card}>
            <View style={styles.imageWrapper}>
              {params.image ? (
                <ExpoImage source={params.image} style={styles.image} contentFit="cover" />
              ) : (
                <View style={[styles.image, styles.imagePlaceholder]}>
                  <SymbolView tintColor="#999" name={{ ios: 'photo', android: 'image', web: 'image' }} size={36} />
                </View>
              )}
              <View style={styles.badge}>
                <SymbolView tintColor="#fff" name={{ ios: 'checkmark', android: 'check', web: 'check' }} size={16} />
              </View>
            </View>

            <ThemedText style={styles.cardLabel}>Matière première identifiée</ThemedText>
            <ThemedText style={styles.cardName}>{name}</ThemedText>
            {scientificName ? <ThemedText style={styles.cardScientific}>({scientificName})</ThemedText> : null}
          </View>

          <ThemedText style={styles.sectionTitle}>Informations clés</ThemedText>

          <View style={styles.infoList}>
            {keyInfo.length ? (
              keyInfo.map((info, index) => (
                <View key={index} style={styles.infoRow}>
                  <SymbolView tintColor="#1b8a2a" name={{ ios: 'checkmark', android: 'check', web: 'check' }} size={16} />
                  <ThemedText style={styles.infoText}>{info}</ThemedText>
                </View>
              ))
            ) : (
              <ThemedText style={styles.infoText}>Aucune information disponible.</ThemedText>
            )}
          </View>

          <PrimaryButton
            title="Voir les produits possibles"
            onPress={() => {}}
            style={styles.primaryButton}
          />
        </ScrollView>
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
  scrollContent: { paddingBottom: 120, alignItems: 'center' },
  card: {
    marginTop: Spacing.four,
    width: '100%',
    backgroundColor: '#f1f7ef',
    borderRadius: 16,
    paddingVertical: Spacing.four,
    paddingHorizontal: Spacing.three,
    alignItems: 'center',
  },
  imageWrapper: {
    width: 140,
    height: 140,
    borderRadius: 16,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  imagePlaceholder: {
    backgroundColor: '#e6e6e6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1b8a2a',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  cardLabel: {
    marginTop: Spacing.three,
    color: '#666',
    fontSize: 13,
  },
  cardName: {
    marginTop: Spacing.one,
    color: '#1b8a2a',
    fontSize: 26,
    fontWeight: '700',
  },
  cardScientific: {
    marginTop: 2,
    color: '#666',
    fontStyle: 'italic',
    fontSize: 13,
  },
  sectionTitle: {
    marginTop: Spacing.four,
    width: '100%',
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  infoList: {
    marginTop: Spacing.two,
    width: '100%',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  infoText: {
    flex: 1,
    color: '#333',
    lineHeight: 20,
  },
  primaryButton: {
    marginTop: Spacing.four,
    width: '100%',
  },
});
