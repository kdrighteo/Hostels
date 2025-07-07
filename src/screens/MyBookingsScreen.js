import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import colors from '../theme';
import { Inter_700Bold, Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';

const mockBookings = [
  { id: '1', room: 'Room A1', type: 'Double', status: 'Pending', paid: true },
  { id: '2', room: 'Room D4', type: '4-m 1', status: 'Approved', paid: true },
  { id: '3', room: 'Room A11', type: 'Double', status: 'Pending', paid: false },
];

export default function MyBookingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Bookings</Text>
      <FlatList
        data={mockBookings}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.bookingCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.roomName}>{item.room}</Text>
              <Text style={styles.roomType}>{item.type}</Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.status}>{item.status}</Text>
              <Text style={[styles.paid, { color: item.paid ? 'green' : 'red' }]}>{item.paid ? 'Paid' : 'Unpaid'}</Text>
            </View>
            <View style={styles.manageRow}>
              <TouchableOpacity style={styles.manageBtn}><Text style={styles.manageText}>Manage Room</Text></TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.primary,
    fontFamily: 'Inter_700Bold',
  },
  bookingCard: {
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 16,
    marginBottom: 14,
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
    fontFamily: 'Inter_400Regular',
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  status: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: 'bold',
    fontFamily: 'Inter_500Medium',
  },
  paid: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Inter_500Medium',
  },
  manageRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
  manageBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.primary,
    borderRadius: 6,
    shadowColor: colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  manageText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Inter_500Medium',
  },
}); 