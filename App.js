import React, { useState, createContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import HostelDetailsScreen from './src/screens/HostelDetailsScreen';
import RoomListScreen from './src/screens/RoomListScreen';
import BookingScreen from './src/screens/BookingScreen';
import PaymentScreen from './src/screens/PaymentScreen';
import MyBookingsScreen from './src/screens/MyBookingsScreen';
import AdminDashboardScreen from './src/screens/AdminDashboardScreen';
import SplashScreen from './src/screens/SplashScreen';
import MainTabs from './src/navigation/MainTabs';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export const UserContext = createContext();

function MainTabs() {
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
      <Tab.Screen name="Profile" component={AdminDashboardScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  const [user, setUser] = useState(null); // null = not logged in

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#222" />
      </View>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Splash">
          <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MainTabs" component={MainTabs} options={{ headerShown: false }} />
          <Stack.Screen name="HostelDetails" component={HostelDetailsScreen} />
          <Stack.Screen name="RoomList" component={RoomListScreen} />
          <Stack.Screen name="Booking" component={BookingScreen} />
          <Stack.Screen name="Payment" component={PaymentScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}
