import { useState, useCallback, useEffect } from 'react';
import { Alert, Platform, ToastAndroid } from 'react-native';
import * as FileSystem from 'expo-file-system';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useImageViewModalStore } from '~/src/lib/store/useImageViewerModal';
import { logger } from '~/src/utils/logger';

const STORAGE_KEY = 'downloadDirectoryUri';

interface UseFileDownloadReturn {
  downloadFile: ({ fileUrl, type }: DownloadProps) => Promise<string | null>;
  isDownloading: boolean;
  error: Error | null;
  fileUri: string | null;
  downloadImage: () => Promise<void>;
}

const mimeMap: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  pdf: 'application/pdf',
  mp4: 'video/mp4',
  mp3: 'audio/mpeg',
};

type DownloadProps = {
  fileUrl: string;
  type: keyof typeof mimeMap;
};

export const useFileDownload = (): UseFileDownloadReturn => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [fileUri, setFileUri] = useState<string | null>(null);
  const [directoryUri, setDirectoryUri] = useState<string | null>(null);
  const { image } = useImageViewModalStore();
  // Load saved directory on mount
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then((uri) => {
      if (uri) setDirectoryUri(uri);
    });
  }, []);

  const requestFolderOnce = useCallback(async () => {
    const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
    if (!permissions.granted) throw new Error('Permission to access Downloads folder denied');

    await AsyncStorage.setItem(STORAGE_KEY, permissions.directoryUri);
    setDirectoryUri(permissions.directoryUri);
    return permissions.directoryUri;
  }, []);

  const downloadFile = useCallback(
    async ({ fileUrl, type = 'jpg' }: DownloadProps): Promise<string | null> => {
      try {
        setIsDownloading(true);
        setError(null);

        const timestamp = Date.now();
        const safeFileName = `lilkingman-${timestamp}.${type}`.replace(/[^a-zA-Z0-9._-]/g, '_');
        const mimeType = mimeMap[type] || 'application/octet-stream';
        let localPath: string | null = null;

        if (Platform.OS === 'android') {
          // Ask once if not stored
          const targetUri = directoryUri || (await requestFolderOnce());

          const tempPath = FileSystem.cacheDirectory + safeFileName;
          const downloadRes = await FileSystem.downloadAsync(fileUrl, tempPath);

          const base64 = await FileSystem.readAsStringAsync(downloadRes.uri, {
            encoding: FileSystem.EncodingType.Base64,
          });

          const createdUri = await FileSystem.StorageAccessFramework.createFileAsync(
            targetUri,
            safeFileName,
            mimeType
          );

          await FileSystem.writeAsStringAsync(createdUri, base64, {
            encoding: FileSystem.EncodingType.Base64,
          });

          localPath = createdUri;
        } else {
          localPath = FileSystem.documentDirectory + safeFileName;
          await FileSystem.downloadAsync(fileUrl, localPath);
        }

        setFileUri(localPath);
        return localPath;
      } catch (err) {
        const errorObj = err instanceof Error ? err : new Error(String(err));
        setError(errorObj);
        console.error('Download error:', errorObj.message);
        return null;
      } finally {
        setIsDownloading(false);
      }
    },
    [directoryUri, requestFolderOnce]
  );
  const downloadImage = async () => {
    logger.log({ message: 'Downloading image' });
    if (!image) return;
    try {
      await downloadFile({
        fileUrl: image.path,
        type: image.mimeType.split('/')[1],
      });
      if (Platform.OS === 'ios') {
        Alert.alert('Success', 'Image saved to Photos', [{ text: 'OK' }]);
      } else {
        ToastAndroid.show('Image saved to Gallery', ToastAndroid.SHORT);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to save image');
      console.error('Error saving image:', error);
    }
  };
  return { downloadFile, isDownloading, error, fileUri, downloadImage };
};
