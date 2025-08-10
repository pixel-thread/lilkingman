import { FlatList, View, Dimensions } from 'react-native';
import { Skeleton } from '../../ui/Skeleton';
import { RefreshControl } from 'react-native-gesture-handler';
import { useEventContext } from '~/src/hooks/event/useEventContext';
import { EventHeader } from './EventHeader';

export const LoadingEvent = () => {
  const { refresh } = useEventContext();
  const windowWidth = Dimensions.get('window').width;
  const imageSize = windowWidth / 3 - 4; // 3 columns with small gap

  return (
    <>
      <FlatList
        data={Array.from({ length: 24 })}
        renderItem={({ index }) => (
          <View
            className="m-1 overflow-hidden rounded-xl"
            style={{ width: imageSize, height: imageSize }}>
            <Skeleton className="h-full w-full rounded-xl" />
          </View>
        )}
        numColumns={3}
        className="flex-1 bg-background"
        contentContainerClassName="p-1"
        refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} />}
        ListHeaderComponent={<View className="h-2" />}
      />
    </>
  );
};
