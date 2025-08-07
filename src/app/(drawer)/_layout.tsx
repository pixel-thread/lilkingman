import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { CustomDrawerContent } from '~/src/components/common/CustomDrawer';

const DrawerLayout = () => {
  return (
    <Drawer drawerContent={CustomDrawerContent}>
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
