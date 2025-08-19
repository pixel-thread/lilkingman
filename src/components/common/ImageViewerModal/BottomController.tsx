import { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '~/src/components/ui/Text';
import { useFileDownload } from '~/src/hooks/download/useFileDownload';
import { useImageViewModalStore } from '~/src/lib/store/useImageViewerModal';
import { PaymentButton } from '../payment/PaymentButton';

export const ButtomController = () => {
  const [isLiked, setIsLiked] = useState(false);
  const { image } = useImageViewModalStore();
  const insets = useSafeAreaInsets();
  const bottomSafeArea = Platform.OS === 'ios' ? insets.bottom : Math.max(insets.bottom, 16);

  const { downloadImage, isDownloading } = useFileDownload();

  const isShowPaymentButton = image?.isPaid && image?.paymentStatus !== 'SUCCESS';

  const shareImage = () => {};

  return (
    <View
      style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 20,
        paddingBottom: bottomSafeArea,
      }}>
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.8)']}
        style={{ paddingTop: 32, paddingBottom: 8 }}>
        {/* Action Buttons */}

        {isShowPaymentButton && <PaymentButton />}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
          }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 24,
            }}>
            {/* Like Button */}
            <TouchableOpacity onPress={() => setIsLiked(!isLiked)} style={{ alignItems: 'center' }}>
              <View
                style={{
                  height: 48,
                  width: 48,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 24,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                }}>
                <Ionicons
                  name={isLiked ? 'heart' : 'heart-outline'}
                  size={28}
                  color={isLiked ? '#ff3040' : 'white'}
                />
              </View>
              <Text style={{ marginTop: 4, fontSize: 10, color: 'white' }}>
                {isLiked ? '1' : '0'}
              </Text>
            </TouchableOpacity>

            {/* Share Button */}
            <TouchableOpacity onPress={shareImage} style={{ alignItems: 'center' }}>
              <View
                style={{
                  height: 48,
                  width: 48,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 24,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                }}>
                <Ionicons name="share-outline" size={28} color="white" />
              </View>
              <Text style={{ marginTop: 4, fontSize: 10, color: 'white' }}>Share</Text>
            </TouchableOpacity>

            {/* Download Button */}
            <TouchableOpacity
              onPress={() => downloadImage()}
              disabled={isDownloading}
              style={{ alignItems: 'center' }}>
              <View
                style={{
                  height: 48,
                  width: 48,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 24,
                  backgroundColor: 'rgba(0,0,0,0.3)',
                }}>
                {isDownloading ? (
                  <ActivityIndicator color="white" size="small" />
                ) : (
                  <Ionicons name="download-outline" size={28} color="white" />
                )}
              </View>
              <Text style={{ marginTop: 4, fontSize: 10, color: 'white' }}>
                {isDownloading ? 'Saving...' : 'Save'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* More Options */}
          <TouchableOpacity style={{ alignItems: 'center' }}>
            <View
              style={{
                height: 48,
                width: 48,
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 24,
                backgroundColor: 'rgba(0,0,0,0.3)',
              }}>
              <Ionicons name="ellipsis-horizontal" size={28} color="white" />
            </View>
            <Text style={{ marginTop: 4, fontSize: 10, color: 'white' }}>More</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};
