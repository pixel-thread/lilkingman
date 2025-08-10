import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer';
import { usePathname, useRouter } from 'expo-router';
import { Image, View } from 'react-native';
import { Text } from '../ui/Text';
import Constants from 'expo-constants';
import { useMutation } from '@tanstack/react-query';
import http from '~/src/utils/http';
import { removeUser } from '~/src/utils/storage/user';

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
    title: 'modal',
    herf: 'modal',
  },
];
export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const appName = Constants.expoConfig?.name || '';

  const { mutate } = useMutation({
    mutationFn: () => http.post('/auth/logout'),
    onSuccess: async () => {
      removeUser();
      router.replace('/auth');
    },
  });

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0, flex: 1 }}>
      <View className="items-center p-4">
        <Image
          source={require('../../assets/splash.png')}
          style={{ width: 100, height: 100, borderRadius: 50 }}
        />
        <Text className="mt-5 text-xl font-bold uppercase text-black">{appName}</Text>
      </View>

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
        onPress={mutate}
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
