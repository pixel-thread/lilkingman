import { Stack } from 'expo-router';
import { Container } from '~/src/components/common/Container';
import { InviteScreen } from '~/src/components/screen/invite';

export default function Invite() {
  return (
    <>
      <Stack.Screen options={{ title: 'Invite Friends', headerShown: true }} />
      <Container>
        <InviteScreen />
      </Container>
    </>
  );
}
