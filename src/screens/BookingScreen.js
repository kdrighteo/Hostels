import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function BookingScreen({ route, navigation }) {
  const room = route.params?.room || { name: 'Room A1', type: 'Double', price: 300, term: 'term', occupied: 2, capacity: 2 };
  const hostel = route.params?.hostel || { name: 'Jubilee Hostel' };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking - {hostel.name}</Text>
      <View style={styles.roomCard}>
        <Text style={styles.roomName}>{room.name}</Text>
        <Text style={styles.roomType}>{room.type}</Text>
        <Text style={styles.price}>${room.price}/{room.term}</Text>
        <Text style={styles.occupancy}>{room.occupied} of {room.capacity} Occupied</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Payment', { room, hostel })}>
        <Text style={styles.buttonText}>Confirm Booking</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  roomCard: {
    backgroundColor: '#f4f4f4',
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
  },
  roomType: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  price: {
    fontSize: 15,
    color: '#222',
    marginBottom: 4,
  },
  occupancy: {
    fontSize: 13,
    color: '#888',
    marginBottom: 4,
  },
  button: {
    backgroundColor: '#222',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 