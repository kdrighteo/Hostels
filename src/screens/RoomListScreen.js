import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated, SafeAreaView, ActivityIndicator, Image, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import colors from '../theme';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

const mockRooms = [
  { id: 'A1', name: 'Room A1', type: 'Double', price: 300, term: 'term', occupied: 2, capacity: 2, floor: 1 },
  { id: 'D4', name: 'Room D4', type: '4-m 1', price: 300, term: 'term', occupied: 3, capacity: 4, floor: 1 },
  { id: 'A11', name: 'Room A11', type: 'Double', price: 300, term: 'term', occupied: 1, capacity: 2, floor: 2 },
  { id: 'B2', name: 'Room B2', type: 'Double', price: 300, term: 'term', occupied: 2, capacity: 2, floor: 2 },
  { id: 'C3', name: 'Room C3', type: 'Single', price: 350, term: 'term', occupied: 0, capacity: 1, floor: 3 },
  { id: 'D5', name: 'Room D5', type: 'Single', price: 350, term: 'term', occupied: 1, capacity: 1, floor: 3 },
];

function groupByFloor(rooms) {
  const grouped = {};
  rooms.forEach(room => {
    if (!grouped[room.floor]) grouped[room.floor] = [];
    grouped[room.floor].push(room);
  });
  return grouped;
}

export default function RoomListScreen({ route, navigation }) {
  const hostel = route.params?.hostel;
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [animation] = useState(new Animated.Value(1));
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    if (!hostel?.id) return;
    const q = query(collection(db, 'rooms'), where('hostelId', '==', hostel.id));
    const unsub = onSnapshot(q, (snapshot) => {
      setRooms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => {
      setError('Failed to load rooms. Please check your connection or Firestore rules.');
      setLoading(false);
    });
    return unsub;
  }, [hostel?.id]);

  const groupedRooms = groupByFloor(rooms);

  const handleSelectRoom = (room) => {
    setSelectedRoomId(room.id);
    Animated.sequence([
      Animated.timing(animation, { toValue: 1.1, duration: 120, useNativeDriver: true }),
      Animated.timing(animation, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start(() => {
      navigation.navigate('Booking', { room, hostel });
    });
  };

  const renderRoom = (item) => {
    const isAvailable = item.occupied < item.capacity;
    const isSelected = selectedRoomId === item.id;
    return (
      <Animated.View style={{ flex: 1, transform: [{ scale: isSelected ? animation : 1 }] }}>
        <TouchableOpacity
          style={[styles.roomBox, isAvailable ? styles.available : styles.taken, isSelected && styles.selected]}
          disabled={!isAvailable}
          onPress={() => isAvailable && handleSelectRoom(item)}
          accessible={true}
          accessibilityLabel={isAvailable ? `Book ${item.name}` : `${item.name} is taken`}
          activeOpacity={0.8}
        >
          {item.images && item.images.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 6 }}>
              {item.images.map((url, idx) => (
                <Image key={idx} source={{ uri: url }} style={{ width: 80, height: 60, borderRadius: 8, marginRight: 8, backgroundColor: '#eee' }} resizeMode="cover" />
              ))}
            </ScrollView>
          )}
          <Text style={styles.roomName}>{item.name}</Text>
          <Text style={styles.roomType}>{item.type}</Text>
          <Text style={styles.occupancy}>{item.occupied} / {item.capacity}</Text>
          {item.condition && <Text style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Condition: {item.condition}</Text>}
          {item.notes && <Text style={{ color: '#888', fontSize: 13, marginTop: 2 }}>Notes: {item.notes}</Text>}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Room Map{hostel ? ` - ${hostel.name}` : ''}</Text>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <MaterialIcons name="event-available" size={20} color={colors.success} />
            <Text style={styles.legendText}>Available</Text>
          </View>
          <View style={styles.legendItem}>
            <MaterialIcons name="event-busy" size={20} color={colors.error} />
            <Text style={styles.legendText}>Taken</Text>
          </View>
        </View>
        {loading ? (
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={{ color: colors.textSecondary, marginTop: 16 }}>Loading rooms...</Text>
          </View>
        ) : error ? (
          <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>
        ) : Object.keys(groupedRooms).length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 60 }}>
            <Text style={{ fontSize: 48 }}>🛏️</Text>
            <Text style={{ color: colors.textSecondary, fontSize: 18, marginTop: 12 }}>No rooms found. Please check back later.</Text>
          </View>
        ) : (
          Object.keys(groupedRooms).sort((a, b) => a - b).map(floor => (
            <View key={floor} style={styles.floorSection}>
              <Text style={styles.floorTitle}>Floor {floor}</Text>
              <FlatList
                data={groupedRooms[floor]}
                keyExtractor={item => item.id}
                renderItem={({ item }) => renderRoom(item)}
                numColumns={2}
                columnWrapperStyle={{ justifyContent: 'space-between' }}
                contentContainerStyle={{ paddingBottom: 8, paddingTop: 4 }}
              />
            </View>
          ))
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primary,
    fontFamily: 'Inter_700Bold',
  },
  legendRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 18,
  },
  legendText: {
    marginLeft: 4,
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  floorSection: {
    marginBottom: 18,
  },
  floorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: colors.secondary,
    fontFamily: 'Inter_700Bold',
  },
  roomBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  available: {
    borderWidth: 2,
    borderColor: colors.success,
  },
  taken: {
    borderWidth: 2,
    borderColor: colors.error,
    opacity: 0.6,
  },
  selected: {
    borderColor: colors.primary,
    borderWidth: 3,
  },
  roomName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 6,
    color: colors.textPrimary,
    fontFamily: 'Inter_700Bold',
  },
  roomType: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 2,
    fontFamily: 'Inter_400Regular',
  },
  occupancy: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
    fontFamily: 'Inter_400Regular',
  },
}); 