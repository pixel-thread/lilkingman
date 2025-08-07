import { useState, useRef } from 'react';
import {
  View,
  RefreshControl,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '~/src/components/ui/Text';
import { useEventContext } from '~/src/hooks/event/useEventContext';
import { Ternary } from '../../common/Ternary';
import { useQuery } from '@tanstack/react-query';
import http from '~/src/utils/http';
import { NoEvent } from './NoEvent';
import { LoadingEvent } from './LoadingEvent';
import { ImageViewerModal } from './ImageViewerModal';
import { RenderImageItem } from './ImageItems';
import { EventHeader } from './EventHeader';

type ImageT = {
  id: string;
  userId: string | null;
  path: string;
  eventId: string;
  caption?: string;
  likes?: number;
  timestamp?: string;
};

// Mock data for testing
const mockImages2: ImageT[] = [
  {
    id: '1',
    userId: 'user1',
    path: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    eventId: '123',
    caption: 'Amazing concert!',
    likes: 42,
    timestamp: '2 hours ago',
  },
  {
    id: '2',
    userId: 'user2',
    path: 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    eventId: '123',
    caption: 'Great vibes!',
    likes: 38,
    timestamp: '3 hours ago',
  },
  {
    id: '3',
    userId: 'user1',
    path: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    eventId: '123',
    caption: 'Epic performance',
    likes: 56,
    timestamp: '4 hours ago',
  },
  {
    id: '4',
    userId: 'user3',
    path: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    eventId: '123',
    caption: 'Unforgettable night',
    likes: 72,
    timestamp: '5 hours ago',
  },
  {
    id: '5',
    userId: 'user2',
    path: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    eventId: '123',
    caption: 'Best night ever!',
    likes: 63,
    timestamp: '6 hours ago',
  },
  {
    id: '6',
    userId: 'user4',
    path: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    eventId: '123',
    caption: 'Dancing all night',
    likes: 49,
    timestamp: '7 hours ago',
  },
];

const captions = [
  'Amazing concert!',
  'Great vibes!',
  'Epic performance',
  'Unforgettable night',
  'Best night ever!',
  'Dancing all night',
  'Crowd was wild',
  'Loved every second',
  'What a show!',
];

const users = ['user1', 'user2', 'user3', 'user4'];

const mockImages: ImageT[] = Array.from({ length: 20 }, (_, i) => {
  const id = (i + 1).toString();
  const userId = users[i % users.length];
  const caption = captions[i % captions.length];
  const likes = Math.floor(Math.random() * 100) + 1;
  const timestamp = `${i + 1} hour${i + 1 > 1 ? 's' : ''} ago`;
  // const path = `https://source.unsplash.com/random/800x600?sig=${i}`;
  const path = `https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=${i}`;
  return {
    id,
    userId,
    eventId: '123',
    path,
    caption,
    likes,
    timestamp,
  };
});

export const EventScreen = () => {
  const { event, isEventLoading, refresh } = useEventContext();
  const [selectedImage, setSelectedImage] = useState<ImageT | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const {
    data,
    refetch: refetchImages,
    isLoading: isImagesLoading,
  } = useQuery({
    queryKey: ['event', event?.id],
    queryFn: () => http.get<ImageT[]>(`/photo/event/${event?.id}`),
    select: (data) => data.data,
    enabled: !!event?.id,
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

  if (isEventLoading) {
    return <LoadingEvent />;
  }

  if (!event) {
    return <NoEvent />;
  }

  return (
    <>
      <ScrollView
        refreshControl={<RefreshControl refreshing={isImagesLoading} onRefresh={refresh} />}
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
              data={mockImages}
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
