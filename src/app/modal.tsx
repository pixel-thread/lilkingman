import { Stack } from 'expo-router';
import { GalleryScreen } from '../components/screen/gallery';

export default function Modal() {
  return (
    <>
      <Stack.Screen options={{ title: 'Modal', headerShown: true }} />
      <GalleryScreen />
    </>
  );
}
