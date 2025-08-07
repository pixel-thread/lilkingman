import { View } from 'react-native';
import { Button } from '~/src/components/ui/Button';
import { Input } from '~/src/components/ui/Input';
import { Text } from '~/src/components/ui/Text';
import { Small } from '~/src/components/ui/Typography';
import { Mail } from 'lucide-react-native';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { authSchema } from '~/src/utils/validiation/auth';
import { Ternary } from '../../common/Ternary';
import { useMutation } from '@tanstack/react-query';
import http from '~/src/utils/http';
import { logger } from '~/src/utils/logger';
import { useState } from 'react';
import { OtpLoginForm } from './OtpLoginForm';

type FormValue = { email: string };

export const LoginForm = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValue>({
    resolver: zodResolver(authSchema.pick({ email: true })),
    defaultValues: {
      email: '',
    },
  });
  const watchEmail = useWatch({
    control: control,
    name: 'email',
  });
  const { mutate, isPending } = useMutation({
    mutationKey: ['auth'],
    mutationFn: (data: FormValue) => http.post('/auth/init', data),
    onSuccess: (data) => {
      if (data.success) {
        setIsOtpSent(true);
        return data;
      }
    },
  });

  const handleSendOtp = handleSubmit((data) => {
    logger.log('Send Otp');
    if (data.email) {
      mutate({ email: data.email });
    }
    return;
  });

  const isLoading = isPending;

  return (
    <Ternary
      condition={!isOtpSent}
      trueComponent={
        <>
          <View className="space-y-2">
            <Text className="mb-1 font-medium">Email Address</Text>
            <View className="relative">
              <View className="absolute left-3 h-full justify-center">
                <Mail size={20} className="text-muted-foreground" />
              </View>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    placeholder="Enter your email address"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="pl-5"
                    placeholderClassName="font-normal"
                    onChangeText={onChange}
                    onEndEditing={handleSendOtp}
                    onBlur={onBlur}
                    value={value}
                  />
                )}
              />
            </View>
            {errors.email && (
              <Small className="ml-2 pt-3 text-destructive">{errors.email.message}</Small>
            )}
            <Small className="ml-2 pt-3 text-muted-foreground">
              Account will be created if not found.
            </Small>
          </View>

          <Button disabled={isLoading} className="mt-6" onPress={handleSendOtp}>
            <Text className="font-semibold text-primary-foreground">Send OTP</Text>
          </Button>
        </>
      }
      falseComponent={<OtpLoginForm email={watchEmail} />}
    />
  );
};
