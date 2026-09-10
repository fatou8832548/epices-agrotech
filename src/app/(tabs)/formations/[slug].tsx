import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { formations, QuizQuestion } from '@/constants/formations';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { Asset } from 'expo-asset';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { SymbolView } from 'expo-symbols';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TABS = ['Modules', 'Vidéo', 'Documents', 'Quiz'] as const;

async function openDocument(asset: number) {
  try {
    const [downloaded] = await Asset.loadAsync(asset);
    const uri = downloaded.localUri ?? downloaded.uri;
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

  const formation = formations.find((f) => f.slug === slug) ?? formations[0];

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
            <TouchableOpacity key={tab} onPress={() => setActiveTab(tab)} style={styles.tabItem}>
              <ThemedText style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>{tab}</ThemedText>
              {activeTab === tab ? <View style={styles.tabIndicator} /> : null}
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'Modules' ? (
            <View style={styles.modulesList}>
              {formation.modules.map((module, index) => (
                <View key={module.title} style={styles.moduleRow}>
                  <View style={styles.moduleNumber}>
                    <ThemedText style={styles.moduleNumberText}>{index + 1}</ThemedText>
                  </View>
                  <ThemedText style={styles.moduleTitle}>{module.title}</ThemedText>
                  <ThemedText style={styles.moduleDuration}>{module.duration}</ThemedText>
                </View>
              ))}
            </View>
          ) : activeTab === 'Documents' ? (
            <View style={styles.modulesList}>
              {formation.documents.length ? (
                formation.documents.map((doc) => (
                  <TouchableOpacity key={doc.title} style={styles.documentRow} onPress={() => openDocument(doc.asset)}>
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
            <QuizView questions={formation.quiz} />
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
  moduleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6f8',
    borderRadius: 14,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    gap: Spacing.three,
  },
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
  video: { width: '100%', height: 220, borderRadius: 14, backgroundColor: '#000' },
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
