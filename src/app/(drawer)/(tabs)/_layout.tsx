import { Tabs } from 'expo-router';
import { CustomHeader } from '~/src/components/common/CustomHeader';
import { CustomTabBar } from '~/src/components/common/CustomTabBar';
import { TabBarIcon } from '~/src/components/common/TabBarIcon';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        tabBarShowLabel: true,
        header: ({ options }) => (
          <CustomHeader
            title={options.title}
            showRightIcon={true}
            rightIconName="camera-outline"
            onRightIconPress={() => {
              console.log('Camera button pressed');
            }}
          />
        ),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Event',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="images"
        options={{
          title: 'Gallery',
          tabBarIcon: ({ color }) => <TabBarIcon name="images" color={color} />,
        }}
      />
    </Tabs>
  );
}
