import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRouter } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '~/src/components/ui/Text';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type CustomHeaderProps = {
  title?: string;
  showBackButton?: boolean;
  showDrawerButton?: boolean;
  showRightIcon?: boolean;
  backgroundColor?: string;
  textColor?: string;
  children?: React.ReactNode;
  rightHeader?: React.ReactNode;
};

export const CustomHeader = ({
  title = 'Event Gallery',
  showBackButton = false,
  showDrawerButton = true,
  showRightIcon = false,
  backgroundColor = '#fff',
  textColor = '#000',
  children,
  rightHeader,
}: CustomHeaderProps) => {
  const navigation = useNavigation();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleBackPress = () => {
    router.back();
  };

  const handleDrawerPress = () => {
    navigation.dispatch(DrawerActions.toggleDrawer());
  };

  return (
    <>
      <View style={[styles.container, { backgroundColor, paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          {/* Left side - Back or Drawer button */}
          <View style={styles.leftContainer}>
            {showBackButton ? (
              <TouchableOpacity onPress={handleBackPress} style={styles.iconButton}>
                <Ionicons name="arrow-back" size={24} color={textColor} />
              </TouchableOpacity>
            ) : showDrawerButton ? (
              <TouchableOpacity onPress={handleDrawerPress} style={styles.iconButton}>
                <Ionicons name="menu" size={24} color={textColor} />
              </TouchableOpacity>
            ) : (
              <View style={styles.iconPlaceholder} />
            )}
          </View>

          {/* Middle - Title */}
          <View style={styles.titleContainer}>
            {children || (
              <Text
                className="capitalize"
                style={[styles.title, { color: textColor }]}
                numberOfLines={2}>
                {title}
              </Text>
            )}
          </View>

          {/* Right side - Optional icon */}
          <View style={styles.rightContainer}>
            {showRightIcon ? <>{rightHeader}</> : <View style={styles.iconPlaceholder} />}
          </View>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 1000,
    backgroundColor: '#000',
  },
  headerContent: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  iconButton: {
    padding: 8,
  },
  iconPlaceholder: {
    width: 24,
    height: 24,
  },
});
