import { Stack } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Image,
  RefreshControl,
  Modal,
  TouchableOpacity,
  Dimensions,
  FlatList,
} from 'react-native';
import { Skeleton } from '~/src/components/ui/Skeleton';
import { H1, P } from '~/src/components/ui/Typography';
import { Text } from '~/src/components/ui/Text';
import { useEventContext } from '~/src/hooks/event/useEventContext';

// Define image type
type ImageItem = {
  id: string;
  url: string;
  title: string;
};

const mockImages: ImageItem[] = Array.from({ length: 10 }, (_, index) => ({
  id: `${index + 1}`,
  url: `https://picsum.photos/200/300`,
  title: `Image ${index + 1}`,
}));

export const EventScreen = () => {
  const { event, isEventLoading, refresh } = useEventContext();
  const [selectedImage, setSelectedImage] = useState<ImageItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const windowWidth = Dimensions.get('window').width;
  const imageSize = windowWidth / 3 - 7; // 3 images per row with small gap

  const handleImagePress = (image: ImageItem) => {
    setSelectedImage(image);
    setModalVisible(true);
  };

  const renderImageItem = ({ item }: { item: ImageItem }) => (
    <TouchableOpacity
      onPress={() => handleImagePress(item)}
      className="m-0.5 border border-red-500"
      activeOpacity={0.8}>
      <Image
        source={{ uri: item.url }}
        className="rounded-md"
        style={{ width: imageSize, height: imageSize }}
      />
    </TouchableOpacity>
  );

  return (
    <>
      <Stack.Screen options={{ title: event?.name || 'Event Gallery' }} />

      <View className="flex-1 bg-background">
        {/* Image Gallery with Loading Skeleton */}
        {isEventLoading ? (
          <View className="flex-1 p-0.5">
            <View className="flex-row flex-wrap">
              {Array.from({ length: 12 }).map((_, index) => (
                <View key={index} className="m-0.5" style={{ width: imageSize, height: imageSize }}>
                  <Skeleton className="h-full w-full rounded-md" />
                </View>
              ))}
            </View>
          </View>
        ) : (
          <FlatList
            data={mockImages}
            renderItem={renderImageItem}
            keyExtractor={(item) => item.id}
            numColumns={3}
            className="flex-1"
            contentContainerClassName="p-0.5"
            refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} />}
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center p-10">
                <Text className="text-center text-muted-foreground">No images found</Text>
              </View>
            }
          />
        )}

        {/* Image Viewer Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}>
          <TouchableOpacity
            className="flex-1 items-center justify-center bg-black/90"
            activeOpacity={1}
            onPress={() => setModalVisible(false)}>
            <View className="w-full items-center">
              {selectedImage && (
                <>
                  <Image
                    source={{ uri: selectedImage.url }}
                    className="aspect-square w-full"
                    resizeMode="contain"
                  />
                  <View className="absolute bottom-10 rounded-full bg-black/50 px-4 py-2">
                    <Text className="font-medium text-white">{selectedImage.title}</Text>
                  </View>
                </>
              )}
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </>
  );
};
