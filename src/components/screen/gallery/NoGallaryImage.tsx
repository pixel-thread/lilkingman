import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../../ui/Text';
import { Button } from '../../ui/Button';

export const NoGallaryImage = ({
  refetch,
  isLoading,
}: {
  refetch: () => void;
  isLoading: boolean;
}) => {
  return (
    <View
      className="flex-1 items-center justify-center space-y-6 bg-background p-6"
      style={{ paddingTop: 0 }}>
      <View className="mb-2 items-center justify-center rounded-full bg-gray-100 p-6">
        <Ionicons name="images" size={48} color="#6b7280" />
      </View>
      <Text className="mb-2 text-2xl font-medium text-foreground">No Photo</Text>
      <Text className="mb-4 text-center text-base text-muted-foreground">
        There is no photo currently.
      </Text>
      <View className="w-full gap-y-3">
        <Button
          variant="secondary"
          disabled={isLoading}
          onPress={refetch}
          className="h-16 w-full flex-row gap-x-2 rounded-full">
          <Ionicons name="refresh-outline" size={20} color="#6b7280" className="mr-2" />
          <Text className="text-muted-foreground">{isLoading ? 'Refreshing...' : 'Refresh'}</Text>
        </Button>
      </View>
    </View>
  );
};
