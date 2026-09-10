import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { GhostButton } from '@/components/ui/ghost-button';
import { formations } from '@/constants/formations';
import { BottomTabInset, Spacing } from '@/constants/theme';
import {
    computeProjectTotals,
    formatAmount,
    PROJECTS_STORAGE_PREFIX,
    SavedProject,
    slugFromStorageKey,
} from '@/utils/projects-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { SymbolView, SymbolViewProps } from 'expo-symbols';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type MenuItem = {
  label: string;
  icon: SymbolViewProps['name'];
  danger?: boolean;
};

type SavedProjectEntry = {
  slug: string;
  productName: string;
  coutProduction: number;
  prixVenteRecommande: number;
  quantiteVendue?: string;
};

const MENU_ITEMS: MenuItem[] = [
  { label: 'Mes informations', icon: { ios: 'person.fill', android: 'person', web: 'user' } },
  { label: 'Notifications', icon: { ios: 'bell.fill', android: 'notifications', web: 'bell' } },
  { label: 'Sécurité', icon: { ios: 'lock.fill', android: 'lock', web: 'lock' } },
  { label: 'Aide et support', icon: { ios: 'questionmark.circle.fill', android: 'help', web: 'help-circle' } },
  { label: 'À propos', icon: { ios: 'info.circle.fill', android: 'info', web: 'info' } },
];

export default function ProfilScreen() {
  const router = useRouter();
  const [savedProjects, setSavedProjects] = useState<SavedProjectEntry[]>([]);

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      (async () => {
        try {
          const allKeys = await AsyncStorage.getAllKeys();
          const projectKeys = allKeys.filter((k) => k.startsWith(PROJECTS_STORAGE_PREFIX));
          const entries = await AsyncStorage.multiGet(projectKeys);
          const parsed: SavedProjectEntry[] = entries
            .map(([key, raw]) => {
              if (!raw) return null;
              const slug = slugFromStorageKey(key);
              const project = JSON.parse(raw) as SavedProject;
              const totals = computeProjectTotals(project);
              const formation = formations.find((f) => f.slug === slug);
              return {
                slug,
                productName: formation?.subtitle ?? slug,
                coutProduction: totals.coutProduction,
                prixVenteRecommande: totals.prixVenteRecommande,
                quantiteVendue: project.quantiteVendue,
              };
            })
            .filter((entry): entry is SavedProjectEntry => entry !== null);
          if (!cancelled) setSavedProjects(parsed);
        } catch {
          if (!cancelled) setSavedProjects([]);
        }
      })();
      return () => {
        cancelled = true;
      };
    }, [])
  );

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText style={styles.title}>Profil</ThemedText>

        <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.headerCard}>
            <View style={styles.avatar}>
              <SymbolView tintColor="#1b8a2a" name={{ ios: 'person.fill', android: 'person', web: 'user' }} size={36} />
            </View>
            <ThemedText style={styles.name}>Utilisateur</ThemedText>
            <ThemedText style={styles.email}>Non connecté</ThemedText>
            <GhostButton title="Se connecter" onPress={() => router.push('/login')} style={styles.loginButton} />
          </View>

          <ThemedText style={styles.sectionTitle}>Mes projets enregistrés</ThemedText>
          {savedProjects.length ? (
            <View style={styles.projectsList}>
              {savedProjects.map((project) => (
                <View key={project.slug} style={styles.projectRow}>
                  <View style={styles.projectIcon}>
                    <SymbolView tintColor="#1b8a2a" name={{ ios: 'chart.bar.fill', android: 'bar_chart', web: 'bar-chart' }} size={18} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <ThemedText style={styles.projectName}>{project.productName}</ThemedText>
                    <ThemedText style={styles.projectMeta}>
                      Coût: {formatAmount(project.coutProduction)} · Prix de vente: {formatAmount(project.prixVenteRecommande)}
                    </ThemedText>
                    {project.quantiteVendue ? (
                      <ThemedText style={styles.projectMeta}>Quantité vendue: {project.quantiteVendue}</ThemedText>
                    ) : null}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <ThemedText style={styles.emptyProjectsText}>
              Aucun coût enregistré pour l'instant. Va dans Mes projets pour en sauvegarder.
            </ThemedText>
          )}

          <View style={styles.menuList}>
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity key={item.label} style={styles.menuRow} activeOpacity={0.7} onPress={() => {}}>
                <View style={styles.menuIcon}>
                  <SymbolView tintColor="#1b8a2a" name={item.icon} size={18} />
                </View>
                <ThemedText style={styles.menuLabel}>{item.label}</ThemedText>
                <SymbolView tintColor="#999" name={{ ios: 'chevron.right', android: 'chevron_right', web: 'chevron-right' }} size={16} />
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.logoutRow} activeOpacity={0.7} onPress={() => {}}>
            <SymbolView tintColor="#c0392b" name={{ ios: 'rectangle.portrait.and.arrow.right', android: 'logout', web: 'log-out' }} size={18} />
            <ThemedText style={styles.logoutLabel}>Se déconnecter</ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  safeArea: { flex: 1, width: '100%', paddingHorizontal: Spacing.four, paddingBottom: BottomTabInset },
  title: { marginTop: Spacing.two, fontSize: 24, fontWeight: '700', color: '#1b8a2a' },
  scrollContent: { paddingTop: Spacing.four, paddingBottom: 120 },
  headerCard: {
    alignItems: 'center',
    backgroundColor: '#f1f7ef',
    borderRadius: 16,
    padding: Spacing.four,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#e6f4ea',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  name: { marginTop: Spacing.two, fontSize: 18, fontWeight: '700', color: '#111' },
  email: { marginTop: 2, fontSize: 13, color: '#666' },
  loginButton: { marginTop: Spacing.three },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginTop: Spacing.four, marginBottom: Spacing.two },
  projectsList: { gap: Spacing.two },
  projectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6f8',
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.three,
  },
  projectIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e6f4ea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  projectName: { fontSize: 15, fontWeight: '600', color: '#111' },
  projectMeta: { fontSize: 12, color: '#666', marginTop: 2 },
  emptyProjectsText: { color: '#666', fontSize: 13 },
  menuList: { marginTop: Spacing.four },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f6f8',
    borderRadius: 12,
    padding: Spacing.three,
    marginBottom: Spacing.two,
    gap: Spacing.three,
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e6f4ea',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#111' },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.two,
    marginTop: Spacing.four,
    padding: Spacing.three,
  },
  logoutLabel: { fontSize: 15, fontWeight: '700', color: '#c0392b' },
});

