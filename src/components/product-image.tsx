import { fetchUnsplashImage } from '@/utils/unsplash';
import { Image as ExpoImage } from 'expo-image';
import { SymbolView, SymbolViewProps } from 'expo-symbols';
import { useEffect, useState } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

type ProductImageProps = {
  photo?: number;
  query: string;
  icon: SymbolViewProps['name'];
  iconSize: number;
  iconColor?: string;
  style?: ViewStyle;
};

export function ProductImage({ photo, query, icon, iconSize, iconColor = '#1b8a2a', style }: ProductImageProps) {
  const [remoteUrl, setRemoteUrl] = useState<string | null>(null);

  useEffect(() => {
    if (photo) return;
    let cancelled = false;
    fetchUnsplashImage(query).then((url) => {
      if (!cancelled) setRemoteUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [photo, query]);

  const source = photo ?? remoteUrl;

  return (
    <View style={[styles.container, style]}>
      {source ? (
        <ExpoImage source={source} style={styles.image} contentFit="cover" />
      ) : (
        <SymbolView tintColor={iconColor} name={icon} size={iconSize} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  image: { width: '100%', height: '100%' },
});
