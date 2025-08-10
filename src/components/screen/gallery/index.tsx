import { useState, useRef } from 'react';
import { View, RefreshControl, FlatList, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '~/src/components/ui/Text';
import { Ternary } from '../../common/Ternary';
import { useQuery } from '@tanstack/react-query';
import http from '~/src/utils/http';
import { ImageViewerModal } from '../../common/ImageViewerModal';
import { RenderImageItem } from '../../common/RenderImageItems';
import { LoadingGallery } from './LoadingEvent';
import { ImageI } from '~/src/types/Image';
import { PHOTOS_ENDPOINT } from '~/src/lib/constants/endpoints/photo';

export const GalleryScreen = () => {
  const [selectedImage, setSelectedImage] = useState<ImageI | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const {
    data,
    refetch: refetchImages,
    isLoading: isImagesLoading,
  } = useQuery({
    queryKey: ['featured images'],
    queryFn: () => http.get<ImageI[]>(PHOTOS_ENDPOINT.GET_FEATURED_PHOTO),
    select: (data) => data.data,
  });

  const handleImagePress = (image: ImageI) => {
    setSelectedImage(image);
    setModalVisible(true);

    // Animate the modal opening
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeModal = () => {
    // Animate the modal closing
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.9,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setModalVisible(false);
      setSelectedImage(null);
      // Reset animation values
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.9);
    });
  };

  if (isImagesLoading) {
    return <LoadingGallery />;
  }

  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isImagesLoading} onRefresh={refetchImages} />}
        className="flex-1 bg-background">
        <Ternary
          // condition={data?.length === 0 && !isImagesLoading}
          condition={false}
          trueComponent={
            <View className="flex-1 items-center justify-center p-10">
              <View className="mb-4 items-center justify-center rounded-full bg-gray-100 p-4">
                <Ionicons name="images-outline" size={32} color="#6b7280" />
              </View>
              <Text className="mb-2 text-lg font-medium text-foreground">No Photos Yet</Text>
              <Text className="text-center text-muted-foreground">
                Be the first to capture moments from this event
              </Text>
            </View>
          }
          falseComponent={
            <FlatList
              data={data || []}
              renderItem={({ item, index }) => (
                <RenderImageItem
                  imagePress={(image) => handleImagePress(image)}
                  item={item}
                  index={index}
                />
              )}
              keyExtractor={(item) => item.id}
              numColumns={3}
              className="flex-1"
              contentContainerClassName="items-start"
              refreshControl={<RefreshControl refreshing={false} onRefresh={refetchImages} />}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false} // Disable scroll since parent ScrollView handles it
            />
          }
        />
      </ScrollView>

      {/* Enhanced Image Viewer Modal */}
      <ImageViewerModal
        image={selectedImage}
        onClose={closeModal}
        visible={modalVisible}
        fade={fadeAnim}
        scale={scaleAnim}
      />
    </>
  );
};
