import AntDesign from '@expo/vector-icons/AntDesign';
import { StyleSheet } from 'react-native';

export const TabBarIcon = (props: {
  name: React.ComponentProps<typeof AntDesign>['name'];
  color: string;
}) => {
  return <AntDesign size={28} style={styles.tabBarIcon} {...props} />;
};

export const styles = StyleSheet.create({
  tabBarIcon: {
    marginBottom: -3,
  },
});
