import { useState } from 'react';
import {
  View,
  Image,
  Modal,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Text } from '~/src/components/ui/Text';

type ImageT = {
  id: string;
  userId: string | null;
  path: string;
  eventId: string;
  caption?: string;
  likes?: number;
  timestamp?: string;
};

type Props = {
  image: ImageT | null;
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

  return (
    <Modal transparent={true} visible={modalVisible} onRequestClose={closeModal}>
      <BlurView intensity={90} tint="default" style={StyleSheet.absoluteFill}>
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
                  <Text className="font-medium text-white">{selectedImage.caption || 'Photo'}</Text>
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
                  <ActivityIndicator size="large" color="#ffffff" style={StyleSheet.absoluteFill} />
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
  );
};
