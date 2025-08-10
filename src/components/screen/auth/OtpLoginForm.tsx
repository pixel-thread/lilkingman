import { View } from 'react-native';
import { Button } from '~/src/components/ui/Button';
import { Input } from '~/src/components/ui/Input';
import { Text } from '~/src/components/ui/Text';
import { Small } from '~/src/components/ui/Typography';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema } from '~/src/utils/validiation/auth';
import { useMutation } from '@tanstack/react-query';
import http from '~/src/utils/http';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';
import { setToken } from '~/src/utils/storage/token';
import { router } from 'expo-router';
import { AUTH_ENDPOINT } from '~/src/lib/constants/endpoints/auth';

type FormValue = {
  email: string;
  otp: string;
};

export const OtpLoginForm = ({ email }: { email: string }) => {
  const { isAuthLoading } = useAuthContext();
  const {
    formState: { errors },
    handleSubmit,
    control,
  } = useForm<FormValue>({
    resolver: zodResolver(authSchema.required()),
    defaultValues: {
      email: email,
      otp: '',
    },
  });

  const { mutate: mutateOtp, isPending: isPendingOtp } = useMutation({
    mutationKey: ['user'],
    mutationFn: (data: { email: string; otp: string }) => http.post(AUTH_ENDPOINT.POST_LOGIN, data),
    onSuccess: async (data) => {
      if (data.success) {
        if (data.token) {
          await setToken(data.token);
          router.replace('/');
        }
        return data;
      }
    },
  });

  const handleOtpLogin = handleSubmit((data) => {
    if (data.email && data.otp) {
      mutateOtp({ email: data.email, otp: data.otp });
    }
  });

  const isLoading = isPendingOtp || isAuthLoading;

  const { mutate } = useMutation({
    mutationKey: ['auth'],
    mutationFn: (data: { email: string }) => http.post('/auth/init', data),
  });

  const handleSendOtp = handleSubmit((data) => {
    if (data.email) {
      mutate({ email: data.email });
    }
    return;
  });

  return (
    <>
      <View className="space-y-2">
        <Text className="mb-1 font-medium">Enter OTP</Text>
        <View className="relative">
          <Controller
            control={control}
            name="otp"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                placeholder="Enter the OTP sent to your email"
                keyboardType="number-pad"
                maxLength={6}
                className="text-start text-lg font-normal tracking-normal"
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                inputMode="numeric"
                onEndEditing={handleOtpLogin}
              />
            )}
          />
        </View>
        {errors.otp && <Small className="ml-2 pt-3 text-destructive">{errors.otp.message}</Small>}
      </View>
      <View className="mt-5 flex-row justify-between">
        <Small className="text-muted-foreground">Didn&apos;t receive code?</Small>
        <Small className="font-medium text-primary" onPress={handleSendOtp}>
          Resend OTP
        </Small>
      </View>

      <Button disabled={isLoading} className="mt-6" onPress={handleOtpLogin}>
        <Text className="font-semibold text-primary-foreground">Verify & Login</Text>
      </Button>
    </>
  );
};
