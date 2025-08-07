import { useCameraPermissions, PermissionStatus } from 'expo-camera';

export function useCameraAccess() {
  const [permission, requestPermission] = useCameraPermissions();

  const isLoading = permission === null;
  const isGranted = permission?.status === PermissionStatus.GRANTED;
  const isDenied = permission?.status === PermissionStatus.DENIED;

  return {
    isLoading,
    isGranted,
    isDenied,
    requestPermission,
  };
}
