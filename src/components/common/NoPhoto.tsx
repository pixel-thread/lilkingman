import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import colors from 'tailwindcss/colors';

type NoPhotoProps = {
  refetch: () => void;
  isLoading: boolean;
  title?: string;
  description?: string;
  icon?: keyof typeof Ionicons.glyphMap;
};
export const NoPhoto = ({
  refetch,
  isLoading,
  title = 'No Photo',
  description = 'There is no photo currently.',
  icon = 'images',
}: NoPhotoProps) => {
  return (
    <View className="flex-1 items-center justify-center space-y-6 bg-background p-6 pt-0">
      <View className="mb-2 items-center justify-center rounded-full bg-gray-100 p-6">
        <Ionicons name={icon} size={48} color={colors.black} />
      </View>
      <Text className="mb-2 text-2xl font-bold text-foreground">{title}</Text>
      <Text className="mb-4 text-center text-base leading-loose text-muted-foreground">
        {description}
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
