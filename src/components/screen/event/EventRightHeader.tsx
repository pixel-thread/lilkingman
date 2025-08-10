import { AntDesign } from '@expo/vector-icons';
import { useMutation } from '@tanstack/react-query';
import { TouchableOpacity, View } from 'react-native';
import { useEventContext } from '~/src/hooks/event/useEventContext';
import { EVENTS_ENDPOINT } from '~/src/lib/constants/endpoints/event';
import { useScannerStore } from '~/src/lib/store/useScannerStore';
import http from '~/src/utils/http';

export const EventRightHeader = () => {
  const { event, refresh } = useEventContext();
  const { open, onValueChange } = useScannerStore();

  const { mutate: removeEvent } = useMutation({
    mutationKey: ['remove-event'],
    mutationFn: () =>
      http.post(EVENTS_ENDPOINT.POST_REMOVE_EVENT_USER.replace(':id', event?.id ?? '')),
    onSuccess: () => refresh(),
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
