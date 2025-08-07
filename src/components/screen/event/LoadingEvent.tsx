import { FlatList, View, Dimensions, StatusBar } from 'react-native';
import { Skeleton } from '../../ui/Skeleton';
import { RefreshControl } from 'react-native-gesture-handler';
import { useEventContext } from '~/src/hooks/event/useEventContext';
import { Stack } from 'expo-router';

export const LoadingEvent = () => {
  const { refresh } = useEventContext();
  const windowWidth = Dimensions.get('window').width;
  const imageSize = windowWidth / 3 - 4; // 3 columns with small gap

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack.Screen
        options={{
          title: 'Event Gallery',
          headerTintColor: '#fff',
          headerShadowVisible: false,
        }}
      />

      {/* Loading Event Header */}
      <View className="bg-gray-900 px-4 pb-6 pt-4">
        <View className="mb-2 flex-row items-center justify-between">
          <View className="flex-1">
            <Skeleton className="mb-2 h-8 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/3 rounded-md" />
          </View>
          <Skeleton className="h-10 w-10 rounded-full" />
        </View>
      </View>

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
