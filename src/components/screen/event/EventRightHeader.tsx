import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity, View } from 'react-native';

export const EventRightHeader = () => {
  const onClickScan = () => {};
  return (
    <View className="flex flex-row gap-x-2">
      <TouchableOpacity onPress={onClickScan}>
        <AntDesign name="scan1" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onClickScan}>
        <AntDesign name="qrcode" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};
