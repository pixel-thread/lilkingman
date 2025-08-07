import { Button } from '../../ui/Button';
import { Text } from '../../ui/Text';

export const SocialLogin = () => {
  const handleGoogleLogin = () => {};
  return (
    <Button
      variant="outline"
      className="w-full flex-row justify-center space-x-2"
      onPress={handleGoogleLogin}>
      <Text className="font-medium">Continue with Google</Text>
    </Button>
  );
};
