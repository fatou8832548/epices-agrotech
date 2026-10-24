import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { formations } from '@/constants/formations';
import { FORMATION_ACCESS_PRICE, getUnlockedFormations } from '@/utils/formation-access';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';

const FRUIT_ICONS: Record<string, string> = {
  Mangue: '🥭',
  Banane: '🍌',
  Orange: '🍊',
  Ananas: '🍍',
  Papaye: '🍈',
  Goyave: '🍑',
};

const CARD_COLORS: Record<string, { bg: string; soft: string; text: string }> = {
  Mangue: { bg: '#eefbf1', soft: '#dff3e4', text: '#1f7a3c' },
  Banane: { bg: '#fff9ea', soft: '#f9eab2', text: '#b58200' },
  Orange: { bg: '#fff3eb', soft: '#ffd9c3', text: '#d96d1f' },
  Ananas: { bg: '#f1fff2', soft: '#d9f4d8', text: '#2d8f39' },
  Papaye: { bg: '#fff4f0', soft: '#ffd5cc', text: '#ae4f34' },
  Goyave: { bg: '#fef3ff', soft: '#f2d8ff', text: '#9340c9' },
};

export default function FormationsScreen() {
  const router = useRouter();
  const [unlockedSlugs, setUnlockedSlugs] = useState<string[]>([]);

  useEffect(() => {
    getUnlockedFormations().then(setUnlockedSlugs);
  }, []);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <ThemedText style={styles.title}>Nos formations</ThemedText>
          <ThemedText style={styles.subtitle}>Choisissez une formation, puis votre mode de paiement. Accès après confirmation du paiement.</ThemedText>

          <View style={styles.grid}>
            {formations.map((formation) => {
              const accent = CARD_COLORS[formation.fruit] ?? { bg: '#f4f7f5', soft: '#e3eee6', text: '#1b8a2a' };
              const unlocked = unlockedSlugs.includes(formation.slug);

              return (
                <TouchableOpacity
                  key={formation.slug}
                  activeOpacity={0.88}
                  onPress={() => router.push(`/formations/${formation.slug}`)}
                  style={[styles.card, { backgroundColor: accent.bg, borderColor: accent.soft }]}
                >
                  <View style={[styles.emojiWrap, { backgroundColor: accent.soft }]}>
                    <ThemedText style={styles.emoji}>{FRUIT_ICONS[formation.fruit] ?? '🌿'}</ThemedText>
                  </View>

                  <ThemedText style={[styles.cardTitle, { color: accent.text }]}>{formation.subtitle}</ThemedText>
                  <ThemedText style={styles.cardMeta}>{formation.modules.length} modules</ThemedText>

                  <View style={[styles.inlineBadge, { backgroundColor: accent.soft }]}
                  >
                    <ThemedText style={[styles.inlineBadgeText, { color: accent.text }]}>
                      {unlocked ? 'Accès ouvert' : `${FORMATION_ACCESS_PRICE.toLocaleString('fr-FR')} FCFA`}
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    opacity: 0.75,
    marginBottom: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  card: {
    width: '48%',
    minHeight: 170,
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  emojiWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  emoji: {
    fontSize: 28,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
  },
  cardMeta: {
    fontSize: 12,
    opacity: 0.72,
    marginBottom: 10,
  },
  inlineBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  inlineBadgeText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
