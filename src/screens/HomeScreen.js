import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image } from 'react-native';

const mockHostels = [
  { id: '1', name: 'Jubilee Hostel', gender: 'Male', roomsLeft: 12, description: 'Modern hostel for male students.', image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80' },
  { id: '2', name: 'Addes Hostel', gender: 'Female', roomsLeft: 8, description: 'Comfortable hostel for female students.', image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80' },
  { id: '3', name: 'Hoo Red Hetal', gender: 'Mixed', roomsLeft: 5, description: 'Mixed hostel with great amenities.', image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=400&q=80' },
];

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [user] = useState({ name: 'Gilbert' });

  const filteredHostels = mockHostels.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.welcome}>Welcome, {user.name} 👋</Text>
      <TextInput
        style={styles.search}
        placeholder="Search hostel"
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredHostels}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.hostelCard}
            onPress={() => navigation.navigate('HostelDetails', { hostel: item })}
          >
            <Image source={{ uri: item.image }} style={styles.hostelImage} />
            <View style={styles.hostelDetails}>
              <Text style={styles.hostelName}>{item.name}</Text>
              <Text style={styles.hostelInfo}>Gender: {item.gender} | {item.roomsLeft} Rooms Left</Text>
              <Text style={styles.hostelDesc}>{item.description}</Text>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  search: {
    height: 44,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  hostelCard: {
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  hostelImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  hostelDetails: {
    padding: 14,
  },
  hostelName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  hostelInfo: {
    fontSize: 14,
    color: '#555',
    marginBottom: 4,
  },
  hostelDesc: {
    fontSize: 13,
    color: '#888',
  },
}); 