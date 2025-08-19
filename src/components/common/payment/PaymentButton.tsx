import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  ToastAndroid,
  Platform,
} from 'react-native';
import { useImageViewModalStore } from '~/src/lib/store/useImageViewerModal';
import http from '~/src/utils/http';
import RazorpayCheckout from 'react-native-razorpay';
import { logger } from '~/src/utils/logger';
import { cn } from '~/src/lib/utils';
import { Ternary } from '../Ternary';
import { PAYMENT_ENDPOINT } from '~/src/lib/constants/endpoints/payment';

export const PaymentButton = () => {
  const { image } = useImageViewModalStore();
  const queryClient = useQueryClient();

  const { mutate: verify, isPending: verifyLoading } = useMutation({
    mutationKey: ['payment', image?.id],
    mutationFn: async (data: any) => http.post<any>(PAYMENT_ENDPOINT.POST_PAYMENT_VERIFY, data),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['photo', image?.id] });
      }
      logger.error(data);
      if (Platform.OS === 'android') {
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
      }
      queryClient.invalidateQueries({ queryKey: ['featured images'] });
    },
  });

  const { mutate, isPending } = useMutation({
    mutationKey: ['payment', image?.id],
    mutationFn: async () =>
      http.post<any>(PAYMENT_ENDPOINT.POST_PAYMENT_CREATE_ORDER, { photoId: image?.id }),
    onSuccess: (data) => {
      if (data.success) {
        const options = data.data;
        RazorpayCheckout.open(options)
          .then((data: any) => {
            logger.info(data);
            verify({
              ...data,
              photoId: image?.id,
            });
          })
          .catch((error: any) => {
            logger.error(error);
          });
        return;
      }
      logger.error(data);
      if (Platform.OS === 'android') {
        ToastAndroid.show(data.message, ToastAndroid.SHORT);
      }
    },
  });

  return (
    <View className="px-4">
      <TouchableOpacity
        disabled={isPending || verifyLoading}
        onPress={() => mutate()}
        className={cn(
          'rounded-lg border-2 px-6 py-4',
          isPending || verifyLoading
            ? 'border-gray-300 bg-gray-100'
            : 'border-blue-600 bg-white active:bg-blue-50'
        )}
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 6,
        }}>
        <View className="mb-1 flex-row items-center justify-center">
          <Ternary
            condition={isPending || verifyLoading}
            trueComponent={<ActivityIndicator size="small" />}
            falseComponent={
              <Text
                className={cn(
                  'text-base font-semibold tracking-wide',
                  isPending || verifyLoading ? 'text-gray-400' : 'text-blue-600'
                )}>
                {isPending || verifyLoading ? 'Processing...' : `Send Tips • ₹${image?.price}`}
              </Text>
            }
          />
        </View>
        <Text className="text-center text-xs text-gray-500">Secured by Razorpay</Text>
      </TouchableOpacity>
    </View>
  );
};
