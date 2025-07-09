import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import AdminDashboardScreen from '../screens/AdminDashboardScreen';
import AgentDashboardScreen from '../screens/AgentDashboardScreen';
import UserProfileScreen from '../screens/UserProfileScreen';
import { UserContext } from '../../App';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  const { user } = useContext(UserContext);
  if (user?.role === 'admin') {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="Admin" component={AdminDashboardScreen} />
      </Tab.Navigator>
    );
  } else if (user?.role === 'agent') {
    return (
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarStyle: { display: 'none' } }}>
        <Tab.Screen name="Agent" component={AgentDashboardScreen} />
      </Tab.Navigator>
    );
  } else {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: true,
          tabBarActiveTintColor: '#222',
          tabBarInactiveTintColor: '#aaa',
          tabBarStyle: {
            backgroundColor: '#fff',
            borderTopWidth: 1,
            borderTopColor: '#eee',
            height: 62,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarIcon: ({ color, size, focused }) => {
            if (route.name === 'Home') {
              return <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />;
            } else if (route.name === 'Bookings') {
              return <MaterialIcons name={focused ? 'book' : 'book'} size={24} color={color} />;
            } else if (route.name === 'Profile') {
              return <Ionicons name={focused ? 'person' : 'person-outline'} size={24} color={color} />;
            }
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Bookings" component={MyBookingsScreen} />
        <Tab.Screen name="Profile" component={UserProfileScreen} />
      </Tab.Navigator>
    );
  }
} 