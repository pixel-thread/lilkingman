import { Stack } from 'expo-router';
import { Container } from '~/src/components/common/Container';
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
      <Container>
        <GalleryScreen />
      </Container>
    </>
  );
}
