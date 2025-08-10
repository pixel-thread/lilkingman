import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, View } from 'react-native';

export const TabBarIcon = (props: {
  name: React.ComponentProps<typeof Ionicons>['name'];
  color: string;
  size?: number;
  focused?: boolean;
}) => {
  const { size = 24, focused = false, name, color } = props;

  return (
    <View style={[styles.iconContainer, focused && styles.focusedContainer]}>
      <Ionicons size={size} style={styles.tabBarIcon} color={color} name={name} />
    </View>
  );
};

export const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  focusedContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  tabBarIcon: {
    marginBottom: 2,
  },
});
