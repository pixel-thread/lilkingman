import { useEffect, useMemo, useRef } from 'react';
import { Animated, View } from 'react-native';

export const Loader = () => {
  // Create three animated values
  const animValues = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];
  const animValuesRef = useMemo(() => animValues, [animValues]);
  // Start looping animation for each circle
  useEffect(() => {
    const animations = animValuesRef.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 150),
          Animated.timing(anim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ])
      )
    );

    animations.forEach((a) => a.start());
    return () => animations.forEach((a) => a.stop());
  }, [animValuesRef]);

  return (
    <View className="flex-1 flex-row items-center justify-center gap-x-3 bg-background">
      {animValuesRef.map((anim, index) => (
        <Animated.View
          key={index}
          className="h-5 w-5 rounded-full bg-primary"
          style={{
            transform: [
              {
                scale: anim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.5],
                }),
              },
            ],
            opacity: anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            }),
          }}
        />
      ))}
    </View>
  );
};
