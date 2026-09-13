import { Stack } from 'expo-router';

export default function HomeStackLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="start" />
      <Stack.Screen name="result" />
      <Stack.Screen name="products" />
      <Stack.Screen name="product-detail" />
    </Stack>
  );
}
