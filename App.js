import React, { useState, createContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_700Bold } from '@expo-google-fonts/inter';
import { db } from './src/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
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
import SupportChatScreen from './src/screens/SupportChatScreen';
import BookingDetailsScreen from './src/screens/BookingDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

export const UserContext = createContext();

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_700Bold,
  });

  const [user, setUser] = useState(null); // null = not logged in

  // Listen for user role changes in Firestore and update context only if changed
  useEffect(() => {
    if (!user?.id) return;
    const unsub = onSnapshot(doc(db, 'users', user.id), (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        // Only update if role or other critical fields changed
        if (user.role !== data.role) {
          setUser((prev) => ({ ...prev, role: data.role }));
        }
      }
    });
    return () => unsub();
  }, [user?.id, user?.role]);

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
          <Stack.Screen name="SupportChat" component={SupportChatScreen} options={{ title: 'Support Chat' }} />
          <Stack.Screen name="BookingDetails" component={BookingDetailsScreen} options={{ title: 'Booking Details' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}
