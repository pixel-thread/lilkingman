import { AntDesign } from '@expo/vector-icons';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ToastAndroid, TouchableOpacity, View } from 'react-native';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';
import { useEventContext } from '~/src/hooks/event/useEventContext';
import { EVENTS_ENDPOINT } from '~/src/lib/constants/endpoints/event';
import { useScannerStore } from '~/src/lib/store/useScannerStore';
import http from '~/src/utils/http';

export const EventRightHeader = () => {
  const { event } = useEventContext();
  const { user } = useAuthContext();
  const { open, onValueChange } = useScannerStore();
  const queryClient = useQueryClient();
  const { mutate: removeEvent } = useMutation({
    mutationKey: ['remove-event'],
    mutationFn: () =>
      http.post(EVENTS_ENDPOINT.POST_REMOVE_EVENT_USER.replace(':id', event?.id ?? ''), {}),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['latest-event', user] });
      }
      ToastAndroid.show(data.message, ToastAndroid.SHORT);
    },
  });

  const onClickScan = () => {
    onValueChange(!open);
  };

  return (
    <View className="flex flex-row gap-x-3">
      <TouchableOpacity onPress={onClickScan}>
        <AntDesign name="scan1" size={24} color="black" />
      </TouchableOpacity>
      {event && (
        <TouchableOpacity onPress={() => removeEvent()}>
          <AntDesign name="logout" size={24} color="#ff0000" />
        </TouchableOpacity>
      )}
    </View>
  );
};
