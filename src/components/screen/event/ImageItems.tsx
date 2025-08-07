import { useState, useRef, useEffect } from 'react';
import { View, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Skeleton } from '~/src/components/ui/Skeleton';
import { Ternary } from '../../common/Ternary';

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
  item: ImageT;
  index: number;
  imagePress: (image: ImageT) => void;
};

export const RenderImageItem = ({ item, index, imagePress }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const windowWidth = Dimensions.get('window').width;
  const imageSize = windowWidth / 3 - 4; // 3 columns with small gap

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
          {/* {isLoading && ( */}
          {/*   <View */}
          {/*     style={{ width: imageSize, height: imageSize }} */}
          {/*     className="items-center justify-center"> */}
          {/*     <Skeleton className="absolute h-full w-full rounded-xl" /> */}
          {/*   </View> */}
          {/* )} */}
          <Image
            onLoadStart={() => setIsLoading(true)}
            onLoadEnd={() => setIsLoading(false)}
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
