import { ProductImage } from '@/components/product-image';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getProductByName } from '@/constants/fruit-products';
import { BottomTabInset, Spacing } from '@/constants/theme';
import {
  claimFreeDiagram,
  createPaymentCheckout,
  FORMATION_ACCESS_PRICE,
  getFreeDiagramSlug,
  getPaymentStatus,
  isDiagramUnlocked,
  PaymentMethod,
  unlockDiagram,
} from '@/utils/formation-access';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TABS = ['Fabrication', 'Paramètres', 'Conservation'] as const;
const PAYMENT_METHODS: { id: PaymentMethod; title: string; image: number }[] = [
  { id: 'wave', title: 'Wave', image: require('../../../../assets/images/wave.png') },
  { id: 'orange_money', title: 'Orange Money', image: require('../../../../assets/images/orange money.png') },
  { id: 'paypal', title: 'PayPal', image: require('../../../../assets/images/Paypal_2014_logo.png') },
];

export default function ProductDetailScreen() {
  const router = useRouter();
  const { name } = useLocalSearchParams<{ name?: string }>();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('Fabrication');
  const [favorite, setFavorite] = useState(false);
  const [diagramUnlocked, setDiagramUnlocked] = useState(false);
  const [diagramAccessReady, setDiagramAccessReady] = useState(false);
  const [freeDiagramSlug, setFreeDiagramSlug] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('wave');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const product = getProductByName(name ?? '');
  const diagramSlug = (product?.name ?? name ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

  useEffect(() => {
    let active = true;
    setDiagramAccessReady(false);

    Promise.all([isDiagramUnlocked(diagramSlug), getFreeDiagramSlug()]).then(([unlocked, freeSlug]) => {
      if (!active) return;
      setDiagramUnlocked(unlocked);
      setFreeDiagramSlug(freeSlug);
      setDiagramAccessReady(true);
      setPaymentId(null);
      setCheckoutUrl(null);
    }).catch(() => {
      if (active) setDiagramAccessReady(true);
    });

    return () => {
      active = false;
    };
  }, [diagramSlug]);

  const handleFreeDiagram = async () => {
    const claimed = await claimFreeDiagram(diagramSlug);
    if (claimed) {
      setFreeDiagramSlug(diagramSlug);
      setDiagramUnlocked(true);
    } else {
      setFreeDiagramSlug(await getFreeDiagramSlug());
      Alert.alert('Forfait gratuit déjà utilisé', 'Un seul diagramme de fabrication est inclus gratuitement sur cet appareil.');
    }
  };

  const handleDiagramPayment = async () => {
    setPaymentLoading(true);
    try {
      const checkout = checkoutUrl && paymentId
        ? { checkoutUrl, paymentId }
        : await createPaymentCheckout(diagramSlug, selectedPaymentMethod, 'diagram');
      setCheckoutUrl(checkout.checkoutUrl);
      setPaymentId(checkout.paymentId);
      await Linking.openURL(checkout.checkoutUrl);
    } catch (error) {
      Alert.alert('Paiement indisponible', error instanceof Error ? error.message : 'Impossible de démarrer le paiement.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleVerifyDiagramPayment = async () => {
    if (!paymentId) return;
    setPaymentLoading(true);
    try {
      const status = await getPaymentStatus(paymentId);
      if (status === 'paid') {
        await unlockDiagram(diagramSlug);
        setDiagramUnlocked(true);
        Alert.alert('Paiement confirmé', 'Le diagramme de fabrication est maintenant accessible.');
      } else if (status === 'pending') {
        Alert.alert('Paiement en attente', 'La transaction n’est pas encore confirmée. Réessayez dans quelques instants.');
      } else {
        setPaymentId(null);
        setCheckoutUrl(null);
        Alert.alert('Paiement non confirmé', 'La transaction a échoué ou a été annulée. Vous pouvez réessayer.');
      }
    } catch (error) {
      Alert.alert('Vérification impossible', error instanceof Error ? error.message : 'Impossible de vérifier le paiement.');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Retour" style={styles.backButton}>
            <SymbolView tintColor="#1b8a2a" name={{ ios: 'chevron.left', android: 'arrow_back', web: 'chevron-left' }} size={22} />
          </TouchableOpacity>
          <View style={styles.productIcon}>
            <ProductImage
              photo={product?.photo}
              query={product?.searchQuery ?? name ?? 'produit'}
              icon={product?.icon ?? { ios: 'shippingbox.fill', android: 'inventory_2', web: 'package' }}
              iconSize={18}
              style={styles.productPhoto}
            />
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
            !diagramAccessReady ? (
              <ActivityIndicator color="#1b8a2a" style={styles.accessLoader} />
            ) : diagramUnlocked ? (
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
            ) : (
              <View style={styles.diagramPaywall}>
                <View style={styles.diagramLockIcon}>
                  <SymbolView tintColor="#1b8a2a" name={{ ios: 'lock.fill', android: 'lock', web: 'lock' }} size={24} />
                </View>
                <ThemedText style={styles.paywallTitle}>Accéder au diagramme</ThemedText>
                <ThemedText style={styles.paywallDescription}>
                  {freeDiagramSlug
                    ? 'Votre diagramme gratuit a déjà été choisi. Débloquez celui-ci avec un paiement.'
                    : 'Choisissez un diagramme gratuit, ou payez pour accéder à celui-ci.'}
                </ThemedText>

                {!freeDiagramSlug ? (
                  <TouchableOpacity onPress={handleFreeDiagram} style={styles.freeButton} activeOpacity={0.85}>
                    <ThemedText style={styles.freeButtonTitle}>Ouvrir gratuitement</ThemedText>
                    <ThemedText style={styles.freeButtonCaption}>1 diagramme au choix inclus</ThemedText>
                  </TouchableOpacity>
                ) : null}

                <ThemedText style={styles.paidPrice}>{FORMATION_ACCESS_PRICE.toLocaleString('fr-FR')} FCFA</ThemedText>
                <ThemedText style={styles.paymentLabel}>Ou choisir un paiement</ThemedText>
                <View style={styles.paymentMethods}>
                  {PAYMENT_METHODS.map((method) => {
                    const selected = selectedPaymentMethod === method.id;
                    return (
                      <TouchableOpacity
                        key={method.id}
                        accessibilityRole="radio"
                        accessibilityState={{ selected }}
                        onPress={() => setSelectedPaymentMethod(method.id)}
                        style={[styles.paymentMethod, selected && styles.paymentMethodSelected]}
                      >
                        <Image source={method.image} style={styles.paymentLogo} resizeMode="contain" accessibilityLabel={`${method.title} logo`} />
                        <ThemedText style={styles.paymentMethodName}>{method.title}</ThemedText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <TouchableOpacity onPress={handleDiagramPayment} disabled={paymentLoading} style={styles.checkoutButton} activeOpacity={0.85}>
                  <ThemedText style={styles.checkoutButtonText}>
                    {paymentLoading ? 'Veuillez patienter...' : `Payer avec ${PAYMENT_METHODS.find((method) => method.id === selectedPaymentMethod)?.title}`}
                  </ThemedText>
                </TouchableOpacity>
                {paymentId ? (
                  <TouchableOpacity onPress={handleVerifyDiagramPayment} disabled={paymentLoading} style={styles.verifyButton}>
                    <ThemedText style={styles.verifyButtonText}>J’ai payé, vérifier</ThemedText>
                  </TouchableOpacity>
                ) : null}
              </View>
            )
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
  accessLoader: { marginTop: 48 },
  diagramPaywall: {
    alignItems: 'center',
    backgroundColor: '#f8faf8',
    borderWidth: 1,
    borderColor: '#e2e9e3',
    borderRadius: 16,
    padding: Spacing.four,
  },
  diagramLockIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e8f5e9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.two,
  },
  paywallTitle: { color: '#17231a', fontSize: 20, fontWeight: '800', textAlign: 'center', marginBottom: Spacing.one },
  paywallDescription: { color: '#5c665e', fontSize: 14, textAlign: 'center', lineHeight: 20, marginBottom: Spacing.three },
  freeButton: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#b7dfbd',
    padding: Spacing.three,
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  freeButtonTitle: { color: '#216b31', fontSize: 15, fontWeight: '800' },
  freeButtonCaption: { color: '#4c7554', fontSize: 12, marginTop: 3 },
  paidPrice: { color: '#152019', fontSize: 24, fontWeight: '800', marginTop: Spacing.one },
  paymentLabel: { color: '#626b64', fontSize: 13, marginVertical: Spacing.two },
  paymentMethods: { width: '100%', flexDirection: 'row', gap: 8, marginBottom: Spacing.three },
  paymentMethod: {
    flex: 1,
    minWidth: 0,
    minHeight: 78,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e1e5e2',
    borderRadius: 10,
    backgroundColor: '#ffffff',
    padding: 6,
  },
  paymentMethodSelected: { borderColor: '#1b8a2a', backgroundColor: '#f1f7ef' },
  paymentLogo: { width: 56, height: 38, marginBottom: 4 },
  paymentMethodName: { color: '#262c28', fontSize: 10, fontWeight: '700', textAlign: 'center' },
  checkoutButton: {
    width: '100%',
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1b8a2a',
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
  },
  checkoutButtonText: { color: '#ffffff', fontSize: 14, fontWeight: '800', textAlign: 'center' },
  verifyButton: { padding: Spacing.three },
  verifyButtonText: { color: '#1b8a2a', fontSize: 13, fontWeight: '700' },
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
