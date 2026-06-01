import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { useAuthStore } from './src/store/authStore';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import BookingsScreen from './src/screens/BookingsScreen';
import MaintenanceScreen from './src/screens/MaintenanceScreen';
import FieldsScreen from './src/screens/FieldsScreen';
import ProfileScreen from './src/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
};

const AppTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Bookings') {
            iconName = 'calendar-check';
          } else if (route.name === 'Maintenance') {
            iconName = 'wrench';
          } else if (route.name === 'Fields') {
            iconName = 'soccer-field';
          } else if (route.name === 'Profile') {
            iconName = 'account';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Bookings" component={BookingsScreen} options={{ title: 'Buchungen' }} />
      <Tab.Screen name="Fields" component={FieldsScreen} options={{ title: 'Plätze' }} />
      <Tab.Screen name="Maintenance" component={MaintenanceScreen} options={{ title: 'Wartung' }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profil' }} />
    </Tab.Navigator>
  );
};

export default function App() {
  const { user, restoreToken } = useAuthStore();

  useEffect(() => {
    restoreToken();
  }, []);

  return (
    <NavigationContainer>
      {user ? <AppTabs /> : <AuthStack />}
    </NavigationContainer>
  );
}
