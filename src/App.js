import { useEffect, useState } from 'react';
import { db } from './src/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';
import { View, Text } from 'react-native';
import Toast from 'react-native-toast-message';

export default function App() {
  const [firebaseConnected, setFirebaseConnected] = useState(true);

  useEffect(() => {
    // Check Firestore connection on app start
    const checkConnection = async () => {
      try {
        await getDocs(collection(db, 'hostels'));
        setFirebaseConnected(true);
      } catch (err) {
        setFirebaseConnected(false);
      }
    };
    checkConnection();
  }, []);

  return (
    <NavigationContainer>
      {!firebaseConnected && (
        <View style={{ backgroundColor: '#ff5252', padding: 8 }}>
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
            Firebase not connected! Check your internet or Firestore rules.
          </Text>
        </View>
      )}
      <Toast />
    </NavigationContainer>
  );
} 