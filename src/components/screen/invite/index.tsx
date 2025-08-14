import React from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { Button } from '~/src/components/ui/Button';
import { Input } from '~/src/components/ui/Input';
import { Text } from '~/src/components/ui/Text';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/src/components/ui/Card';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import http from '~/src/utils/http';
import { useEventContext } from '~/src/hooks/event/useEventContext';
import { EVENTS_ENDPOINT } from '~/src/lib/constants/endpoints/event';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';
import { Ternary } from '../../common/Ternary';
import { NoPhoto } from '../../common/NoPhoto';

// Email validation schema
const emailSchema = z.object({
  email: z.email('Please enter a valid email address'),
});

type FormValues = z.infer<typeof emailSchema>;

export const InviteScreen = () => {
  const { user } = useAuthContext();
  const { event, isEventLoading, refresh } = useEventContext();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const qrCodeValue = event?.id;

  // Form handling
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: '',
    },
  });

  // Mock mutation for sending email invite
  const { mutate, isPending } = useMutation({
    mutationKey: ['send-invite'],
    mutationFn: (data: FormValues) =>
      http.post(EVENTS_ENDPOINT.POST_ADD_EVENT_USER_EMAIL.replace(':id', event?.id ?? ''), data),
    onSuccess: (data) => {
      if (data.success) {
        Alert.alert('Success', data.message);
        reset();
        queryClient.invalidateQueries({ queryKey: ['latest-event', user] });
        return;
      }
      Alert.alert('Error', data.message);
      return;
    },
  });

  const onSubmit = (data: FormValues) => mutate(data);

  if (!event || isEventLoading) {
    return (
      <NoPhoto
        title="No Event"
        description="There is no event currently."
        icon="camera-outline"
        refetch={refresh}
        isLoading={isEventLoading}
      />
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingBottom: insets.bottom + 20,
      }}>
      <View className="p-6">
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Scan QR Code</CardTitle>
            <CardDescription>Let your friends scan this code to join</CardDescription>
          </CardHeader>
          <CardContent className="items-center justify-center p-6">
            <View className="rounded-xl border-2 border-border p-4">
              <QRCode value={qrCodeValue} size={300} color="#000000" backgroundColor="#ffffff" />
            </View>
          </CardContent>
        </Card>

        <View className="my-6 flex-row items-center">
          <View className="h-[1px] flex-1 bg-border" />
          <Text className="mx-4 text-muted-foreground">OR</Text>
          <View className="h-[1px] flex-1 bg-border" />
        </View>

        <Card>
          <CardHeader>
            <CardTitle>Send Email Invite</CardTitle>
            <CardDescription>Invite via email address</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <View className="space-y-4">
              <View className="space-y-2">
                <Text className="font-medium">Email Address</Text>
                <View className="relative">
                  <View className="absolute left-3 h-full justify-center">
                    <Ionicons name="mail-outline" size={20} color="#6b7280" />
                  </View>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <Input
                        placeholder="Enter email address"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        className="pl-10"
                        onChangeText={onChange}
                        onBlur={onBlur}
                        value={value}
                      />
                    )}
                  />
                </View>
                <Ternary
                  condition={!!errors?.email}
                  trueComponent={
                    <Text className="text-sm text-destructive">{errors?.email?.message}</Text>
                  }
                  falseComponent={null}
                />
              </View>
            </View>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onPress={handleSubmit(onSubmit)} disabled={isPending}>
              <Ternary
                condition={isPending}
                trueComponent={
                  <Text className="font-semibold text-primary-foreground">Sending...</Text>
                }
                falseComponent={
                  <Text className="font-semibold text-primary-foreground">Send Invitation</Text>
                }
              />
            </Button>
          </CardFooter>
        </Card>
      </View>
    </ScrollView>
  );
};
