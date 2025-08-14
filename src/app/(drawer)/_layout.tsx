import { Drawer } from 'expo-router/drawer';
import { Container } from '~/src/components/common/Container';
import { CustomDrawerContent } from '~/src/components/common/CustomDrawer';
import { CustomHeader } from '~/src/components/common/CustomHeader';

const DrawerLayout = () => {
  return (
    <Drawer
      screenOptions={{
        header: ({ options }) => <CustomHeader title={options.title} showRightIcon={true} />,
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
