import { FlatList } from 'react-native';
import { SkeletonGrid } from './SkeletonGrid';

export const LoadingImages = () => {
  return (
    <FlatList
      data={Array.from({ length: 10 })}
      renderItem={({ index }) => <SkeletonGrid key={index} />}
      numColumns={3}
      className="flex-1 bg-background pt-4"
      contentContainerClassName="items-start"
      showsVerticalScrollIndicator={false}
    />
  );
};
