import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { PrimaryButton } from '@/components/ui/primary-button';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export default function RegisterScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = () => {
    if (fullName.trim().length < 2) {
      setError('Veuillez saisir votre nom complet.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Veuillez saisir un email valide.');
      return;
    }
    if (password.length < 4) {
      setError('Le mot de passe doit contenir au moins 4 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.');
      return;
    }
    setError('');
    setLoading(true);
    // No auth backend yet: simulate a successful registration and return to the app.
    setTimeout(() => {
      setLoading(false);
      router.replace('/home');
    }, 600);
  };

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
          <ThemedText style={styles.headerTitle}>Créer un compte</ThemedText>
        </View>

        <KeyboardAvoidingView style={{ flex: 1, width: '100%' }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <ThemedText style={styles.subtitle}>Créez votre compte pour commencer à apprendre et transformer</ThemedText>

            <View style={styles.field}>
              <ThemedText style={styles.fieldLabel}>Nom complet</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Votre nom"
                placeholderTextColor="#999"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>

            <View style={[styles.field, { marginTop: Spacing.three }]}>
              <ThemedText style={styles.fieldLabel}>Email</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="vous@exemple.com"
                placeholderTextColor="#999"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View style={[styles.field, { marginTop: Spacing.three }]}>
              <ThemedText style={styles.fieldLabel}>Mot de passe</ThemedText>
              <View style={styles.passwordRow}>
                <TextInput
                  style={styles.passwordInput}
                  placeholder="••••••••"
                  placeholderTextColor="#999"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword((v) => !v)} accessibilityLabel="Afficher le mot de passe">
                  <SymbolView
                    tintColor="#666"
                    name={{ ios: showPassword ? 'eye.slash.fill' : 'eye.fill', android: showPassword ? 'visibility_off' : 'visibility', web: showPassword ? 'eye-off' : 'eye' }}
                    size={18}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.field, { marginTop: Spacing.three }]}>
              <ThemedText style={styles.fieldLabel}>Confirmer le mot de passe</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#999"
                secureTextEntry={!showPassword}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {error ? <ThemedText style={styles.errorText}>{error}</ThemedText> : null}

            <PrimaryButton title="Créer un compte" onPress={handleRegister} disabled={loading} style={styles.registerButton} />

            <TouchableOpacity style={styles.loginLink} onPress={() => router.replace('/login')}>
              <ThemedText style={styles.loginText}>Déjà un compte ? Se connecter</ThemedText>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#ffffff' },
  safeArea: { flex: 1, width: '100%', paddingHorizontal: Spacing.four, paddingBottom: BottomTabInset },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.two },
  backButton: { padding: Spacing.one, marginRight: Spacing.one },
  headerTitle: { color: '#1b8a2a', fontSize: 20, fontWeight: '700' },
  scrollContent: { paddingBottom: 120 },
  subtitle: { marginTop: Spacing.three, color: '#666' },
  field: { marginTop: Spacing.four },
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
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
  },
  passwordInput: { flex: 1, paddingVertical: Spacing.two, fontSize: 15, color: '#111' },
  errorText: { marginTop: Spacing.three, color: '#c0392b', fontSize: 13 },
  registerButton: { marginTop: Spacing.four },
  loginLink: { marginTop: Spacing.three, alignItems: 'center' },
  loginText: { fontSize: 14, color: '#666' },
});
