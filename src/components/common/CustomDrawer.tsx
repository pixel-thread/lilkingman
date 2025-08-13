import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { usePathname, useRouter } from 'expo-router';
import { CustomAvatar } from './CustomAvatar';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export type MenuItemsT = {
  id: number;
  title: string;
  herf: string;
};

const menuItems: MenuItemsT[] = [
  {
    id: 1,
    title: 'Featured Images',
    herf: 'gallery',
  },
  {
    id: 2,
    title: 'About us',
    herf: 'about',
  },
];
export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { logout } = useAuthContext();
  const insets = useSafeAreaInsets();
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: insets.top, flex: 1 }}>
      <CustomAvatar />
      {menuItems.map((item) => (
        <DrawerItem
          focused={pathname === `/${item.herf}`}
          key={item.id}
          style={{
            borderRadius: 12,
            marginHorizontal: 12,
            marginVertical: 4,
          }}
          label={item.title}
          // @ts-ignore
          onPress={() => router.push(`/${item.herf}`)}
        />
      ))}

      <DrawerItem
        label="Logout"
        onPress={logout}
        labelStyle={{ color: '#ef4444', fontWeight: '500' }} // Tailwind's red-500
        style={{
          backgroundColor: '#fef2f2', // Tailwind's red-50
          marginHorizontal: 12,
          borderRadius: 12,
          marginVertical: 4,
        }}
      />
    </DrawerContentScrollView>
  );
}
