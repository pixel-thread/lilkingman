import { useRef, useEffect, useState } from 'react';
import { View, Modal, Animated, StyleSheet } from 'react-native';
import { useImageViewModalStore } from '~/src/lib/store/useImageViewerModal';
import { HeaderController } from './HeaderController';
import { ButtomController } from './BottomController';
import { ImageView } from './ImageView';
import { ScreenCapturePrevent } from '../ScreenCapturePrevent';

export const ImageViewerModal = () => {
  const {
    open: modalVisible,
    image: selectedImage,
    onValueChange: onModalClose,
  } = useImageViewModalStore();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const [isAnimatingVisible, setAnimatingVisible] = useState(false);
  // Open animation
  useEffect(() => {
    if (modalVisible) {
      setAnimatingVisible(true);
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(scaleAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
      ]).start(() => {
        setAnimatingVisible(false);
      });
    }
  }, [modalVisible, fadeAnim, scaleAnim]);

  const closeModal = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      onModalClose(false); // update store
      setAnimatingVisible(false); // hide modal
      fadeAnim.setValue(0); // reset for next open
      scaleAnim.setValue(0.9);
    });
  };

  return (
    <Modal
      transparent
      visible={modalVisible || isAnimatingVisible}
      onRequestClose={closeModal}
      statusBarTranslucent
      animationType="fade">
      <Animated.View
        pointerEvents="none"
        style={[
          StyleSheet.absoluteFill,
          { opacity: fadeAnim, backgroundColor: 'rgba(0,0,0,0.95)' },
        ]}
      />

      <View style={StyleSheet.absoluteFill}>
        {selectedImage && (
          <Animated.View
            style={{
              flex: 1,
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            }}>
            <ScreenCapturePrevent>
              <ImageView />
            </ScreenCapturePrevent>
            <HeaderController onClose={closeModal} />
            <ButtomController />
          </Animated.View>
        )}
      </View>
    </Modal>
  );
};
