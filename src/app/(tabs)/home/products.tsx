import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getProductsForFruit } from '@/constants/fruit-products';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { Image as ExpoImage } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProductsScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const catalog = getProductsForFruit(name ?? '');

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Retour" style={styles.backButton}>
            <SymbolView tintColor="#1b8a2a" name={{ ios: 'chevron.left', android: 'arrow_back', web: 'chevron-left' }} size={22} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>Produits recommandés</ThemedText>
        </View>

        <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {catalog ? (
            <View style={styles.grid}>
              {catalog.products.map((product) => (
                <TouchableOpacity
                  key={product.name}
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() => router.push({ pathname: '/home/product-detail', params: { name: product.name } })}
                >
                  <View style={styles.cardImage}>
                    {product.photo ? (
                      <ExpoImage source={product.photo} style={styles.cardPhoto} contentFit="cover" />
                    ) : (
                      <SymbolView tintColor="#1b8a2a" name={product.icon} size={40} />
                    )}
                  </View>
                  <View style={styles.cardFooter}>
                    <ThemedText style={styles.cardName}>{product.name}</ThemedText>
                    <SymbolView tintColor="#999" name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron-right' }} size={16} />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <ThemedText style={styles.emptyText}>
              Aucun produit connu pour « {name || 'ce fruit'} » pour l'instant.
            </ThemedText>
          )}
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
  scrollContent: { paddingTop: Spacing.four, paddingBottom: 120 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.three },
  card: {
    width: '47%',
    backgroundColor: '#f5f6f8',
    borderRadius: 16,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    aspectRatio: 1.2,
    backgroundColor: '#f1f7ef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardPhoto: { width: '100%', height: '100%' },
  cardName: { flex: 1, fontSize: 14, fontWeight: '700', color: '#111' },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
  },
  emptyText: { color: '#666', textAlign: 'center', marginTop: Spacing.four },
});
