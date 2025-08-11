import { Stack } from 'expo-router';
import { CustomHeader } from '~/src/components/common/CustomHeader';
import AboutScreen from '~/src/components/screen/about';

export default function page() {
  return (
    <>
      <Stack.Screen
        options={{
          title: 'About',
          headerShown: true,
          header: () => <CustomHeader showBackButton title="About" showRightIcon={false} />,
        }}
      />
      <AboutScreen />
    </>
  );
}
