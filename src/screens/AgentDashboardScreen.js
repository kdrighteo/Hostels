import React, { useEffect, useState, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, SafeAreaView, ActivityIndicator } from 'react-native';
import colors from '../theme';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { UserContext } from '../../App';

const TABS = [
  { label: '📋 Assigned Bookings', key: 'bookings' },
  { label: '💬 Live Chat', key: 'chat' },
  { label: '🗺️ Directions', key: 'directions' },
];

const mockAssignedBookings = [
  { id: 'b1', user: 'Alice', hostel: 'Jubilee Hostel', room: 'A1', status: 'Pending' },
  { id: 'b2', user: 'Bob', hostel: 'Addes Hostel', room: 'B2', status: 'Confirmed' },
];

export default function AgentDashboardScreen({ navigation }) {
  const { setUser } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState(0);
  const [assignedBookings, setAssignedBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    // For demo: fetch all bookings. In real app, filter by agentId or assigned field.
    const unsub = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      setAssignedBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoading(false);
    }, (err) => {
      setError('Failed to load assigned bookings. Please check your connection or Firestore rules.');
      setLoading(false);
    });
    return unsub;
  }, []);

  const hasBookings = assignedBookings.length > 0;

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View style={styles.tabRow}>
            {TABS.map((tab, idx) => (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, activeTab === idx && styles.tabActive, idx === 0 && !hasBookings && { opacity: 0.5 }]}
                onPress={() => hasBookings || idx !== 0 ? setActiveTab(idx) : null}
                accessible={true}
                accessibilityLabel={`Switch to ${tab.label} tab`}
                activeOpacity={hasBookings || idx !== 0 ? 0.7 : 1}
                disabled={idx === 0 && !hasBookings}
              >
                <Text style={[styles.tabText, activeTab === idx && styles.tabTextActive]}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={{ marginRight: 12, backgroundColor: colors.error, paddingVertical: 8, paddingHorizontal: 18, borderRadius: 8 }} onPress={handleLogout} accessible={true} accessibilityLabel="Logout" activeOpacity={0.7}>
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Logout</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {activeTab === 0 && (
            loading ? (
              <View style={{ alignItems: 'center', marginTop: 60 }}>
                <ActivityIndicator size="large" color={colors.primary} />
                <Text style={{ color: colors.textSecondary, marginTop: 16 }}>Loading assigned bookings...</Text>
              </View>
            ) : error ? (
              <Text style={styles.placeholder}>{error}</Text>
            ) : hasBookings ? (
              <FlatList
                data={assignedBookings}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.bookingCard}>
                    <Text style={styles.bookingInfo}>{item.user || item.name} - {item.hostel || item.hostelId} ({item.room || item.roomId})</Text>
                    <Text style={styles.status}>{item.status}</Text>
                  </View>
                )}
                contentContainerStyle={{ paddingBottom: 24 }}
              />
            ) : (
              <View style={{ alignItems: 'center', marginTop: 60 }}>
                <Text style={{ fontSize: 48 }}>🧑‍💼</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 18, marginTop: 12 }}>No assigned bookings yet.</Text>
              </View>
            )
          )}
          {activeTab === 1 && (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.primary, marginBottom: 12 }}>Live Chat (Coming Soon)</Text>
              <Text style={{ color: colors.textSecondary, fontStyle: 'italic' }}>Respond to user chats here.</Text>
            </View>
          )}
          {activeTab === 2 && (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.primary, marginBottom: 12 }}>Directions (Coming Soon)</Text>
              <Text style={{ color: colors.textSecondary, fontStyle: 'italic' }}>Assist users with directions to hostels.</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, backgroundColor: colors.background, paddingTop: 32 },
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.border, marginHorizontal: 8 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderColor: colors.primary },
  tabText: { fontSize: 15, color: colors.textSecondary, fontWeight: 'bold', fontFamily: 'Inter_500Medium' },
  tabTextActive: { color: colors.primary },
  content: { flex: 1, padding: 16 },
  bookingCard: { backgroundColor: colors.surface, borderRadius: 10, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  bookingInfo: { fontSize: 15, fontWeight: 'bold', color: colors.textPrimary, fontFamily: 'Inter_500Medium' },
  status: { fontSize: 14, color: colors.primary, fontWeight: 'bold', fontFamily: 'Inter_500Medium', marginTop: 4 },
  placeholder: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginTop: 40, fontFamily: 'Inter_400Regular' },
}); 