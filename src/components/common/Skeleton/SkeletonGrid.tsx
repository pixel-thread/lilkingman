import { Dimensions, View } from 'react-native';
import { Skeleton } from '../../ui/Skeleton';

export const SkeletonGrid = () => {
  const windowWidth = Dimensions.get('window').width;
  const imageSize = windowWidth / 3 - 4;

  return (
    <View style={{ width: imageSize, height: imageSize, margin: 2 }}>
      <Skeleton className="h-full w-full rounded-md bg-muted shadow-none dark:bg-gray-500" />
    </View>
  );
};
