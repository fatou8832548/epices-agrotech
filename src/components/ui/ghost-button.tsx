
import { ThemedText } from '@/components/themed-text';
import { SymbolView, SymbolViewProps } from 'expo-symbols';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

type Props = {
  title: string;
  onPress?: () => void;
  style?: ViewStyle | any;
  icon?: SymbolViewProps['name'];
};

export function GhostButton({ title, onPress, style, icon }: Props) {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress} activeOpacity={0.85}>
      {icon ? <SymbolView tintColor="#1b8a2a" name={icon} size={18} style={styles.icon} /> : null}
      <ThemedText type="smallBold" style={styles.text}>
        {title}
      </ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    borderColor: '#1b8a2a',
    borderWidth: 2,
    height: 44,
    justifyContent: 'center',
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  icon: {
    marginRight: 8,
  },
  text: {
    color: '#1b8a2a',
    fontSize: 18,
  },
});
