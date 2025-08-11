import { useEffect, useState, useRef } from 'react';
import {
  View,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Alert,
  Animated,
} from 'react-native';
import { CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useCameraAccess } from '~/src/hooks/camera/useCameraAccess';
import { Text } from '~/src/components/ui/Text';
import { Button } from '../ui/Button';
import z from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import http from '~/src/utils/http';
import { useAuthContext } from '~/src/hooks/auth/useAuthContext';
import { EVENTS_ENDPOINT } from '~/src/lib/constants/endpoints/event';

type Props = {
  open: boolean;
  onClose: () => void;
};

const uuidSchema = z.uuid();

export const InviteScanner = ({ open, onClose }: Props) => {
  const { user } = useAuthContext();
  const queryClient = useQueryClient();
  const [cameraVisible, setCameraVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const { isLoading, isGranted, requestPermission } = useCameraAccess();

  const [scanned, setScanned] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Animation refs
  const scanAnimation = useRef(new Animated.Value(0)).current;
  const pulseAnimation = useRef(new Animated.Value(1)).current;
  const fadeAnimation = useRef(new Animated.Value(0)).current;

  const { mutate } = useMutation({
    mutationKey: ['latest-event', user],
    mutationFn: (id: string) => http.post(EVENTS_ENDPOINT.POST_ADD_EVENT_USER.replace(':id', id)),
    onSuccess: (data) => {
      setIsProcessing(false);
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ['latest-event', user] });
        // Success feedback
        Animated.sequence([
          Animated.timing(pulseAnimation, {
            toValue: 1.2,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnimation, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
        setTimeout(() => setCameraVisible(false), 500);
        return;
      }
      Alert.alert('Error', data.message);
    },
    onError: () => {
      setIsProcessing(false);
      Alert.alert('Error', 'Failed to join event. Please try again.');
    },
  });

  // Start scan line animation
  const startScanAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(scanAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  };

  // Start fade in animation
  const startFadeAnimation = () => {
    Animated.timing(fadeAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleBarcodeScanned = async ({ type, data }: { type: string; data: string }) => {
    if (scanned || isProcessing) return;

    setScanned(true);
    setIsProcessing(true);

    // Stop scan animation
    scanAnimation.stopAnimation();

    // Haptic feedback (if available)
    // Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const payload = data?.trim?.() ?? '';

    try {
      const parsedUuid = uuidSchema.safeParse(payload);
      if (parsedUuid.success) {
        const id = parsedUuid.data;
        console.log(`Scanned UUID: ${id} (type: ${type})`);
        mutate(id);
        return;
      }

      setScanned(false);
      setIsProcessing(false);
      Alert.alert('Invalid QR Code', 'Please scan a valid event QR code.');
    } catch (err) {
      Alert.alert('Error', 'Unexpected error occurred');
      setScanned(false);
      setIsProcessing(false);
    }
  };

  const openCamera = async () => {
    if (!isGranted) {
      await requestPermission();
      return;
    }
    setScanned(false);
    setIsProcessing(false);
    setCameraVisible(true);
    startFadeAnimation();
    setTimeout(startScanAnimation, 500);
  };

  const closeCamera = () => {
    setCameraVisible(false);
    setScanned(false);
    setIsProcessing(false);
    scanAnimation.setValue(0);
    fadeAnimation.setValue(0);
    onClose();
  };

  useEffect(() => {
    if (open) {
      openCamera();
    }
  }, [open, isGranted]);

  if (isLoading) return <View />;

  const scanLinePosition = scanAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, scanBoxSize - 4],
  });

  return (
    <Modal
      visible={cameraVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={closeCamera}
      statusBarTranslucent={true}>
      <Animated.View style={[styles.container, { opacity: fadeAnimation }]}>
        {isGranted ? (
          <View style={styles.cameraWrapper}>
            <CameraView
              style={StyleSheet.absoluteFill}
              facing={'back'}
              onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            />

            {/* Overlay with cutout */}
            <View style={styles.overlay}>
              {/* Top overlay */}
              <View
                style={[styles.overlaySection, { height: (screenHeight - scanBoxSize) / 2 - 40 }]}
              />

              {/* Middle section with scan area */}
              <View style={styles.middleSection}>
                <View style={styles.overlaySide} />
                <View style={styles.scanAreaContainer}>
                  <Animated.View
                    style={[styles.scanBox, { transform: [{ scale: pulseAnimation }] }]}>
                    {/* Corner indicators */}
                    <View style={[styles.corner, styles.topLeft]} />
                    <View style={[styles.corner, styles.topRight]} />
                    <View style={[styles.corner, styles.bottomLeft]} />
                    <View style={[styles.corner, styles.bottomRight]} />

                    {/* Scan line animation */}
                    {!scanned && (
                      <Animated.View
                        style={[styles.scanLine, { transform: [{ translateY: scanLinePosition }] }]}
                      />
                    )}
                  </Animated.View>
                </View>
                <View style={styles.overlaySide} />
              </View>

              {/* Bottom overlay */}
              <View style={styles.overlaySection}>
                <Text style={styles.instructionText}>
                  {isProcessing ? 'Processing...' : 'Position QR code inside the frame'}
                </Text>
              </View>
            </View>

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
              <View style={styles.headerContent}>
                <Text style={styles.headerTitle}>Scan QR Code</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeCamera}
                  activeOpacity={0.7}>
                  <View style={styles.closeButtonInner}>
                    <Ionicons name="close" size={24} color="white" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bottom controls */}
            <View style={[styles.controls, { paddingBottom: insets.bottom + 30 }]}>
              {scanned && !isProcessing && (
                <Button
                  variant="secondary"
                  onPress={() => {
                    setScanned(false);
                    startScanAnimation();
                  }}
                  style={styles.scanAgainButton}>
                  <Text style={styles.scanAgainText}>Scan Again</Text>
                </Button>
              )}

              {isProcessing && (
                <View style={styles.processingContainer}>
                  <Animated.View style={{ transform: [{ rotate: '0deg' }] }}>
                    <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
                  </Animated.View>
                  <Text style={styles.processingText}>Joining event...</Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View style={[styles.permissionContainer, { paddingTop: insets.top }]}>
            <View style={StyleSheet.absoluteFill} />
            <View style={styles.permissionContent}>
              <View style={styles.cameraIconContainer}>
                <Ionicons name="camera-outline" size={80} color="#666" />
              </View>
              <Text style={styles.permissionTitle}>Camera Access Required</Text>
              <Text style={styles.permissionDescription}>
                We need camera access to scan QR codes and join events.
              </Text>
              <Button variant="default" onPress={requestPermission} style={styles.grantButton}>
                <Text style={styles.grantButtonText}>Grant Permission</Text>
              </Button>
              <TouchableOpacity onPress={closeCamera} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Animated.View>
    </Modal>
  );
};

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const scanBoxSize = screenWidth * 0.7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraWrapper: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  overlaySection: {
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  middleSection: {
    flexDirection: 'row',
    height: scanBoxSize + 80,
    alignItems: 'center',
  },
  overlaySide: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  scanAreaContainer: {
    width: scanBoxSize + 80,
    height: scanBoxSize + 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanBox: {
    width: scanBoxSize,
    height: scanBoxSize,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: '#00BCD4',
    backgroundColor: 'transparent',
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 8,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#00BCD4',
    shadowColor: '#00BCD4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  instructionText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 40,
    paddingHorizontal: 40,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  closeButton: {
    padding: 4,
  },
  closeButtonInner: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  scanAgainButton: {
    borderRadius: 25,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  scanAgainText: {
    color: '#333',
    fontWeight: '600',
    fontSize: 16,
  },
  processingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  processingText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
    marginTop: 8,
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  permissionContent: {
    alignItems: 'center',
    width: '100%',
  },
  cameraIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(102,102,102,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: 'rgba(102,102,102,0.2)',
  },
  permissionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  permissionDescription: {
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  grantButton: {
    borderRadius: 25,
    paddingHorizontal: 40,
    paddingVertical: 16,
    width: '100%',
    backgroundColor: '#007AFF',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  grantButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 24,
    paddingVertical: 12,
  },
  cancelText: {
    color: '#999',
    fontSize: 16,
    fontWeight: '500',
  },
});
