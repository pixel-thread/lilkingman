import { Drawer } from 'expo-router/drawer';
import { CustomDrawerContent } from '~/src/components/common/CustomDrawer';
import { CustomHeader } from '~/src/components/common/CustomHeader';

const DrawerLayout = () => {
  return (
    <Drawer
      screenOptions={{
        header: ({ options }) => (
          <CustomHeader
            title={options.title}
            showRightIcon={true}
            rightIconName="camera-outline"
            onRightIconPress={() => {
              console.log('Camera button pressed');
            }}
          />
        ),
      }}
      drawerContent={CustomDrawerContent}>
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Home',
          headerShown: false,
        }}
      />
    </Drawer>
  );
};

export default DrawerLayout;
