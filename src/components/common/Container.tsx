import { SafeAreaView } from 'react-native';
import type { ReactElement } from 'react';

export const Container = ({ children }: { children: ReactElement | ReactElement[] }) => {
  return <SafeAreaView className="flex flex-1">{children}</SafeAreaView>;
};
