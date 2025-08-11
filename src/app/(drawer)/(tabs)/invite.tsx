import { Stack } from 'expo-router';
import { InviteScreen } from '~/src/components/screen/invite';

export default function Invite() {
  return (
    <>
      <Stack.Screen options={{ title: 'Invite Friends', headerShown: true }} />
      <InviteScreen />
    </>
  );
}
