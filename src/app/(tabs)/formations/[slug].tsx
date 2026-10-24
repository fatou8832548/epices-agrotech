import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { FormationDocument, formations, QuizQuestion } from '@/constants/formations';
import { BottomTabInset, Spacing } from '@/constants/theme';
import {
  createPaymentCheckout,
  FORMATION_ACCESS_PRICE,
  getPaymentStatus,
  isFormationUnlocked,
  PaymentMethod,
  unlockFormation,
} from '@/utils/formation-access';
import { Asset } from 'expo-asset';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { SymbolView } from 'expo-symbols';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEffect, useState } from 'react';
import { Alert, Image, Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TABS = ['Modules', 'Vidéo', 'Documents', 'Quiz'] as const;
const PAYMENT_METHODS: { id: PaymentMethod; title: string; image: number }[] = [
  { id: 'wave', title: 'Wave', image: require('../../../../assets/images/wave.png') },
  { id: 'orange_money', title: 'Orange Money', image: require('../../../../assets/images/orange money.png') },
  { id: 'paypal', title: 'PayPal', image: require('../../../../assets/images/Paypal_2014_logo.png') },
];

async function openDocument(doc: FormationDocument, router: ReturnType<typeof useRouter>) {
  try {
    const [downloaded] = await Asset.loadAsync(doc.asset);
    const uri = downloaded.localUri ?? downloaded.uri;
    if (doc.fileType === 'PDF') {
      router.push({ pathname: '/formations/document-viewer', params: { uri, title: doc.title } });
      return;
    }
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      Alert.alert('Ouverture indisponible', "Aucune application n'est disponible pour ouvrir ce document sur cet appareil.");
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    Alert.alert("Impossible d'ouvrir le document", message);
  }
}

function VideoTab({ video }: { video?: number }) {
  const player = useVideoPlayer(video ?? null, (p) => {
    p.loop = false;
  });

  if (!video) {
    return <ThemedText style={styles.emptyText}>Aucune vidéo pour l'instant.</ThemedText>;
  }

  return <VideoView style={styles.video} player={player} allowsFullscreen allowsPictureInPicture nativeControls />;
}

function QuizView({ questions }: { questions: QuizQuestion[] }) {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  if (!questions.length) {
    return <ThemedText style={styles.emptyText}>Aucun quiz pour l'instant.</ThemedText>;
  }

  if (finished) {
    return (
      <View style={styles.quizResultCard}>
        <ThemedText style={styles.quizResultScore}>
          {score} / {questions.length}
        </ThemedText>
        <ThemedText style={styles.quizResultLabel}>Bonnes réponses</ThemedText>
        <PrimaryButton
          title="Recommencer le quiz"
          onPress={() => {
            setIndex(0);
            setSelected(null);
            setScore(0);
            setFinished(false);
          }}
          style={{ marginTop: Spacing.four }}
        />
      </View>
    );
  }

  const question = questions[index];
  const isLast = index === questions.length - 1;

  const handleSelect = (optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);
    if (optionIndex === question.correctIndex) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (isLast) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  };

  return (
    <View>
      <ThemedText style={styles.quizProgress}>
        Question {index + 1} / {questions.length}
      </ThemedText>
      <ThemedText style={styles.quizQuestion}>{question.question}</ThemedText>

      {question.options.map((option, optionIndex) => {
        const isSelected = selected === optionIndex;
        const isCorrect = optionIndex === question.correctIndex;
        const showState = selected !== null;
        return (
          <TouchableOpacity
            key={option}
            style={[
              styles.quizOption,
              showState && isCorrect && styles.quizOptionCorrect,
              showState && isSelected && !isCorrect && styles.quizOptionWrong,
            ]}
            onPress={() => handleSelect(optionIndex)}
            disabled={selected !== null}
          >
            <ThemedText style={styles.quizOptionText}>{option}</ThemedText>
          </TouchableOpacity>
        );
      })}

      {selected !== null ? (
        <PrimaryButton title={isLast ? 'Voir le score' : 'Question suivante'} onPress={handleNext} style={{ marginTop: Spacing.three }} />
      ) : null}
    </View>
  );
}

