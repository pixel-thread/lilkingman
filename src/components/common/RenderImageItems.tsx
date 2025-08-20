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
  const imageWidth = (windowWidth - 8) / 3; // 3 columns with 2px margin each side (8px total)
  const imageHeight = imageWidth * 1.35; // Portrait aspect ratio (4:3 or 1.35:1 like Instagram)

  // Animation
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 400,
      delay: index * 60, // stagger
      useNativeDriver: true,
    }).start();
  }, [animValue, index]);

  const imageUrl = item?.thumbnailUrl;

  return (
    <Animated.View
      style={{
        opacity: animValue,
        transform: [
          {
            scale: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.85, 1],
            }),
          },
        ],
      }}>
      <TouchableOpacity
        onPress={() => imagePress(item)}
        activeOpacity={0.85}
        style={{
          margin: 1, // Reduced margin for tighter grid
          borderRadius: 1,
          overflow: 'hidden',
          backgroundColor: 'rgba(255,255,255,0.08)', // glassy background
        }}>
        <View
          style={{
            borderRadius: 1,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 4,
            elevation: 3,
          }}>
          <Image
            source={imageUrl ? { uri: imageUrl } : require('~/src/assets/splash.png')}
            style={{
              width: imageWidth,
              height: imageHeight, // Portrait aspect ratio
            }}
            resizeMode="cover"
          />
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};
