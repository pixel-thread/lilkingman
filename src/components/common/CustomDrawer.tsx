import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import { usePathname, useRouter } from 'expo-router';
import { Image, View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Text } from '../ui/Text';
import Constants from 'expo-constants';
import { useMutation } from '@tanstack/react-query';
import http from '~/src/utils/http';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';
import { removeUser } from '~/src/utils/storage/user';

export type MenuItemsT = {
  id: number;
  title: string;
  herf: string;
};

const menuItems: MenuItemsT[] = [
  {
    id: 1,
    title: 'Gallery',
    herf: 'gallery',
  },
];
export function CustomDrawerContent(props: DrawerContentComponentProps) {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === 'dark';
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

      <DrawerItemList {...props} />

      {menuItems.map((item) => (
        <DrawerItem
          focused={pathname === `/${item.herf}`}
          key={item.id}
          label={item.title}
          // @ts-ignore
          onPress={() => router.push(`/${item.herf}`)}
          labelStyle={{
            textTransform: 'capitalize',
            fontWeight: 'bold',
          }}
        />
      ))}

      <DrawerItem
        label={'Logout'}
        onPress={mutate}
        labelStyle={{
          textTransform: 'capitalize',
          fontWeight: 'bold',
          color: 'white',
        }}
      />
    </DrawerContentScrollView>
  );
}
