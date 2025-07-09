import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import colors from '../theme';
import { Inter_700Bold, Inter_400Regular, Inter_500Medium } from '@expo-google-fonts/inter';
import { useEffect, useState, useContext } from 'react';
import { db } from '../firebase';
import { collection, query, where, onSnapshot, getDocs } from 'firebase/firestore';
import { UserContext } from '../../App';

const mockBookings = [
  { id: '1', room: 'Room A1', type: 'Double', status: 'Pending', paid: true },
  { id: '2', room: 'Room D4', type: '4-m 1', status: 'Approved', paid: true },
  { id: '3', room: 'Room A11', type: 'Double', status: 'Pending', paid: false },
];

export default function MyBookingsScreen({ navigation, bookings: propBookings }) {
  const { user } = useContext(UserContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [hostels, setHostels] = useState([]);

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (!user?.id) return;
    const q = query(collection(db, 'bookings'), where('userId', '==', user.id));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(fetched);
      console.log('Fetched bookings for user:', user.id, fetched);
      setLoading(false);
    }, (err) => {
      setError('Failed to load bookings. Please check your connection or Firestore rules.');
      setLoading(false);
    });

    // Fetch all rooms
    const unsubRooms = onSnapshot(collection(db, 'rooms'), (snapshot) => {
      const fetchedRooms = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRooms(fetchedRooms);
      console.log('Fetched rooms:', fetchedRooms);
    });
    // Fetch all hostels
    const unsubHostels = onSnapshot(collection(db, 'hostels'), (snapshot) => {
      const fetchedHostels = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setHostels(fetchedHostels);
      console.log('Fetched hostels:', fetchedHostels);
    });
    return () => {
      unsub();
      unsubRooms();
      unsubHostels();
    };
  }, [user?.id]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>My Bookings</Text>
        {loading ? (
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ color: colors.textSecondary, marginTop: 16 }}>Loading bookings...</Text>
          </View>
        ) : error ? (
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>
        ) : bookings.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ fontSize: 48 }}>📄</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 18, marginTop: 12 }}>No bookings yet. Start by booking a room!</Text>
          </View>
        ) : (
          <FlatList
            data={bookings}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const room = rooms.find(r => r.id === item.roomId);
              const hostel = hostels.find(h => h.id === item.hostelId);
              if (!room) console.warn('Room not found for booking:', item);
              if (!hostel) console.warn('Hostel not found for booking:', item);
              return (
                <TouchableOpacity
                  style={styles.bookingCard}
                  onPress={() => navigation.navigate('BookingDetails', { booking: item, room, hostel })}
                  activeOpacity={0.8}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{(room?.name || item.room || item.roomId || '?')[0]}</Text>
                    </View>
                    <Text style={styles.roomName}>{room?.name || item.room || item.roomId || 'Room (not found)'}</Text>
                    <Text style={styles.roomType}>{room?.type || item.type || ''}</Text>
                  </View>
                  <Text style={{ color: '#888', marginTop: 2, marginBottom: 2 }}>{hostel?.name || 'Hostel (not found)'}</Text>
                  <View style={styles.statusRow}>
                    <Text style={styles.status}>{item.status || 'Pending'}</Text>
                    <Text style={[styles.paid, { color: item.paid ? 'green' : 'red' }]}>{item.paid ? 'Paid' : 'Unpaid'}</Text>
                  </View>
                  <View style={styles.manageRow}>
                    <TouchableOpacity
                      style={styles.manageBtn}
                      accessible={true}
                      accessibilityLabel={`Manage booking for ${room?.name || item.room || item.roomId || 'Room (not found)'}`}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.manageText}>Manage Room</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              );
            }}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}
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