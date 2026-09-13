import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getProductByName } from '@/constants/fruit-products';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { Image as ExpoImage } from 'expo-image';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TABS = ['Fabrication', 'Paramètres', 'Conservation'] as const;

export default function ProductDetailScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('Fabrication');
  const [favorite, setFavorite] = useState(false);

  const product = getProductByName(name ?? '');

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Retour" style={styles.backButton}>
            <SymbolView tintColor="#1b8a2a" name={{ ios: 'chevron.left', android: 'arrow_back', web: 'chevron-left' }} size={22} />
          </TouchableOpacity>
          <View style={styles.productIcon}>
            {product?.photo ? (
              <ExpoImage source={product.photo} style={styles.productPhoto} contentFit="cover" />
            ) : (
              <SymbolView
                tintColor="#1b8a2a"
                name={product?.icon ?? { ios: 'shippingbox.fill', android: 'inventory_2', web: 'package' }}
                size={18}
              />
            )}
          </View>
          <ThemedText style={styles.headerTitle}>{name || 'Produit'}</ThemedText>
          <TouchableOpacity onPress={() => setFavorite((f) => !f)} accessibilityLabel="Favori">
            <SymbolView
              tintColor={favorite ? '#c0392b' : '#999'}
              name={{ ios: favorite ? 'heart.fill' : 'heart', android: favorite ? 'favorite' : 'favorite_border', web: 'heart' }}
              size={20}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.tabsRow}>
          {TABS.map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
              <ThemedText style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>{tab}</ThemedText>
              {activeTab === tab ? <View style={styles.tabIndicator} /> : null}
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {!product?.process ? (
            <ThemedText style={styles.emptyText}>Bientôt disponible pour ce produit.</ThemedText>
          ) : activeTab === 'Fabrication' ? (
            <>
              <ThemedText style={styles.sectionTitle}>Diagramme de fabrication</ThemedText>
              <View style={styles.diagram}>
                {product.process.fabrication.map((step, index) => (
                  <View key={step} style={styles.diagramStepWrapper}>
                    <View style={styles.diagramBox}>
                      <ThemedText style={styles.diagramBoxText}>{step}</ThemedText>
                    </View>
                    {index < product.process!.fabrication.length - 1 ? (
                      <SymbolView tintColor="#1b8a2a" name={{ ios: 'arrow.down', android: 'arrow_downward', web: 'arrow-down' }} size={16} />
                    ) : null}
                  </View>
                ))}
              </View>
            </>
          ) : activeTab === 'Paramètres' ? (
            <View style={styles.paramList}>
              {product.process.parametres.map((param) => (
                <View key={param.label} style={styles.paramRow}>
                  <ThemedText style={styles.paramLabel}>{param.label}</ThemedText>
                  <ThemedText style={styles.paramValue}>{param.value}</ThemedText>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.infoList}>
              {product.process.conservation.map((tip, index) => (
                <View key={index} style={styles.infoRow}>
                  <SymbolView tintColor="#1b8a2a" name={{ ios: 'checkmark', android: 'check', web: 'check' }} size={16} />
                  <ThemedText style={styles.infoText}>{tip}</ThemedText>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  safeArea: { flex: 1, width: '100%', paddingHorizontal: Spacing.four, paddingBottom: BottomTabInset },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.two, gap: Spacing.two },
  backButton: { padding: Spacing.one },
  productIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f1f7ef',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  productPhoto: { width: '100%', height: '100%' },
  headerTitle: { flex: 1, color: '#1b8a2a', fontSize: 18, fontWeight: '700' },
  tabsRow: {
    flexDirection: 'row',
    marginTop: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  tabItem: { flex: 1, alignItems: 'center', paddingBottom: Spacing.two },
  tabLabel: { fontSize: 13, color: '#999' },
  tabLabelActive: { color: '#1b8a2a', fontWeight: '700' },
  tabIndicator: {
    marginTop: Spacing.one,
    height: 2,
    width: '80%',
    backgroundColor: '#1b8a2a',
    borderRadius: 1,
  },
  scrollContent: { paddingTop: Spacing.four, paddingBottom: 120 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: Spacing.three },
  diagram: { alignItems: 'center' },
  diagramStepWrapper: { alignItems: 'center', width: '100%' },
  diagramBox: {
    width: '100%',
    borderWidth: 1.5,
    borderColor: '#1b8a2a',
    backgroundColor: '#f1f7ef',
    borderRadius: 10,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    marginBottom: Spacing.one,
  },
  diagramBoxText: { textAlign: 'center', fontSize: 14, fontWeight: '600', color: '#111' },
  paramList: { gap: Spacing.two },
  paramRow: {
    backgroundColor: '#f5f6f8',
    borderRadius: 12,
    padding: Spacing.three,
  },
  paramLabel: { fontSize: 13, color: '#666', marginBottom: 2 },
  paramValue: { fontSize: 15, fontWeight: '700', color: '#111' },
  infoList: { gap: Spacing.two },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.two },
  infoText: { flex: 1, fontSize: 14, color: '#333' },
  emptyText: { color: '#666', textAlign: 'center', marginTop: Spacing.four },
});
