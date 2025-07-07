import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, SafeAreaView } from 'react-native';
import colors from '../theme';

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
    <SafeAreaView style={styles.safeArea}>
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