import { Stack } from 'expo-router';
import { CustomHeader } from '~/src/components/common/CustomHeader';
import { GalleryScreen } from '~/src/components/screen/gallery';

export default function Home() {
  return (
    <>
      <Stack.Screen
        options={{
          header: () => <CustomHeader showBackButton title={'Featured Images'} />,
        }}
      />
      <GalleryScreen />
    </>
  );
}
