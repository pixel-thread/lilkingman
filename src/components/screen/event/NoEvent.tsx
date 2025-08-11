import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useEventContext } from '~/src/hooks/event/useEventContext';
import { Text } from '../../ui/Text';
import { Button } from '../../ui/Button';
import { Ternary } from '../../common/Ternary';

export const NoEvent = () => {
  const { refresh, isEventLoading } = useEventContext();

  return (
    <View
      className="flex-1 items-center justify-center space-y-6 bg-background p-6"
      style={{ paddingTop: 0 }}>
      <View className="mb-2 items-center justify-center rounded-full bg-gray-100 p-6">
        <Ionicons name="calendar-outline" size={48} color="#6b7280" />
      </View>
      <Text className="mb-2 text-2xl font-medium text-foreground">No Active Event</Text>
      <Text className="mb-4 text-center text-base text-muted-foreground">
        The event hasn&apos;t started yet or has already ended.
      </Text>
      <Text className="mb-4 text-center text-base text-muted-foreground">
        You can scan the QR code to join the event.
      </Text>
      <View className="w-full gap-y-3">
        <Button
          disabled={isEventLoading}
          variant="secondary"
          onPress={refresh}
          className="h-16 w-full flex-row gap-x-2 rounded-full">
          <Ionicons name="refresh-outline" size={20} color="#6b7280" className="mr-2" />
          <Ternary
            condition={isEventLoading}
            trueComponent={<Text className="text-muted-foreground">Checking</Text>}
            falseComponent={<Text className="text-muted-foreground">Check Again</Text>}
          />
        </Button>
      </View>
    </View>
  );
};
