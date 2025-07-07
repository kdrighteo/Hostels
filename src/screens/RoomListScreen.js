import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Animated } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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

  const groupedRooms = groupByFloor(mockRooms);

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
        >
          <MaterialIcons
            name={isAvailable ? 'event-available' : 'event-busy'}
            size={28}
            color={isAvailable ? '#2ecc40' : '#ff4136'}
          />
          <Text style={styles.roomName}>{item.name}</Text>
          <Text style={styles.roomType}>{item.type}</Text>
          <Text style={styles.occupancy}>{item.occupied} / {item.capacity}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Room Map{hostel ? ` - ${hostel.name}` : ''}</Text>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <MaterialIcons name="event-available" size={20} color="#2ecc40" />
          <Text style={styles.legendText}>Available</Text>
        </View>
        <View style={styles.legendItem}>
          <MaterialIcons name="event-busy" size={20} color="#ff4136" />
          <Text style={styles.legendText}>Taken</Text>
        </View>
      </View>
      {Object.keys(groupedRooms).sort((a, b) => a - b).map(floor => (
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
      ))}
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
    marginBottom: 10,
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
    color: '#555',
  },
  floorSection: {
    marginBottom: 18,
  },
  floorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#007bff',
  },
  roomBox: {
    flex: 1,
    backgroundColor: '#f4f4f4',
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
    borderColor: '#2ecc40',
  },
  taken: {
    borderWidth: 2,
    borderColor: '#ff4136',
    opacity: 0.6,
  },
  selected: {
    borderColor: '#007bff',
    borderWidth: 3,
  },
  roomName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 6,
  },
  roomType: {
    fontSize: 13,
    color: '#555',
    marginBottom: 2,
  },
  occupancy: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
}); 