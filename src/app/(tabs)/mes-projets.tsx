import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GhostButton } from '@/components/ui/ghost-button';
import { PrimaryButton } from '@/components/ui/primary-button';
import { formations } from '@/constants/formations';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { computeProjectTotals, formatAmount, Intrant, projectStorageKey, SavedProject, toNumber } from '@/utils/projects-storage';
import {
  claimFreeProject,
  createPaymentCheckout,
  FORMATION_ACCESS_PRICE,
  getFreeProjectSlug,
  getPaymentStatus,
  isProjectUnlocked,
  PaymentMethod,
  unlockProject,
} from '@/utils/formation-access';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Image } from 'expo-image';
import * as Linking from 'expo-linking';
import { SymbolView } from 'expo-symbols';
import { useEffect, useMemo, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

let nextId = 1;
function createIntrant(): Intrant {
  return { id: String(nextId++), name: '', quantity: '', unitPrice: '' };
}

const TABS = ['Coûts', 'Commercialisation'] as const;
const PAYMENT_METHODS: { id: PaymentMethod; title: string; image: number }[] = [
  { id: 'wave', title: 'Wave', image: require('../../../assets/images/wave.png') },
  { id: 'orange_money', title: 'Orange Money', image: require('../../../assets/images/orange money.png') },
  { id: 'paypal', title: 'PayPal', image: require('../../../assets/images/Paypal_2014_logo.png') },
];

export default function MesProjetsScreen() {
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('Coûts');
  const [selectedSlug, setSelectedSlug] = useState(formations[0].slug);
  const [intrants, setIntrants] = useState<Intrant[]>([createIntrant()]);
  const [quantiteObtenue, setQuantiteObtenue] = useState('');
  const [marge, setMarge] = useState('1.5');
  const [quantiteVendue, setQuantiteVendue] = useState('');
  const [showQuantiteVendue, setShowQuantiteVendue] = useState(false);
  const [projectUnlocked, setProjectUnlocked] = useState(false);
  const [projectAccessReady, setProjectAccessReady] = useState(false);
  const [freeProjectSlug, setFreeProjectSlug] = useState<string | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('wave');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setProjectAccessReady(false);

    Promise.all([isProjectUnlocked(selectedSlug), getFreeProjectSlug()]).then(([unlocked, freeSlug]) => {
      if (!active) return;
      setProjectUnlocked(unlocked);
      setFreeProjectSlug(freeSlug);
      setProjectAccessReady(true);
      setPaymentId(null);
      setCheckoutUrl(null);
    }).catch(() => {
      if (active) setProjectAccessReady(true);
    });

    return () => {
      active = false;
    };
  }, [selectedSlug]);

  const updateIntrant = (id: string, patch: Partial<Intrant>) => {
    setIntrants((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  };

  const addIntrant = () => setIntrants((prev) => [...prev, createIntrant()]);
  const removeIntrant = (id: string) => setIntrants((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev));

  useEffect(() => {
    AsyncStorage.getItem(projectStorageKey(selectedSlug))
      .then((raw) => {
        setShowQuantiteVendue(false);
        if (!raw) {
          setIntrants([createIntrant()]);
          setQuantiteObtenue('');
          setMarge('1.5');
          setQuantiteVendue('');
          return;
        }
        const saved = JSON.parse(raw) as SavedProject;
        setIntrants(saved.intrants.length ? saved.intrants : [createIntrant()]);
        setQuantiteObtenue(saved.quantiteObtenue ?? '');
        setMarge(saved.marge ?? '1.5');
        setQuantiteVendue(saved.quantiteVendue ?? '');
      })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSlug]);

  const handleSave = async () => {
    try {
      await AsyncStorage.setItem(projectStorageKey(selectedSlug), JSON.stringify({ intrants, quantiteObtenue, marge, quantiteVendue }));
      setShowQuantiteVendue(true);
      setIntrants([createIntrant()]);
      Alert.alert('Enregistré', 'Les coûts de ce produit ont été sauvegardés. Retrouve-les dans ton Profil.');
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      Alert.alert('Erreur', `Impossible d'enregistrer : ${message}`);
    }
  };

  const handleSaveQuantiteVendue = async () => {
    try {
      await AsyncStorage.setItem(
        projectStorageKey(selectedSlug),
        JSON.stringify({ intrants, quantiteObtenue, marge, quantiteVendue })
      );
      Alert.alert('Enregistré', 'La quantité vendue a été sauvegardée.');
      setIntrants([createIntrant()]);
      setQuantiteObtenue('');
      setMarge('1.5');
      setQuantiteVendue('');
      setShowQuantiteVendue(false);
    } catch (e) {
      const message = e instanceof Error ? e.message : String(e);
      Alert.alert('Erreur', `Impossible d'enregistrer : ${message}`);
    }
  };

  const handleFreeProject = async () => {
    const claimed = await claimFreeProject(selectedSlug);
    if (claimed) {
      setFreeProjectSlug(selectedSlug);
      setProjectUnlocked(true);
      return;
    }
    setFreeProjectSlug(await getFreeProjectSlug());
    Alert.alert('Forfait gratuit déjà utilisé', 'Un seul projet est inclus gratuitement sur cet appareil.');
  };

  const handleProjectPayment = async () => {
    setPaymentLoading(true);
    try {
      const checkout = checkoutUrl && paymentId
        ? { checkoutUrl, paymentId }
        : await createPaymentCheckout(selectedSlug, selectedPaymentMethod, 'project');
      setCheckoutUrl(checkout.checkoutUrl);
      setPaymentId(checkout.paymentId);
      await Linking.openURL(checkout.checkoutUrl);
    } catch (error) {
      Alert.alert('Paiement indisponible', error instanceof Error ? error.message : 'Impossible de démarrer le paiement.');
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleVerifyProjectPayment = async () => {
    if (!paymentId) return;
    setPaymentLoading(true);
    try {
      const status = await getPaymentStatus(paymentId);
      if (status === 'paid') {
        await unlockProject(selectedSlug);
        setProjectUnlocked(true);
        Alert.alert('Paiement confirmé', 'Votre projet est maintenant accessible.');
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

  const { coutProduction, prixUnitaireProduit, prixVenteRecommande } = useMemo(
    () => computeProjectTotals({ intrants, quantiteObtenue, marge }),
    [intrants, quantiteObtenue, marge]
  );
  const selectedFormation = formations.find((f) => f.slug === selectedSlug) ?? formations[0];
  const { commercialisation } = selectedFormation;

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText style={styles.title}>Mes projets</ThemedText>
        <ThemedText style={styles.subtitle}>Calculez le coût de production et le prix de vente recommandé</ThemedText>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.productPicker} contentContainerStyle={styles.productPickerContent}>
          {formations.map((formation) => (
            <TouchableOpacity
              key={formation.slug}
              onPress={() => setSelectedSlug(formation.slug)}
              style={[styles.productChip, selectedSlug === formation.slug && styles.productChipActive]}
            >
              <ThemedText style={[styles.productChipLabel, selectedSlug === formation.slug && styles.productChipLabelActive]}>
                {formation.subtitle}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.tabsRow}>
          {TABS.map((tab) => (
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
              <ThemedText style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>{tab}</ThemedText>
              {activeTab === tab ? <View style={styles.tabIndicator} /> : null}
            </TouchableOpacity>
          ))}
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {!projectAccessReady ? (
              <View style={styles.accessLoading}>
                <ThemedText style={styles.paywallDescription}>Vérification de l’accès au projet...</ThemedText>
              </View>
            ) : !projectUnlocked ? (
              <View style={styles.projectPaywall}>
                <View style={styles.projectLockBadge}>
                  <SymbolView tintColor="#1b8a2a" name={{ ios: 'lock.fill', android: 'lock', web: 'lock' }} size={24} />
                </View>
                <ThemedText style={styles.paywallTitle}>Accéder à ce projet</ThemedText>
                <ThemedText style={styles.paywallDescription}>
                  {freeProjectSlug
                    ? 'Votre projet gratuit a déjà été choisi. Débloquez celui-ci par paiement.'
                    : 'Un projet est gratuit au choix. Les autres sont accessibles après paiement.'}
                </ThemedText>

                {!freeProjectSlug ? (
                  <TouchableOpacity onPress={handleFreeProject} style={styles.freeProjectButton} activeOpacity={0.85}>
                    <ThemedText style={styles.freeProjectTitle}>Utiliser le forfait gratuit</ThemedText>
                    <ThemedText style={styles.freeProjectCaption}>1 projet au choix inclus</ThemedText>
                  </TouchableOpacity>
                ) : null}

                <ThemedText style={styles.projectPrice}>{FORMATION_ACCESS_PRICE.toLocaleString('fr-FR')} FCFA</ThemedText>
                <ThemedText style={styles.paymentHint}>Ou payer avec</ThemedText>
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
                        <Image source={method.image} style={styles.paymentLogo} contentFit="contain" accessibilityLabel={`${method.title} logo`} />
                        <ThemedText style={styles.paymentMethodName}>{method.title}</ThemedText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <PrimaryButton
                  title={paymentLoading ? 'Veuillez patienter...' : `Payer avec ${PAYMENT_METHODS.find((method) => method.id === selectedPaymentMethod)?.title}`}
                  onPress={handleProjectPayment}
                  disabled={paymentLoading}
                  style={styles.projectCheckoutButton}
                />
                {paymentId ? (
                  <TouchableOpacity onPress={handleVerifyProjectPayment} disabled={paymentLoading} style={styles.verifyProjectButton}>
                    <ThemedText style={styles.verifyProjectText}>J’ai payé, vérifier</ThemedText>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : activeTab === 'Coûts' ? (
              <>
                <ThemedText style={styles.sectionTitle}>Intrants</ThemedText>

            {intrants.map((intrant) => {
              const total = toNumber(intrant.quantity) * toNumber(intrant.unitPrice);
              return (
                <View key={intrant.id} style={styles.intrantCard}>
                  <View style={styles.intrantHeaderRow}>
                    <TextInput
                      style={styles.nameInput}
                      placeholder="Nom de l'intrant"
                      placeholderTextColor="#999"
                      value={intrant.name}
                      onChangeText={(v) => updateIntrant(intrant.id, { name: v })}
                    />
                    <TouchableOpacity onPress={() => removeIntrant(intrant.id)} accessibilityLabel="Supprimer l'intrant">
                      <SymbolView tintColor="#c0392b" name={{ ios: 'trash', android: 'delete', web: 'trash-2' }} size={18} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.intrantFieldsRow}>
                    <View style={styles.fieldColumn}>
                      <ThemedText style={styles.fieldLabel}>Quantité</ThemedText>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor="#999"
                        keyboardType="decimal-pad"
                        value={intrant.quantity}
                        onChangeText={(v) => updateIntrant(intrant.id, { quantity: v })}
                      />
                    </View>
                    <View style={styles.fieldColumn}>
                      <ThemedText style={styles.fieldLabel}>Prix unitaire</ThemedText>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor="#999"
                        keyboardType="decimal-pad"
                        value={intrant.unitPrice}
                        onChangeText={(v) => updateIntrant(intrant.id, { unitPrice: v })}
                      />
                    </View>
                  </View>

                  <View style={styles.intrantTotalRow}>
                    <ThemedText style={styles.intrantTotalLabel}>Total</ThemedText>
                    <ThemedText style={styles.intrantTotalValue}>{formatAmount(total)}</ThemedText>
                  </View>
                </View>
              );
            })}

            <GhostButton title="Ajouter un intrant" onPress={addIntrant} icon={{ ios: 'plus', android: 'add', web: 'plus' }} />

                <View style={styles.resultCard}>
                  <ThemedText style={styles.resultLabel}>Coût de production total</ThemedText>
                  <ThemedText style={styles.resultValue}>{formatAmount(coutProduction)}</ThemedText>
                </View>

                <ThemedText style={styles.sectionTitle}>Production obtenue</ThemedText>

                <View style={styles.fieldColumn}>
                  <ThemedText style={styles.fieldLabel}>Quantité obtenue</ThemedText>
                  <TextInput
                    style={styles.input}
                    placeholder="0"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                    value={quantiteObtenue}
                    onChangeText={setQuantiteObtenue}
                  />
                </View>

                <View style={[styles.fieldColumn, { marginTop: Spacing.three }]}>
                  <ThemedText style={styles.fieldLabel}>Marge (coefficient)</ThemedText>
                  <TextInput
                    style={styles.input}
                    placeholder="1.5"
                    placeholderTextColor="#999"
                    keyboardType="decimal-pad"
                    value={marge}
                    onChangeText={setMarge}
                  />
                </View>

                <View style={styles.resultCard}>
                  <ThemedText style={styles.resultLabel}>Prix unitaire du produit</ThemedText>
                  <ThemedText style={styles.resultValue}>{formatAmount(prixUnitaireProduit)}</ThemedText>
                </View>

                <View style={[styles.resultCard, styles.resultCardHighlight]}>
                  <ThemedText style={[styles.resultLabel, styles.resultTextOnGreen]}>Prix de vente recommandé</ThemedText>
                  <ThemedText style={[styles.resultValue, styles.resultTextOnGreen]}>{formatAmount(prixVenteRecommande)}</ThemedText>
                </View>

                <PrimaryButton title="Enregistrer" onPress={handleSave} style={styles.saveButton} />

                {showQuantiteVendue ? (
                  <View style={styles.quantiteVendueCard}>
                    <ThemedText style={styles.sectionTitle}>Quantité vendue</ThemedText>
                    <View style={styles.fieldColumn}>
                      <ThemedText style={styles.fieldLabel}>Quantité vendue</ThemedText>
                      <TextInput
                        style={styles.input}
                        placeholder="0"
                        placeholderTextColor="#999"
                        keyboardType="decimal-pad"
                        value={quantiteVendue}
                        onChangeText={setQuantiteVendue}
                      />
                    </View>
                    <PrimaryButton
                      title="Valider la quantité vendue"
                      onPress={handleSaveQuantiteVendue}
                      style={styles.saveButton}
                    />
                  </View>
                ) : null}
              </>
            ) : (
              <>
                <ThemedText style={styles.sectionTitle}>Emballage recommandé</ThemedText>
                <View style={styles.packagingCard}>
                  <View style={styles.packagingIcon}>
                    <ThemedText style={styles.packagingEmoji}>{commercialisation.packagingEmoji}</ThemedText>
                  </View>
                  <View style={styles.packagingTextColumn}>
                    <ThemedText style={styles.packagingTitle}>{commercialisation.packagingTitle}</ThemedText>
                    {commercialisation.packagingFeatures.map((label) => (
                      <View key={label} style={styles.packagingRow}>
                        <SymbolView tintColor="#1b8a2a" name={{ ios: 'checkmark', android: 'check', web: 'check' }} size={14} />
                        <ThemedText style={styles.packagingLabel}>{label}</ThemedText>
                      </View>
                    ))}
                  </View>
                </View>

                <ThemedText style={styles.sectionTitle}>Circuits de distribution</ThemedText>
                <View style={styles.distributionList}>
                  {commercialisation.distributionChannels.map((channel) => (
                    <View key={channel.label} style={styles.distributionRow}>
                      <View style={styles.distributionIcon}>
                        <SymbolView tintColor="#1b8a2a" name={channel.icon} size={16} />
                      </View>
                      <ThemedText style={styles.distributionLabel}>{channel.label}</ThemedText>
                    </View>
                  ))}
                </View>
              </>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  safeArea: { flex: 1, width: '100%', paddingHorizontal: Spacing.four, paddingBottom: BottomTabInset },
  title: { marginTop: Spacing.two, fontSize: 24, fontWeight: '700', color: '#1b8a2a' },
  subtitle: { marginTop: Spacing.one, color: '#666' },
  productPicker: { marginTop: Spacing.three, flexGrow: 0 },
  productPickerContent: { gap: Spacing.two, paddingRight: Spacing.three },
  productChip: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  productChipActive: { borderColor: '#1b8a2a', backgroundColor: '#f1f7ef' },
  productChipLabel: { fontSize: 13, color: '#666' },
  productChipLabelActive: { color: '#1b8a2a', fontWeight: '700' },
  tabsRow: {
    flexDirection: 'row',
    marginTop: Spacing.four,
    borderBottomWidth: 1,
    borderBottomColor: '#e6e6e6',
  },
  tabItem: { flex: 1, alignItems: 'center', paddingBottom: Spacing.two },
  tabLabel: { fontSize: 14, color: '#999' },
  tabLabelActive: { color: '#1b8a2a', fontWeight: '700' },
  tabIndicator: {
    marginTop: Spacing.one,
    height: 2,
    width: '80%',
    backgroundColor: '#1b8a2a',
    borderRadius: 1,
  },
  scrollContent: { paddingTop: Spacing.four, paddingBottom: 120 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: Spacing.two, marginTop: Spacing.two },
  intrantCard: {
    backgroundColor: '#f5f6f8',
    borderRadius: 14,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  intrantHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: Spacing.two },
  nameInput: { flex: 1, fontSize: 15, fontWeight: '700', color: '#111', paddingVertical: 4 },
  intrantFieldsRow: { flexDirection: 'row', gap: Spacing.three },
  fieldColumn: { flex: 1 },
  fieldLabel: { fontSize: 13, color: '#666', marginBottom: 4 },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    fontSize: 15,
    color: '#111',
  },
  intrantTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.two,
    paddingTop: Spacing.two,
    borderTopWidth: 1,
    borderTopColor: '#e6e6e6',
  },
  intrantTotalLabel: { fontSize: 13, color: '#666' },
  intrantTotalValue: { fontSize: 15, fontWeight: '700', color: '#1b8a2a' },
  resultCard: {
    marginTop: Spacing.three,
    backgroundColor: '#f1f7ef',
    borderRadius: 14,
    padding: Spacing.three,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resultCardHighlight: { backgroundColor: '#1b8a2a' },
  resultTextOnGreen: { color: '#ffffff' },
  resultLabel: { fontSize: 14, color: '#333' },
  resultValue: { fontSize: 18, fontWeight: '700', color: '#1b8a2a' },
  saveButton: { marginTop: Spacing.four },
  quantiteVendueCard: {
    marginTop: Spacing.four,
    backgroundColor: '#f5f6f8',
    borderRadius: 14,
    padding: Spacing.three,
  },
  packagingCard: {
    flexDirection: 'row',
    backgroundColor: '#f5f6f8',
    borderRadius: 14,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  packagingIcon: {
    width: 88,
    height: 88,
    borderRadius: 12,
    backgroundColor: '#eef1ee',
    alignItems: 'center',
    justifyContent: 'center',
  },
  packagingEmoji: { fontSize: 36 },
  packagingTextColumn: { flex: 1, justifyContent: 'center' },
  packagingTitle: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: Spacing.one },
  packagingRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 2 },
  packagingLabel: { fontSize: 13, color: '#333' },
  distributionList: { gap: Spacing.two },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6f8',
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  distributionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e6f4ea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  distributionLabel: { fontSize: 15, fontWeight: '600', color: '#111' },
  accessLoading: { alignItems: 'center', paddingVertical: Spacing.five },
  projectPaywall: {
    alignItems: 'center',
    backgroundColor: '#f8faf8',
    borderWidth: 1,
    borderColor: '#e2e9e3',
    borderRadius: 16,
    padding: Spacing.four,
  },
  projectLockBadge: {
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
  freeProjectButton: {
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#e8f5e9',
    borderWidth: 1,
    borderColor: '#b7dfbd',
    padding: Spacing.three,
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  freeProjectTitle: { color: '#216b31', fontSize: 15, fontWeight: '800' },
  freeProjectCaption: { color: '#4c7554', fontSize: 12, marginTop: 3 },
  projectPrice: { color: '#152019', fontSize: 24, fontWeight: '800', marginTop: Spacing.one },
  paymentHint: { color: '#626b64', fontSize: 13, marginVertical: Spacing.two },
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
  projectCheckoutButton: { width: '100%', marginBottom: Spacing.two },
  verifyProjectButton: { padding: Spacing.three },
  verifyProjectText: { color: '#1b8a2a', fontSize: 13, fontWeight: '700' },
});
