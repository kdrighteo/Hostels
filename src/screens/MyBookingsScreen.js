import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView } from 'react-native';
import colors from '../theme';
import { Inter_700Bold, Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';

const mockBookings = [
  { id: '1', room: 'Room A1', type: 'Double', status: 'Pending', paid: true },
  { id: '2', room: 'Room D4', type: '4-m 1', status: 'Approved', paid: true },
  { id: '3', room: 'Room A11', type: 'Double', status: 'Pending', paid: false },
];

export default function MyBookingsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>My Bookings</Text>
        <FlatList
          data={mockBookings}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.bookingCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{item.room.charAt(0)}</Text>
                </View>
                <Text style={styles.roomName}>{item.room}</Text>
                <Text style={styles.roomType}>{item.type}</Text>
              </View>
              <View style={styles.statusRow}>
                <Text style={styles.status}>{item.status}</Text>
                <Text style={[styles.paid, { color: item.paid ? 'green' : 'red' }]}>{item.paid ? 'Paid' : 'Unpaid'}</Text>
              </View>
              <View style={styles.manageRow}>
                <TouchableOpacity
                  style={styles.manageBtn}
                  accessible={true}
                  accessibilityLabel={`Manage booking for ${item.room}`}
                  activeOpacity={0.7}
                >
                  <Text style={styles.manageText}>Manage Room</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 24 }}
        />
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
    paddingHorizontal: 16,
    paddingTop: 32,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
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