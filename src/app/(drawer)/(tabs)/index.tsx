import { Stack } from 'expo-router';
import { EventScreen } from '~/src/components/screen/event';

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ title: 'Event' }} />
      <EventScreen />
    </>
  );
}
