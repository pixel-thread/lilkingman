import { useRef, useEffect } from 'react';
import { View, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { ImageI } from '~/src/types/Image';

type Props = {
  item: ImageI;
  index: number;
  imagePress: (image: ImageI) => void;
};

export const RenderImageItem = ({ item, index, imagePress }: Props) => {
  const windowWidth = Dimensions.get('window').width;
  const imageSize = windowWidth / 3 - 5; // 3 columns with small gap

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
        onPress={() => imagePress(item)}
        className="m-1 overflow-hidden rounded-xl bg-muted"
        activeOpacity={0.9}>
        <View>
          <Image
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
