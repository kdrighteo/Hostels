import React, { useEffect, useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import colors from '../theme';
import * as Notifications from 'expo-notifications';
import { UserContext } from '../../App';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';

export default function BookingScreen({ route, navigation }) {
  const room = route.params?.room || { name: 'Room A1', type: 'Double', price: 300, term: 'term', occupied: 2, capacity: 2 };
  const hostel = route.params?.hostel || { name: 'Jubilee Hostel' };
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      await Notifications.requestPermissionsAsync();
    })();
  }, []);

  const handleBooking = async () => {
    setLoading(true);
    try {
      // Send local notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Booking Confirmed',
          body: `Your booking for ${room.name} at ${hostel.name} is confirmed!`,
        },
        trigger: null,
      });
      // Add booking to Firestore
      const bookingRef = await addDoc(collection(db, 'bookings'), {
        userId: user?.id || '',
        hostelId: hostel.id,
        roomId: room.id,
        status: 'Pending',
        date: new Date().toISOString(),
        name: user?.name || '',
        email: user?.email || '',
        paid: false,
      });
      Toast.show({ type: 'success', text1: 'Booking Confirmed', text2: `Your booking for ${room.name} is confirmed!` });
      setLoading(false);
      navigation.navigate('Payment', { room, hostel, bookingId: bookingRef.id });
    } catch (err) {
      setLoading(false);
      Toast.show({ type: 'error', text1: 'Booking Failed', text2: err.message });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Booking - {hostel.name}</Text>
        <View style={styles.roomCard}>
          <Text style={styles.roomName}>{room.name}</Text>
          <Text style={styles.roomType}>{room.type}</Text>
          <Text style={styles.price}>${room.price}/{room.term}</Text>
          <Text style={styles.occupancy}>{room.occupied} of {room.capacity} Occupied</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={handleBooking}
          accessible={true}
          accessibilityLabel={`Confirm booking for ${room.name}`}
          disabled={loading}
        >
          <Text style={styles.buttonText}>{loading ? 'Booking...' : 'Confirm Booking'}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    paddingTop: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.primary,
    fontFamily: 'Inter_700Bold',
  },
  roomCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  roomName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: 'Inter_700Bold',
  },
  roomType: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    fontFamily: 'Inter_400Regular',
  },
  price: {
    fontSize: 15,
    color: colors.primary,
    marginBottom: 4,
    fontFamily: 'Inter_500Medium',
  },
  occupancy: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 4,
    fontFamily: 'Inter_400Regular',
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
}); 