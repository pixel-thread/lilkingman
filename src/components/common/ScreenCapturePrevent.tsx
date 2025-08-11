import { usePreventScreenCapture } from 'expo-screen-capture';
type ScreenCapturePreventProps = { children: React.ReactNode };
export const ScreenCapturePrevent = ({ children }: ScreenCapturePreventProps) => {
  usePreventScreenCapture();
  return <>{children}</>;
};
