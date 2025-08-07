import { Stack } from 'expo-router';
import { useState, useRef, useEffect } from 'react';
import {
  View,
  Image,
  RefreshControl,
  Modal,
  TouchableOpacity,
  Dimensions,
  FlatList,
  ScrollView,
  Animated,
  StatusBar,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Skeleton } from '~/src/components/ui/Skeleton';
import { Text } from '~/src/components/ui/Text';
import { useEventContext } from '~/src/hooks/event/useEventContext';
import { Ternary } from '../../common/Ternary';
import { useQuery } from '@tanstack/react-query';
import http from '~/src/utils/http';
import { NoEvent } from './NoEvent';
import { LoadingEvent } from './LoadingEvent';

type ImageT = {
  id: string;
  userId: string | null;
  path: string;
  eventId: string;
  caption?: string;
  likes?: number;
  timestamp?: string;
};

export const EventScreen = () => {
  const { event, isEventLoading, refresh } = useEventContext();
  const [selectedImage, setSelectedImage] = useState<ImageT | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  const windowWidth = Dimensions.get('window').width;
  const imageSize = windowWidth / 3 - 4; // 3 columns with small gap

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
    setImageLoading(true);
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

  const RenderImageItem = ({ item, index }: { item: ImageT; index: number }) => {
    const [isLoading, setIsLoading] = useState(true);

    // Add a slight staggered animation effect
    const itemAnimValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.timing(itemAnimValue, {
        toValue: 1,
        duration: 400,
        delay: index * 50, // Stagger the animations
        useNativeDriver: true,
      }).start();
    }, []);

    return (
      <Animated.View
        style={{
          opacity: itemAnimValue,
          transform: [
            { scale: itemAnimValue.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) },
          ],
        }}>
        <TouchableOpacity
          onPress={() => handleImagePress(item)}
          className="m-1 overflow-hidden rounded-xl bg-muted"
          activeOpacity={0.9}>
          <View>
            {isLoading && (
              <View
                style={{ width: imageSize, height: imageSize }}
                className="items-center justify-center">
                <Skeleton className="absolute h-full w-full rounded-xl" />
              </View>
            )}
            <Image
              onLoadStart={() => setIsLoading(true)}
              onLoadEnd={() => setIsLoading(false)}
              source={{ uri: item.path || '../../../assets/splash.png' }}
              style={{ width: imageSize, height: imageSize }}
              className="rounded-xl"
              resizeMode="cover"
            />
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  // Mock data for testing
  const mockImages: ImageT[] = [
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

  if (isEventLoading) {
    return <LoadingEvent />;
  }

  if (!event) {
    return <NoEvent />;
  }

  return (
    <>
      <StatusBar barStyle="light-content" />
      <Stack.Screen
        options={{
          title: event?.name || 'Event Gallery',
          headerStyle: { backgroundColor: '#111827' },
          headerTintColor: '#fff',
          headerShadowVisible: false,
        }}
      />

      {/* Event Header */}
      <View className="bg-gray-900 px-4 pb-6 pt-4">
        <View className="mb-2 flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="mb-1 text-2xl font-bold text-white">
              {event?.name || 'Event Gallery'}
            </Text>
            <Text className="text-gray-400">
              {event?.date ? new Date(event.date).toLocaleDateString() : 'Today'}
            </Text>
          </View>
          <TouchableOpacity
            className="rounded-full bg-gray-800 p-2"
            onPress={() => {
              /* Add camera/upload functionality */
            }}>
            <Ionicons name="camera-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>

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
              data={mockImages} // Use mock data for testing
              renderItem={({ item, index }) => <RenderImageItem item={item} index={index} />}
              keyExtractor={(item) => item.id}
              numColumns={3}
              className="flex-1"
              contentContainerClassName="p-1"
              refreshControl={<RefreshControl refreshing={false} onRefresh={refetchImages} />}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false} // Disable scroll since parent ScrollView handles it
            />
          }
        />
      </ScrollView>

      {/* Enhanced Image Viewer Modal */}
      <Modal transparent={true} visible={modalVisible} onRequestClose={closeModal}>
        <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill}>
          <Animated.View
            style={[
              StyleSheet.absoluteFill,
              {
                opacity: fadeAnim,
                backgroundColor: 'rgba(0,0,0,0.9)',
              },
            ]}
          />

          <TouchableOpacity style={StyleSheet.absoluteFill} activeOpacity={1} onPress={closeModal}>
            {selectedImage && (
              <Animated.View
                className="flex-1 items-center justify-center"
                style={{
                  opacity: fadeAnim,
                  transform: [{ scale: scaleAnim }],
                }}>
                {/* Header */}
                <View className="absolute left-0 right-0 top-0 z-10 flex-row items-center justify-between p-4">
                  <View>
                    <Text className="font-medium text-white">
                      {selectedImage.caption || 'Photo'}
                    </Text>
                    <Text className="text-sm text-gray-400">
                      {selectedImage.timestamp || 'Just now'}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={closeModal} className="rounded-full bg-black/30 p-2">
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>
                </View>

                {/* Image */}
                <View className="w-full flex-1 items-center justify-center">
                  {imageLoading && (
                    <ActivityIndicator
                      size="large"
                      color="#ffffff"
                      style={StyleSheet.absoluteFill}
                    />
                  )}
                  <Image
                    source={{ uri: selectedImage.path }}
                    className="h-4/5 w-full"
                    resizeMode="contain"
                    onLoadStart={() => setImageLoading(true)}
                    onLoadEnd={() => setImageLoading(false)}
                  />
                </View>

                {/* Footer */}
                <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between bg-black/30 p-4">
                  <View className="flex-row items-center">
                    <TouchableOpacity className="mr-4">
                      <Ionicons name="heart-outline" size={28} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity>
                      <Ionicons name="share-outline" size={28} color="white" />
                    </TouchableOpacity>
                  </View>
                  <Text className="text-white">{selectedImage.likes || 0} likes</Text>
                </View>
              </Animated.View>
            )}
          </TouchableOpacity>
        </BlurView>
      </Modal>
    </>
  );
};
