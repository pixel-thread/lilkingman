import { useState, useRef } from 'react';
import { View, FlatList, RefreshControl, Animated } from 'react-native';
import { ImageViewerModal } from '@components/common/ImageViewerModal';
import { RenderImageItem } from '@components/common/RenderImageItems';
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';
import http from '~/src/utils/http';
import { PHOTOS_ENDPOINT } from '~/src/lib/constants/endpoints/photo';

type ImageT = {
  id: string;
  userId: string | null;
  path: string;
  eventId: string;
  caption?: string;
  likes?: number;
  timestamp?: string;
};

export const PhotoScreen = () => {
  const { user } = useAuthContext();
  const [selectedImage, setSelectedImage] = useState<ImageT | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const { data, refetch, isLoading } = useQuery({
    queryKey: ['my-photos', user?.id],
    queryFn: () =>
      http.get<ImageT[]>(PHOTOS_ENDPOINT.GET_USERS_PHOTOS.replace(':id', user?.id ?? '')),
    select: (data) => data.data,
    enabled: !!user?.id,
  });

  const handleImagePress = (image: ImageT) => {
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

  const onRefresh = () => refetch();

  return (
    <View className="flex-1 bg-background">
      {/* Photo Grid */}
      <FlatList
        data={data}
        renderItem={({ item, index }) => (
          <RenderImageItem item={item} index={index} imagePress={handleImagePress} />
        )}
        keyExtractor={(item) => item.id}
        numColumns={3}
        className="flex-1"
        contentContainerClassName="items-start"
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} />}
        showsVerticalScrollIndicator={false}
      />

      {/* Custom Image Viewer Modal with Download Button */}
      <ImageViewerModal
        image={selectedImage}
        onClose={closeModal}
        visible={modalVisible}
        fade={fadeAnim}
        scale={scaleAnim}
      />
    </View>
  );
};
