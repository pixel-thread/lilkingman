import { useState, useRef } from 'react';
import {
  View,
  Image,
  Modal,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  StyleSheet,
  Alert,
  Platform,
  ToastAndroid,
  StatusBar, // Add this import
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // Add this import for better gradients
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '~/src/components/ui/Text';
import { useFileDownload } from '~/src/hooks/download/useFileDownload';
import { ImageI } from '~/src/types/Image';
import moment from 'moment';

type Props = {
  image: ImageI | null;
  onClose: () => void;
  visible: boolean;
  fade: any;
  scale: any;
};

export const ImageViewerModal = ({
  image: selectedImage,
  onClose: closeModal,
  visible: modalVisible,
  fade: fadeAnim,
  scale: scaleAnim,
}: Props) => {
  const [imageLoading, setImageLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [controlsVisible, setControlsVisible] = useState(true);

  // Get safe area insets with Android-specific handling
  const insets = useSafeAreaInsets();
  const statusBarHeight = Platform.OS === 'android' ? StatusBar.currentHeight || 0 : 0;
  const topSafeArea = Platform.OS === 'ios' ? insets.top : Math.max(insets.top, statusBarHeight);
  const bottomSafeArea = Platform.OS === 'ios' ? insets.bottom : Math.max(insets.bottom, 16);

  const { isDownloading, downloadFile } = useFileDownload();
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  const lastTap = useRef(0);

  // Auto-hide controls after 3 seconds
  const resetControlsTimeout = () => {
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    setControlsVisible(true);
    controlsTimeout.current = setTimeout(() => {
      setControlsVisible(false);
    }, 3000);
  };

  // Handle double tap to like
  const handleImagePress = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;

    if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
      // Double tap - like image
      setIsLiked(!isLiked);
    } else {
      // Single tap - toggle controls
      setControlsVisible(!controlsVisible);
      resetControlsTimeout();
    }
    lastTap.current = now;
  };

  const downloadImage = async () => {
    if (!selectedImage) return;

    try {
      downloadFile({
        fileUrl: selectedImage.path,
        type: selectedImage.mimeType.split('/')[1],
      });

      if (Platform.OS === 'ios') {
        Alert.alert('Success', 'Image saved to Photos', [{ text: 'OK' }]);
      } else {
        ToastAndroid.show('Image saved to Gallery', ToastAndroid.SHORT);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save image');
      console.error('Error saving image:', error);
    }
  };

  const shareImage = () => {
    // Implement share functionality
    console.log('Share image');
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      onRequestClose={closeModal}
      statusBarTranslucent={true}>
      {/* Background Overlay */}
      <Animated.View
        style={[
          StyleSheet.absoluteFill,
          {
            opacity: fadeAnim,
            backgroundColor: 'rgba(0,0,0,0.95)',
          },
        ]}
      />

      <View style={StyleSheet.absoluteFill}>
        {selectedImage && (
          <Animated.View
            className="flex-1"
            style={{
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}>
            {/* Header Controls */}
            <Animated.View
              className="absolute left-0 right-0 top-0 z-20"
              style={{
                opacity: controlsVisible ? 1 : 0,
                paddingTop: topSafeArea, // Use calculated safe area for Android
              }}>
              <LinearGradient
                colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)', 'transparent']}
                style={{ paddingBottom: 20, paddingTop: 12 }}>
                <View className="flex-row items-center justify-between px-4">
                  <TouchableOpacity
                    onPress={closeModal}
                    className="h-10 w-10 items-center justify-center rounded-full bg-black/30"
                    style={{
                      shadowColor: '#000',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.25,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}>
                    <Ionicons name="close" size={24} color="white" />
                  </TouchableOpacity>

                  <View className="mx-4 flex-1">
                    <Text className="text-center text-lg font-semibold text-white">
                      {selectedImage.name || 'Photo'}
                    </Text>
                  </View>

                  <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-black/30">
                    <Ionicons name="information-circle-outline" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>

            {/* Main Image Container */}
            <TouchableOpacity
              activeOpacity={1}
              onPress={handleImagePress}
              className="flex-1 items-center justify-center">
              {/* Loading Indicator */}
              {imageLoading && (
                <View className="absolute z-10 items-center justify-center">
                  <ActivityIndicator size="large" color="#ffffff" />
                  <Text className="mt-2 text-sm text-white">Loading...</Text>
                </View>
              )}

              {/* Main Image */}
              <Image
                source={{ uri: selectedImage.path }}
                className="h-full w-full"
                resizeMode="contain"
                onLoadStart={() => setImageLoading(true)}
                onLoadEnd={() => setImageLoading(false)}
                onError={() => {
                  setImageLoading(false);
                  Alert.alert('Error', 'Failed to load image');
                }}
              />

              {/* Double Tap Heart Animation */}
              {isLiked && (
                <Animated.View className="absolute items-center justify-center">
                  <Ionicons name="heart" size={80} color="#ff3040" />
                </Animated.View>
              )}
            </TouchableOpacity>

            {/* Bottom Controls */}
            <Animated.View
              className="absolute bottom-0 left-0 right-0 z-20"
              style={{
                opacity: controlsVisible ? 1 : 0,
                paddingBottom: bottomSafeArea, // Use calculated safe area for Android
              }}>
              <LinearGradient
                colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
                style={{ paddingTop: 32, paddingBottom: 8 }}>
                {/* Image Info */}
                <View className="mb-4 px-4">
                  <Text className="text-sm font-medium text-white">
                    {moment(selectedImage.createdAt).format('MMMM Do, YYYY • h:mm A')}
                  </Text>
                  <Text className="mt-1 text-xs text-gray-300">
                    {selectedImage.mimeType} • {formatFileSize(selectedImage.sizeOriginal || 0)}
                  </Text>
                </View>

                {/* Action Buttons */}
                <View className="flex-row items-center justify-between px-4">
                  <View className="flex-row items-center space-x-6">
                    {/* Like Button */}
                    <TouchableOpacity onPress={() => setIsLiked(!isLiked)} className="items-center">
                      <View className="h-12 w-12 items-center justify-center rounded-full bg-black/30">
                        <Ionicons
                          name={isLiked ? 'heart' : 'heart-outline'}
                          size={28}
                          color={isLiked ? '#ff3040' : 'white'}
                        />
                      </View>
                      <Text className="mt-1 text-xs text-white">{isLiked ? '1' : '0'}</Text>
                    </TouchableOpacity>

                    {/* Share Button */}
                    <TouchableOpacity onPress={shareImage} className="items-center">
                      <View className="h-12 w-12 items-center justify-center rounded-full bg-black/30">
                        <Ionicons name="share-outline" size={28} color="white" />
                      </View>
                      <Text className="mt-1 text-xs text-white">Share</Text>
                    </TouchableOpacity>

                    {/* Download Button */}
                    <TouchableOpacity
                      onPress={downloadImage}
                      disabled={isDownloading}
                      className="items-center">
                      <View className="h-12 w-12 items-center justify-center rounded-full bg-black/30">
                        {isDownloading ? (
                          <ActivityIndicator color="white" size="small" />
                        ) : (
                          <Ionicons name="download-outline" size={28} color="white" />
                        )}
                      </View>
                      <Text className="mt-1 text-xs text-white">
                        {isDownloading ? 'Saving...' : 'Save'}
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* More Options */}
                  <TouchableOpacity className="items-center">
                    <View className="h-12 w-12 items-center justify-center rounded-full bg-black/30">
                      <Ionicons name="ellipsis-horizontal" size={28} color="white" />
                    </View>
                    <Text className="mt-1 text-xs text-white">More</Text>
                  </TouchableOpacity>
                </View>
              </LinearGradient>
            </Animated.View>
          </Animated.View>
        )}
      </View>
    </Modal>
  );
};
