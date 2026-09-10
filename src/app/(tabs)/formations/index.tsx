import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { formations } from '@/constants/formations';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function groupByFruit(items: typeof formations) {
  const groups: { fruit: string; items: typeof formations }[] = [];
  for (const formation of items) {
    const group = groups.find((g) => g.fruit === formation.fruit);
    if (group) {
      group.items.push(formation);
    } else {
      groups.push({ fruit: formation.fruit, items: [formation] });
    }
  }
  return groups;
}

export default function FormationsScreen() {
  const router = useRouter();
  const fruitGroups = groupByFruit(formations);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText style={styles.title}>Formations</ThemedText>
        <ThemedText style={styles.subtitle}>Choisissez une formation pour commencer à apprendre</ThemedText>

        <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {fruitGroups.map((group) => (
            <View key={group.fruit} style={styles.fruitSection}>
              <View style={styles.fruitHeader}>
                <View style={styles.fruitIcon}>
                  <SymbolView tintColor="#1b8a2a" name={{ ios: 'leaf.fill', android: 'eco', web: 'leaf' }} size={20} />
                </View>
                <ThemedText style={styles.fruitTitle}>{group.fruit}</ThemedText>
                <ThemedText style={styles.fruitMeta}>{group.items.length} modules</ThemedText>
              </View>

              {group.items.map((formation) => (
                <TouchableOpacity
                  key={formation.slug}
                  style={styles.card}
                  activeOpacity={0.85}
                  onPress={() => router.push(`/formations/${formation.slug}`)}
                >
                  <View style={styles.cardIcon}>
                    <SymbolView tintColor="#1b8a2a" name={{ ios: 'book.fill', android: 'menu_book', web: 'book' }} size={22} />
                  </View>
                  <View style={styles.cardTextColumn}>
                    <ThemedText style={styles.cardSubtitle}>{formation.subtitle}</ThemedText>
                    <ThemedText style={styles.cardMeta}>{formation.modules.length} leçons</ThemedText>
                  </View>
                  <SymbolView tintColor="#999" name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron-right' }} size={18} />
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  safeArea: { flex: 1, width: '100%', paddingHorizontal: Spacing.four, paddingBottom: BottomTabInset },
  title: { marginTop: Spacing.two, fontSize: 24, fontWeight: '700', color: '#1b8a2a' },
  subtitle: { marginTop: Spacing.one, color: '#666' },
  scrollContent: { paddingTop: Spacing.four, paddingBottom: 120 },
  fruitSection: { marginBottom: Spacing.four },
  fruitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  fruitIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e6f4ea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fruitTitle: { flex: 1, fontSize: 18, fontWeight: '700', color: '#111' },
  fruitMeta: { fontSize: 13, color: '#666' },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6f8',
    borderRadius: 14,
    padding: Spacing.three,
    marginBottom: Spacing.three,
    gap: Spacing.three,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e6f4ea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextColumn: { flex: 1 },
  cardSubtitle: { fontSize: 16, fontWeight: '700', color: '#111' },
  cardMeta: { marginTop: 2, fontSize: 13, color: '#666' },
});
