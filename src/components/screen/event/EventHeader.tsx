import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '~/src/components/ui/Text';
import { EventI } from '~/src/types/context/event';
import { Skeleton } from '~/src/components/ui/Skeleton';

type EventHeaderProps = {
  event: EventI | null;
  isLoading?: boolean;
  onCameraPress?: () => void;
};

export const EventHeader = ({ event, isLoading = false, onCameraPress }: EventHeaderProps) => {
  if (isLoading) {
    return (
      <View className="bg-gray-900 px-4 pb-6 pt-4">
        <View className="mb-2 flex-row items-center justify-between">
          <View className="flex-1">
            <Skeleton className="mb-2 h-8 w-3/4 rounded-md" />
            <Skeleton className="h-4 w-1/3 rounded-md" />
          </View>
          <Skeleton className="h-10 w-10 rounded-full" />
        </View>
      </View>
    );
  }

  if (!event) {
    return null;
  }

  return (
    <View className="bg-black px-4 pb-6 pt-4">
      <View className="mb-2 flex-row items-center justify-between">
        <View className="flex-1">
          <Text className="mb-1 text-2xl font-bold text-white">
            {event?.name || 'Event Gallery'}
          </Text>
          <Text className="text-gray-400">
            {event?.date ? new Date(event.date).toLocaleDateString() : 'Today'}
          </Text>
        </View>
        <TouchableOpacity className="rounded-full bg-gray-800 p-2" onPress={onCameraPress}>
          <Ionicons name="camera-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
