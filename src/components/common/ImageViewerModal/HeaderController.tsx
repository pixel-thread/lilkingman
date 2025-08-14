import { View, TouchableOpacity, Platform, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type HeaderControllerProps = {
  onClose: () => void;
};

export const HeaderController = ({ onClose: closeModal }: HeaderControllerProps) => {
  const statusBarHeight = StatusBar.currentHeight || 0;
  const insets = useSafeAreaInsets();
  const topSafeArea = Platform.OS === 'ios' ? insets.top : Math.max(insets.top, statusBarHeight);
  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        width: '100%',
        right: 0,
        top: 0,
        zIndex: 999,
        paddingTop: topSafeArea,
      }}>
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.4)', 'transparent']}
        style={{ paddingBottom: 20, paddingTop: 12 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
          }}>
          <TouchableOpacity
            onPress={closeModal}
            style={{
              height: 40,
              width: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.3)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}>
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              height: 40,
              width: 40,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 20,
              backgroundColor: 'rgba(0,0,0,0.3)',
            }}>
            <Ionicons name="information-circle-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  );
};
