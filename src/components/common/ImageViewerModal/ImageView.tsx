import { useState } from 'react';
import { View, Image, ActivityIndicator, Alert } from 'react-native';
import { Text } from '~/src/components/ui/Text';
import { useImageViewModalStore } from '~/src/lib/store/useImageViewerModal';

export const ImageView = () => {
  const { image: selectedImage } = useImageViewModalStore();

  const [imageLoading, setImageLoading] = useState(true);

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      {/* Loading Indicator */}
      {imageLoading && (
        <View
          style={{
            position: 'absolute',
            zIndex: 10,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={{ marginTop: 8, fontSize: 12, color: 'white' }}>Loading...</Text>
        </View>
      )}

      {/* Main Image */}
      <Image
        source={{ uri: selectedImage?.path }}
        style={{ height: '100%', width: '100%' }}
        resizeMode="contain"
        onLoadStart={() => setImageLoading(true)}
        onLoadEnd={() => setImageLoading(false)}
        onError={() => {
          setImageLoading(false);
          Alert.alert('Error', 'Failed to load image');
        }}
      />
    </View>
  );
};
