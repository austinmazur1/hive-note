import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Tabs } from 'expo-router';

const Layout = () => {
    return (
      <Tabs
        screenOptions={{
          tabBarLabelStyle: {
            fontSize: 9,
            fontWeight: '600',
          },
        }}>
        <Tabs.Screen
          name="home/index"
          options={{
            title: 'Home',
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="home" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="collections"
          options={{
            title: 'Collections',
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons name={focused ? 'library' : 'library-outline'} color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings/index"
          options={{
            title: 'Settings',
            headerShown: false,
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? 'settings' : 'settings-outline'}
                color={color}
                size={size}
              />
            ),
          }}
        />
      </Tabs>
    );
  };
  export default Layout;
  