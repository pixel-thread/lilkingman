import { Stack } from 'expo-router';
import { EventScreen } from '~/src/components/screen/event';
import { CustomHeader } from '~/src/components/common/CustomHeader';
import { CustomLoadingHeader } from '~/src/components/common/CustomLoadingHeader';
import { useEventContext } from '~/src/hooks/event/useEventContext';

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
                showBackButton
                title={event?.name || 'Event Gallery'}
                showRightIcon={!!event}
                rightIconName="camera-outline"
                rightIconType="Ionicons"
                onRightIconPress={() => {
                  // Add camera/upload functionality
                  console.log('Camera button pressed');
                }}
              />
            ),
        }}
      />
      <EventScreen />
    </>
  );
}
