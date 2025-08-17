import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { View, Image, ActivityIndicator, Alert } from 'react-native';
import { Text } from '~/src/components/ui/Text';
import { PHOTOS_ENDPOINT } from '~/src/lib/constants/endpoints/photo';
import { useImageViewModalStore } from '~/src/lib/store/useImageViewerModal';
import { ImageI } from '~/src/types/Image';
import http from '~/src/utils/http';

export const ImageView = () => {
  const { image: selectedImage } = useImageViewModalStore();

  const { data, isFetching: imageLoading } = useQuery({
    queryFn: async () =>
      http.get<ImageI>(PHOTOS_ENDPOINT.GET_PHOTO_BY_ID.replace(':id', selectedImage?.id || '')),
    queryKey: ['photo', selectedImage?.id],
    enabled: !!selectedImage,
    select: (data) => data.data,
  });

  const imageUrl = data?.isPaid && data?.paymentStatus === 'SUCCESS' ? data?.path : data?.blurUrl;

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
      <Image
        source={{ uri: imageUrl }}
        style={{ height: '100%', width: '100%' }}
        resizeMode="contain"
        onError={() => Alert.alert('Error', 'Failed to load image')}
      />
    </View>
  );
};
