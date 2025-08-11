import { useEffect, useState } from 'react';
import { View, TouchableOpacity, Modal, StyleSheet, Dimensions, Alert } from 'react-native';
import { CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

import { useCameraAccess } from '~/src/hooks/camera/useCameraAccess';

import { Text } from '~/src/components/ui/Text';
import { Button } from '../ui/Button';
import z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import http from '~/src/utils/http';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';
import { EVENTS_ENDPOINT } from '~/src/lib/constants/endpoints/event';
import { useEventContext } from '~/src/hooks/event/useEventContext';

type Props = {
  open: boolean;
  onClose: () => void;
};

const uuidSchema = z.uuid();

export const InviteScanner = ({ open, onClose }: Props) => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [cameraVisible, setCameraVisible] = useState(false);

  const { isLoading, isGranted, requestPermission } = useCameraAccess();

  const [scanned, setScanned] = useState(false);

  const { mutate } = useMutation({
    mutationKey: ['latest-event', user],
    mutationFn: (id: string) => http.post(EVENTS_ENDPOINT.POST_ADD_EVENT_USER.replace(':id', id)),
    onSuccess: (data) => {
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['latest-event', user] });
        return;
      }
      Alert.alert('Error', data.message);
    },
  });

  const handleBarcodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned) return;

    // mark scanned immediately to avoid rapid double-fires
    setScanned(true);

    // Normalize incoming data
    const payload = data?.trim?.() ?? '';

    try {
      // Try UUID first
      const parsedUuid = uuidSchema.safeParse(payload);
      if (parsedUuid.success) {
        const id = parsedUuid.data;
        console.log(`Scanned UUID: ${id} (type: ${type})`);

        try {
          // Process invite (API call, navigation, whatever)
          mutate(id);
          // Close camera after successful processing
          setTimeout(() => setCameraVisible(false), 250);
          return;
        } catch (procErr) {
          setScanned(false);
          return;
        }
      }

      setScanned(false);
    } catch (err) {
      // Defensive catch: unexpected errors in parsing/processing
      Alert.alert('Error', 'Unexpected error occurred', [{ text: 'Close' }]);
      setScanned(false);
    }
  };

  const openCamera = async () => {
    if (!isGranted) {
      await requestPermission();
    }
    setScanned(false); // Reset each time you open
    setCameraVisible(true);
  };

  const closeCamera = () => {
    setCameraVisible(false);
    setScanned(false); // Also reset on close
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
      <View className="h-full flex-1 border border-red-500 bg-black">
        {isGranted ? (
          <View style={styles.cameraWrapper}>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing={'back'}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            />

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
