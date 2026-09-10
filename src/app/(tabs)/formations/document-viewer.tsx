import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

export default function DocumentViewerScreen() {
  const router = useRouter();
  const { uri, title } = useLocalSearchParams<{ uri: string; title?: string }>();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={() => router.back()} accessibilityLabel="Retour" style={styles.backButton}>
            <SymbolView tintColor="#1b8a2a" name={{ ios: 'chevron.left', android: 'arrow_back', web: 'chevron-left' }} size={20} />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle} numberOfLines={1}>
            {title || 'Document'}
          </ThemedText>
        </View>

        {uri ? (
          <WebView
            style={styles.webview}
            source={{ uri }}
            originWhitelist={['*']}
            allowFileAccess
            allowUniversalAccessFromFileURLs
            allowingReadAccessToURL={uri}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.loadingOverlay}>
                <ActivityIndicator color="#1b8a2a" size="large" />
              </View>
            )}
          />
        ) : (
          <ThemedText style={styles.emptyText}>Document introuvable.</ThemedText>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  safeArea: { flex: 1, width: '100%', paddingHorizontal: Spacing.four, paddingBottom: BottomTabInset },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.two, marginBottom: Spacing.two },
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
  headerTitle: { flex: 1, color: '#1b8a2a', fontSize: 18, fontWeight: '700' },
  webview: { flex: 1, width: '100%' },
  loadingOverlay: { ...StyleSheet.absoluteFillObject, alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' },
  emptyText: { color: '#666', textAlign: 'center', marginTop: Spacing.four },
});
