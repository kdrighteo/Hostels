import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import colors from '../theme';
import { Ionicons } from '@expo/vector-icons';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [user] = useState({ name: 'Gilbert' });
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const unsub = onSnapshot(collection(db, 'hostels'), (snapshot) => {
      setHostels(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => {
      setError('Failed to load hostels. Please check your connection or Firestore rules.');
      setLoading(false);
    });
    return unsub;
  }, []);

  const filteredHostels = hostels.filter(h =>
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
        accessible={true}
        accessibilityLabel="Search hostel input"
      />
      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 40 }}>Loading hostels...</Text>
      ) : error ? (
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>{error}</Text>
      ) : filteredHostels.length === 0 ? (
        <View style={{ alignItems: 'center', marginTop: 60 }}>
          <Text style={{ fontSize: 48 }}>🏠</Text>
          <Text style={{ color: colors.textSecondary, fontSize: 18, marginTop: 12 }}>No hostels found. Please check back later.</Text>
        </View>
      ) : (
        <FlatList
          data={filteredHostels}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.hostelCard}
              onPress={() => navigation.navigate('HostelDetails', { hostel: item })}
              accessible={true}
              accessibilityLabel={`View details for ${item.name}`}
              activeOpacity={0.8}
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
      )}
      {/* Floating Support Button */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 32,
          right: 24,
          backgroundColor: colors.primary,
          borderRadius: 32,
          width: 56,
          height: 56,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: colors.primary,
          shadowOpacity: 0.18,
          shadowRadius: 8,
          elevation: 4,
        }}
        onPress={() => navigation.navigate('SupportChat')}
        accessible={true}
        accessibilityLabel="Open support chat"
        activeOpacity={0.8}
      >
        <Ionicons name="chatbubble-ellipses" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  welcome: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.primary,
    fontFamily: 'Inter_700Bold',
  },
  search: {
    height: 44,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: colors.surface,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
  },
  hostelCard: {
    backgroundColor: colors.surface,
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
    color: colors.textPrimary,
    fontFamily: 'Inter_700Bold',
  },
  hostelInfo: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 4,
    fontFamily: 'Inter_400Regular',
  },
  hostelDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
  },
}); 