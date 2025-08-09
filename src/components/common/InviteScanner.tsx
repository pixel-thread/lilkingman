import { useEffect, useState } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, Pressable, Dimensions } from 'react-native';
import { CameraType, CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

import { useEventContext } from '~/src/hooks/event/useEventContext';
import { useCameraAccess } from '~/src/hooks/camera/useCameraAccess';
import { Button } from '~/components/Button';
import { Text } from '~/src/components/ui/Text';

type Props = {
  open: boolean;
  onClose: () => void;
};
export const InviteScanner = ({ open, onClose }: Props) => {
  const [cameraVisible, setCameraVisible] = useState(false);

  const { isLoading, isGranted, requestPermission } = useCameraAccess();

  const [scanned, setScanned] = useState(false);

  const handleBarcodeScanned = ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;

    setScanned(true); // prevent multiple triggers

    console.log(`QR Code scanned! Type: ${type}, Data: ${data}`);
    // EXAMPLE: Navigate or fetch
    if (data.startsWith('https://')) {
    } else {
      // Process custom payload
      // E.g., JSON, ID, token, etc.
    }

    // Optional: Close camera after scan
    setTimeout(() => setCameraVisible(false), 500);
  };

  const openCamera = async () => {
    if (!isGranted) {
      await requestPermission();
    }
    setCameraVisible(true);
  };

  const closeCamera = () => {
    setCameraVisible(false);
    onClose();
  };

  useEffect(() => {
    if (open) {
      openCamera();
    }
  }, [open]);

  if (isLoading) return <View />;

  return (
    <Modal
      visible={cameraVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={closeCamera}>
      <View className="flex-1 bg-black">
        {isGranted ? (
          <View style={styles.cameraWrapper}>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing={'back'}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            />

            {/* Overlay components */}
            <View style={styles.overlay}>
              <View style={styles.scanArea}>
                <View style={styles.scanBox} />
                <Text className="mt-4 text-center text-sm font-medium text-white">
                  Position QR code inside the frame
                </Text>
              </View>
            </View>

            {/* Header with title */}
            <View style={styles.header}>
              <Text className="text-lg font-medium text-white">Scan QR Code</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={closeCamera}
                className="rounded-full bg-black/20 p-2">
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Bottom controls */}
            <View style={styles.controls}>
              {scanned && (
                <Button
                  variant="default"
                  onPress={() => setScanned(false)}
                  className="rounded-full bg-primary/90 px-6">
                  <Text className="text-white">Scan Again</Text>
                </Button>
              )}
            </View>
          </View>
        ) : (
          <View className="flex-1 items-center justify-center bg-black p-6">
            <Ionicons name="camera-outline" size={64} color="white" className="mb-4" />
            <Text className="mb-6 text-center text-xl font-medium text-white">
              Camera Access Required
            </Text>
            <Text className="mb-8 text-center text-base text-gray-300">
              We need camera access to scan QR codes and join events.
            </Text>
            <Button
              variant="default"
              onPress={requestPermission}
              className="rounded-full bg-primary px-8 py-3">
              <Text className="font-medium text-white">Grant Permission</Text>
            </Button>
            <TouchableOpacity onPress={closeCamera} className="mt-6">
              <Text className="text-gray-400">Cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');
const scanBoxSize = width * 0.7;

const styles = StyleSheet.create({
  cameraWrapper: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'black',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  scanBox: {
    width: scanBoxSize,
    height: scanBoxSize,
    borderWidth: 2,
    borderRadius: 24,
    borderColor: '#ffffff',
    backgroundColor: 'transparent',
    // Add corner indicators
    borderStyle: 'dashed',
    overflow: 'hidden',
    // Add scan animation effect
    shadowColor: '#ffffff',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  controls: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
