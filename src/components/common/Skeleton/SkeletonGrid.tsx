import { Dimensions, View } from 'react-native';
import { Skeleton } from '../../ui/Skeleton';

export const SkeletonGrid = () => {
  const windowWidth = Dimensions.get('window').width;
  const imageWidth = (windowWidth - 8) / 3; // Match the image component calculation
  const imageHeight = imageWidth * 1.35; // Match the portrait aspect ratio

  return (
    <View style={{ width: imageWidth, height: imageHeight, margin: 1 }}>
      <Skeleton className="h-full w-full rounded-md bg-muted shadow-none dark:bg-gray-500" />
    </View>
  );
};