export default function FormationDetailScreen() {
  const router = useRouter();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>('Modules');
  const [activeQuizModuleIndex, setActiveQuizModuleIndex] = useState<number | null>(null);
  const [expandedModuleIndex, setExpandedModuleIndex] = useState<number | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [checkingAccess, setCheckingAccess] = useState(true);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>('wave');
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);

  const formation = formations.find((f) => f.slug === slug) ?? formations[0];

  useEffect(() => {
    let active = true;

    isFormationUnlocked(String(slug)).then((hasAccess) => {
      if (active) {
        setIsUnlocked(hasAccess);
        setCheckingAccess(false);
      }
    });

    return () => {
      active = false;
    };
  }, [slug]);

  const handleTabChange = (tab: (typeof TABS)[number]) => {
    setActiveTab(tab);
    setActiveQuizModuleIndex(null);
  };

  const handlePayment = async () => {
    setPaymentLoading(true);
    try {
      const checkout = checkoutUrl && paymentId
        ? { checkoutUrl, paymentId }
        : await createPaymentCheckout(String(slug), selectedPaymentMethod);

      setCheckoutUrl(checkout.checkoutUrl);
      setPaymentId(checkout.paymentId);
      await Linking.openURL(checkout.checkoutUrl);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Impossible de démarrer le paiement.';
      Alert.alert('Paiement indisponible', message);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleVerifyPayment = async () => {
    if (!paymentId) return;
    setPaymentLoading(true);
    try {
      const status = await getPaymentStatus(paymentId);
      if (status === 'paid') {
        await unlockFormation(String(slug));
        setIsUnlocked(true);
        Alert.alert('Paiement confirmé', 'Votre accès à la formation est activé.');
      } else if (status === 'pending') {
        Alert.alert('Paiement en attente', 'Le paiement n’est pas encore confirmé. Réessayez dans quelques instants.');
      } else {
        setPaymentId(null);
        setCheckoutUrl(null);
        Alert.alert('Paiement non confirmé', 'La transaction a échoué ou a été annulée. Vous pouvez réessayer.');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Impossible de vérifier le paiement.';
      Alert.alert('Vérification impossible', message);
    } finally {
      setPaymentLoading(false);
    }
  };

  if (checkingAccess) {
    return null;
  }

  if (!isUnlocked) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.lockContainer}>
            <View style={styles.lockBadge}>
              <SymbolView tintColor="#1b8a2a" name={{ ios: 'lock.fill', android: 'lock', web: 'lock' }} size={28} />
            </View>
            <ThemedText style={styles.lockTitle}>Accès payant</ThemedText>
            <ThemedText style={styles.lockText}>Choisissez un moyen de paiement. Les modules seront accessibles après confirmation.</ThemedText>
            <ThemedText style={styles.lockPrice}>{FORMATION_ACCESS_PRICE.toLocaleString('fr-FR')} FCFA</ThemedText>

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
                    <ThemedText style={styles.paymentMethodLabel}>{method.title}</ThemedText>
                  </TouchableOpacity>
                );
              })}
            </View>

            <PrimaryButton
              title={paymentLoading ? 'Veuillez patienter...' : `Continuer avec ${PAYMENT_METHODS.find((method) => method.id === selectedPaymentMethod)?.title}`}
              onPress={handlePayment}
              disabled={paymentLoading}
              style={styles.payButton}
            />

            {paymentId ? (
              <TouchableOpacity onPress={handleVerifyPayment} disabled={paymentLoading} style={styles.verifyPaymentButton}>
                <ThemedText style={styles.backLinkText}>J’ai payé, vérifier le paiement</ThemedText>
              </TouchableOpacity>
            ) : null}

            <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
              <ThemedText style={styles.backLinkText}>Retour aux formations</ThemedText>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Retour" style={styles.backButton}>
            <SymbolView
              tintColor="#1b8a2a"
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'chevron-left' }}
              size={20}
            />
          </TouchableOpacity>
          <View style={styles.headerTextColumn}>
            <ThemedText style={styles.headerTitle}>{formation.title}</ThemedText>
            <ThemedText style={styles.headerSubtitle}>{formation.subtitle}</ThemedText>
          </View>
        </View>

        <View style={styles.tabsRow}>
          {TABS.map((tab) => (
            <TouchableOpacity key={tab} onPress={() => handleTabChange(tab)} style={styles.tabItem}>
              <ThemedText style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>{tab}</ThemedText>
              {activeTab === tab ? <View style={styles.tabIndicator} /> : null}
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'Modules' ? (
            <View style={styles.modulesList}>
              {formation.modules.map((module, index) => (
                <View key={module.title} style={styles.moduleCard}>
                  <TouchableOpacity
                    style={styles.moduleRow}
                    activeOpacity={module.content ? 0.7 : 1}
                    onPress={() => module.content && setExpandedModuleIndex(expandedModuleIndex === index ? null : index)}
                  >
                    <View style={styles.moduleNumber}>
                      <ThemedText style={styles.moduleNumberText}>{index + 1}</ThemedText>
                    </View>
                    <ThemedText style={styles.moduleTitle}>{module.title}</ThemedText>
                    <ThemedText style={styles.moduleDuration}>{module.duration}</ThemedText>
                    {module.document ? (
                      <TouchableOpacity
                        onPress={() => openDocument(module.document!, router)}
                        accessibilityLabel={module.document.title}
                      >
                        <SymbolView tintColor="#1b8a2a" name={{ ios: 'doc.text.fill', android: 'description', web: 'file-text' }} size={18} />
                      </TouchableOpacity>
                    ) : null}
                    {module.content ? (
                      <SymbolView
                        tintColor="#999"
                        name={{
                          ios: expandedModuleIndex === index ? 'chevron.up' : 'chevron.down',
                          android: expandedModuleIndex === index ? 'expand_less' : 'expand_more',
                          web: expandedModuleIndex === index ? 'chevron-up' : 'chevron-down',
                        }}
                        size={16}
                      />
                    ) : null}
                  </TouchableOpacity>

                  {module.content && expandedModuleIndex === index ? (
                    <View style={styles.moduleContent}>
                      {module.content.map((paragraph, paragraphIndex) => (
                        <ThemedText key={paragraphIndex} style={styles.moduleContentParagraph}>
                          {paragraph}
                        </ThemedText>
                      ))}
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          ) : activeTab === 'Documents' ? (
            <View style={styles.modulesList}>
              {formation.documents.length ? (
                formation.documents.map((doc) => (
                  <TouchableOpacity key={doc.title} style={styles.documentRow} onPress={() => openDocument(doc, router)}>
                    <View style={styles.documentIcon}>
                      <SymbolView tintColor="#1b8a2a" name={{ ios: 'doc.text.fill', android: 'description', web: 'file-text' }} size={20} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <ThemedText style={styles.moduleTitle}>{doc.title}</ThemedText>
                      <ThemedText style={styles.documentType}>{doc.fileType}</ThemedText>
                    </View>
                    <SymbolView tintColor="#999" name={{ ios: 'arrow.down.circle', android: 'download', web: 'download' }} size={20} />
                  </TouchableOpacity>
                ))
              ) : (
                <ThemedText style={styles.emptyText}>Aucun document pour l'instant.</ThemedText>
              )}
            </View>
          ) : activeTab === 'Quiz' ? (
            activeQuizModuleIndex !== null ? (
              <>
                <TouchableOpacity style={styles.quizBackRow} onPress={() => setActiveQuizModuleIndex(null)}>
                  <SymbolView tintColor="#1b8a2a" name={{ ios: 'chevron.left', android: 'arrow_back', web: 'chevron-left' }} size={16} />
                  <ThemedText style={styles.quizBackLabel}>{formation.modules[activeQuizModuleIndex].title}</ThemedText>
                </TouchableOpacity>
                <QuizView questions={formation.modules[activeQuizModuleIndex].quiz ?? []} />
              </>
            ) : (
              <View style={styles.modulesList}>
                {formation.modules.map((module, index) => (
                  <TouchableOpacity
                    key={module.title}
                    style={[styles.moduleRow, styles.moduleCard]}
                    disabled={!module.quiz?.length}
                    onPress={() => setActiveQuizModuleIndex(index)}
                  >
                    <View style={styles.moduleNumber}>
                      <ThemedText style={styles.moduleNumberText}>{index + 1}</ThemedText>
                    </View>
                    <ThemedText style={styles.moduleTitle}>{module.title}</ThemedText>
                    <ThemedText style={styles.moduleDuration}>
                      {module.quiz?.length ? `${module.quiz.length} questions` : 'Aucun quiz'}
                    </ThemedText>
                  </TouchableOpacity>
                ))}
              </View>
            )
          ) : activeTab === 'Vidéo' ? (
            <VideoTab video={formation.video} />
          ) : (
            <ThemedText style={styles.emptyText}>Contenu bientôt disponible.</ThemedText>
          )}

          {activeTab === 'Modules' ? (
            <PrimaryButton title="Commencer le module 1" onPress={() => {}} style={styles.startButton} />
          ) : null}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  safeArea: { flex: 1, width: '100%', paddingHorizontal: Spacing.four, paddingBottom: BottomTabInset },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.two },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#1b8a2a',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.three,
  },
  headerTextColumn: { flex: 1, alignItems: 'center' },
  fruitPicker: { marginTop: Spacing.three, flexGrow: 0 },
  fruitPickerContent: { gap: Spacing.two, paddingRight: Spacing.three },
  fruitChip: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one,
  },
  fruitChipActive: { borderColor: '#1b8a2a', backgroundColor: '#f1f7ef' },
  fruitChipLabel: { fontSize: 13, color: '#666' },
  fruitChipLabelActive: { color: '#1b8a2a', fontWeight: '700' },
  headerTitle: { color: '#1b8a2a', fontSize: 20, fontWeight: '700' },
  headerSubtitle: { color: '#666', fontSize: 14, marginTop: 2 },
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
  modulesList: { width: '100%' },
  moduleCard: { marginBottom: Spacing.two },
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6f8',
    borderRadius: 14,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  moduleContent: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6e6e6',
    borderRadius: 14,
    padding: Spacing.three,
    marginTop: Spacing.one,
    gap: Spacing.two,
  },
  moduleContentParagraph: { fontSize: 14, color: '#333', lineHeight: 20 },
  moduleNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1b8a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  moduleNumberText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  moduleTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: '#111' },
  moduleDuration: { fontSize: 12, color: '#666' },
  documentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6f8',
    borderRadius: 14,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    gap: Spacing.three,
  },
  documentIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#e6f4ea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  documentType: { fontSize: 12, color: '#666', marginTop: 2 },
  emptyText: { color: '#666', textAlign: 'center', marginTop: Spacing.four },
  startButton: { marginTop: Spacing.four },
  lockContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.five,
  },
  lockBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#edf8ef',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  lockTitle: { fontSize: 24, fontWeight: '800', marginBottom: Spacing.two, color: '#111' },
  lockText: { fontSize: 15, color: '#555', textAlign: 'center', lineHeight: 22, marginBottom: Spacing.two },
  lockPrice: { fontSize: 28, fontWeight: '800', color: '#1b8a2a', marginBottom: Spacing.three },
  paymentMethods: {
    width: '100%',
    maxWidth: 380,
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.three,
  },
  paymentMethod: {
    flex: 1,
    minWidth: 0,
    minHeight: 84,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    paddingHorizontal: 5,
    paddingVertical: 8,
    backgroundColor: '#ffffff',
  },
  paymentMethodSelected: {
    borderColor: '#1b8a2a',
    backgroundColor: '#f3faf4',
  },
  paymentLogo: {
    width: 64,
    height: 42,
    marginBottom: 6,
  },
  paymentMethodLabel: {
    color: '#222222',
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  payButton: {
    width: '100%',
    maxWidth: 380,
    marginBottom: Spacing.three,
  },
  verifyPaymentButton: { marginBottom: Spacing.two, padding: Spacing.two },
  backLink: { marginTop: Spacing.one },
  backLinkText: { color: '#1b8a2a', fontSize: 14, fontWeight: '700' },
  video: { width: '100%', height: 220, borderRadius: 14, backgroundColor: '#000' },
  quizBackRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.one, marginBottom: Spacing.three },
  quizBackLabel: { fontSize: 15, fontWeight: '700', color: '#1b8a2a' },
  quizProgress: { fontSize: 13, color: '#666', marginBottom: Spacing.one },
  quizQuestion: { fontSize: 17, fontWeight: '700', color: '#111', marginBottom: Spacing.three },
  quizOption: {
    backgroundColor: '#f5f6f8',
    borderRadius: 12,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  quizOptionCorrect: { borderColor: '#1b8a2a', backgroundColor: '#f1f7ef' },
  quizOptionWrong: { borderColor: '#c0392b', backgroundColor: '#fbeceb' },
  quizOptionText: { fontSize: 15, color: '#111' },
  quizResultCard: {
    alignItems: 'center',
    backgroundColor: '#f1f7ef',
    borderRadius: 16,
    padding: Spacing.four,
  },
  quizResultScore: { fontSize: 32, fontWeight: '800', color: '#1b8a2a' },
  quizResultLabel: { fontSize: 14, color: '#333', marginTop: Spacing.one },
});
