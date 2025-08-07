// src/components/Loading.tsx
import { useIsFetching } from '@tanstack/react-query';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, View } from 'react-native';

export const Loading = ({ children }: { children: React.ReactNode }) => {
  const isFetching = useIsFetching({ queryKey: ['user'] });
  const [isLoading, setIsLoading] = useState(true);

  // Create three animated values
  const animValues = [
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
    useRef(new Animated.Value(0)).current,
  ];

  // Start looping animation for each circle
  useEffect(() => {
    const animations = animValues.map((anim, i) =>
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
  }, []);

  // Watch isFetching to trigger delay
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isFetching === 0) {
      timeout = setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } else {
      setIsLoading(true);
    }

    return () => clearTimeout(timeout);
  }, [isFetching]);

  if (isLoading) {
    return (
      <View className="flex-1 flex-row items-center justify-center gap-x-3 bg-background">
        {animValues.map((anim, index) => (
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
  }

  return <>{children}</>;
};
