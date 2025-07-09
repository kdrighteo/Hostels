import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView, Linking } from 'react-native';
import colors from '../theme';
import MapView, { Marker } from 'react-native-maps';

export default function HostelDetailsScreen({ route, navigation }) {
  const hostel = route.params?.hostel || {
    name: 'Jubilee Hostel',
    description: 'Modern hostel for male students.',
    gender: 'Male',
    totalRooms: 50,
    amenities: 'WiFi, Laundry, Security',
    image: null,
  };

  // Mock coordinates for demonstration
  const latitude = hostel.latitude || 5.6037;
  const longitude = hostel.longitude || -0.1870;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        {hostel.images && hostel.images.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 18 }}>
            {hostel.images.map((url, idx) => (
              <Image key={idx} source={{ uri: url }} style={{ width: 220, height: 140, borderRadius: 12, marginRight: 12, backgroundColor: '#eee' }} resizeMode="cover" />
            ))}
          </ScrollView>
        )}
        <Text style={styles.name}>{hostel.name}</Text>
        <Text style={styles.desc}>{hostel.description}</Text>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Gender:</Text>
          <Text style={styles.infoValue}>{hostel.gender}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Rooms Left:</Text>
          <Text style={styles.infoValue}>{hostel.roomsLeft || 'N/A'}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Price per Room:</Text>
          <Text style={styles.infoValue}>${hostel.price || 'N/A'}</Text>
        </View>
        {/* Room Types Section */}
        {hostel.roomTypes && hostel.roomTypes.length > 0 && (
          <View style={{ marginBottom: 16 }}>
            <Text style={[styles.infoLabel, { marginBottom: 4 }]}>Room Types:</Text>
            {hostel.roomTypes.map((rt, idx) => (
              <View key={idx} style={{ flexDirection: 'row', marginBottom: 2 }}>
                <Text style={[styles.infoValue, { width: 120 }]}>{rt.type}:</Text>
                <Text style={styles.infoValue}>${rt.price || 'N/A'} | {rt.roomsLeft || 0} left</Text>
              </View>
            ))}
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Address:</Text>
          <Text style={styles.infoValue}>{hostel.address}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Amenities:</Text>
          <Text style={styles.infoValue}>{hostel.amenities}</Text>
        </View>
        <View style={{ height: 180, borderRadius: 12, overflow: 'hidden', marginBottom: 18 }}>
          <MapView
            style={{ flex: 1 }}
            initialRegion={{
              latitude,
              longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            <Marker coordinate={{ latitude, longitude }} title={hostel.name} />
          </MapView>
        </View>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.secondary, marginTop: 0 }]}
          onPress={() => Linking.openURL(`https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`)}
          accessible={true}
          accessibilityLabel={`Get directions to ${hostel.name}`}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Get Directions</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('RoomList', { hostel })}
          accessible={true}
          accessibilityLabel={`View available rooms for ${hostel.name}`}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>View Available Rooms</Text>
        </TouchableOpacity>
      </ScrollView>
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
    color: colors.primary,
    fontFamily: 'Inter_700Bold',
  },
  desc: {
    fontSize: 15,
    color: colors.textSecondary,
    marginBottom: 16,
    fontFamily: 'Inter_400Regular',
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontWeight: 'bold',
    width: 110,
    color: colors.textPrimary,
    fontFamily: 'Inter_500Medium',
  },
  infoValue: {
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
  button: {
    marginTop: 28,
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
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