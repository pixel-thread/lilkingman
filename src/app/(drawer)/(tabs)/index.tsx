import { Stack } from 'expo-router';
import { EventScreen } from '~/src/components/screen/event';
import { CustomHeader } from '~/src/components/common/CustomHeader';
import { CustomLoadingHeader } from '~/src/components/common/CustomLoadingHeader';
import { useEventContext } from '~/src/hooks/event/useEventContext';
import { EventRightHeader } from '~/src/components/screen/event/EventRightHeader';
import Constants from 'expo-constants';
import { Container } from '~/src/components/common/Container';

export default function Home() {
  const { event, isEventLoading } = useEventContext();
  const appName = Constants.expoConfig?.name || 'Lilkingman';
  return (
    <>
      <Stack.Screen
        options={{
          header: () =>
            isEventLoading ? (
              <CustomLoadingHeader />
            ) : (
              <CustomHeader
                rightHeader={<EventRightHeader />}
                title={event?.name || appName}
                showRightIcon
              />
            ),
        }}
      />
      <Container>
        <EventScreen />
      </Container>
    </>
  );
}
