import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Skeleton } from '~/src/components/ui/Skeleton';

type CustomLoadingHeaderProps = {
  backgroundColor?: string;
};

export const CustomLoadingHeader = ({ backgroundColor = '#fff' }: CustomLoadingHeaderProps) => {
  const insets = useSafeAreaInsets();

  return (
    <>
      <StatusBar style="dark" />
      <View style={[styles.container, { backgroundColor, paddingTop: insets.top }]}>
        <View style={styles.headerContent}>
          {/* Left side - Drawer button skeleton */}
          <View style={styles.leftContainer}>
            <Skeleton className="h-8 w-8 rounded-full" />
          </View>

          {/* Middle - Title skeleton */}
          <View style={styles.titleContainer}>
            <Skeleton className="h-6 w-32 rounded-md" />
          </View>

          {/* Right side - Optional icon skeleton */}
          <View style={styles.rightContainer}>
            <Skeleton className="h-8 w-8 rounded-full" />
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 1000,
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
});
