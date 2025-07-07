import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';

export default function HostelDetailsScreen({ route, navigation }) {
  const hostel = route.params?.hostel || {
    name: 'Jubilee Hostel',
    description: 'Modern hostel for male students.',
    gender: 'Male',
    totalRooms: 50,
    amenities: 'WiFi, Laundry, Security',
    image: null,
  };

  return (
    <ScrollView style={styles.container}>
      {hostel.image && (
        <Image source={{ uri: hostel.image }} style={styles.image} />
      )}
      <Text style={styles.name}>{hostel.name}</Text>
      <Text style={styles.desc}>{hostel.description}</Text>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Gender type:</Text>
        <Text style={styles.infoValue}>{hostel.gender}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Total rooms:</Text>
        <Text style={styles.infoValue}>{hostel.totalRooms || 50}</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.infoLabel}>Amenities:</Text>
        <Text style={styles.infoValue}>{hostel.amenities || 'WiFi, Laundry, Security'}</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('RoomList', { hostel })}>
        <Text style={styles.buttonText}>View Available Rooms</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 18,
    resizeMode: 'cover',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  desc: {
    fontSize: 15,
    color: '#555',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 110,
    color: '#333',
  },
  infoValue: {
    color: '#444',
  },
  button: {
    marginTop: 28,
    backgroundColor: '#222',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
}); 