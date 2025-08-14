import { View, ScrollView, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text } from '~/src/components/ui/Text';
import { Button } from '~/src/components/ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/src/components/ui/Card';
import { Separator } from '~/src/components/ui/Separator';

export const AboutScreen = () => {
  const insets = useSafeAreaInsets();

  const handleContactSupport = () => {
    // TODO: Implement contact support functionality
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{
        paddingBottom: insets.bottom + 20,
      }}>
      <View className="p-6">
        {/* App Info Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>About Lilkingman</CardTitle>
            <CardDescription>Version 1.0.0</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <View className="space-y-4">
              <Text className="text-base text-foreground">
                Lilkingman is an event-based photo sharing app that allows you to create and join
                events, capture moments, and share them with other participants in real-time.
              </Text>
              <Text className="text-base text-foreground">
                Create an event, invite your friends via QR code or email, and start building a
                shared gallery of memories together.
              </Text>
            </View>
          </CardContent>
        </Card>

        {/* Features Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Features</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <View className="gap-y-5">
              <View className="flex-row items-start gap-x-3">
                <Ionicons name="camera-outline" size={24} color="#6b7280" />
                <View className="flex-1">
                  <Text className="font-medium text-foreground">Photo Capture</Text>
                  <Text className="text-muted-foreground">
                    Take photos directly within the app and share them instantly with event
                    participants.
                  </Text>
                </View>
              </View>

              <Separator />

              <View className="flex-row items-start gap-x-3">
                <Ionicons name="people-outline" size={24} color="#6b7280" />
                <View className="flex-1">
                  <Text className="font-medium text-foreground">Event Creation</Text>
                  <Text className="text-muted-foreground">
                    Create events and invite friends to join using QR codes or email invitations.
                  </Text>
                </View>
              </View>

              <Separator />

              <View className="flex-row items-start gap-x-3">
                <Ionicons name="images-outline" size={24} color="#6b7280" />
                <View className="flex-1">
                  <Text className="font-medium text-foreground">Shared Gallery</Text>
                  <Text className="text-muted-foreground">
                    View all photos from an event in a shared gallery accessible to all
                    participants.
                  </Text>
                </View>
              </View>

              <Separator />

              <View className="flex-row items-start gap-x-3">
                <Ionicons name="download-outline" size={24} color="#6b7280" />
                <View className="flex-1">
                  <Text className="font-medium text-foreground">Save Photos</Text>
                  <Text className="text-muted-foreground">
                    Download photos from events to your device&apos;s gallery.
                  </Text>
                </View>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Contact Section */}
        <Card>
          <CardHeader>
            <CardTitle>Contact & Support</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <Text className="mb-4 text-base text-foreground">
              Have questions or need assistance? Reach out to our support team or visit our website
              for more information.
            </Text>
          </CardContent>
          <CardFooter className="flex-row gap-x-4">
            <Button
              variant="outline"
              className="flex-1 flex-row items-center justify-center gap-x-2"
              onPress={handleContactSupport}>
              <Ionicons name="mail-outline" size={20} color="#6b7280" />
              <Text>Contact Support</Text>
            </Button>
          </CardFooter>
        </Card>

        {/* Built by Pixelthread */}
        <View className="mt-8 items-center">
          <Text className="text-sm font-medium text-foreground">Built by</Text>
          <View className="my-2">
            <Text className="text-base font-bold text-foreground">Pixelthread</Text>
          </View>
          <Text className="text-xs text-muted-foreground">Quality Mobile & Web Applications</Text>
        </View>

        {/* Copyright */}
        <View className="mt-4 items-center">
          <Text className="text-sm text-muted-foreground">
            © 2024 Lilkingman. All rights reserved.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default AboutScreen;
