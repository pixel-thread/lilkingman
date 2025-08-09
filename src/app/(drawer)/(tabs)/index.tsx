import { Stack } from 'expo-router';
import { EventScreen } from '~/src/components/screen/event';
import { CustomHeader } from '~/src/components/common/CustomHeader';
import { CustomLoadingHeader } from '~/src/components/common/CustomLoadingHeader';
import { useEventContext } from '~/src/hooks/event/useEventContext';
import { Container } from '~/src/components/common/Container';
import { EventRightHeader } from '~/src/components/screen/event/EventRightHeader';

export default function Home() {
  const { event, isEventLoading } = useEventContext();
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
                title={event?.name || 'Event Gallery'}
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
