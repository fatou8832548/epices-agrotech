import { formations } from '@/constants/formations';
import { Redirect } from 'expo-router';

export default function FormationsScreen() {
  return <Redirect href={`/formations/${formations[0].slug}`} />;
}
