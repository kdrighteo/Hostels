import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Modal, TextInput } from 'react-native';
import colors from '../theme';
import { UserContext } from '../../App';
import { mockUser, mockBookings, mockHostels, mockRooms } from '../data/mockData';

export default function UserProfileScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext);
  const [editVisible, setEditVisible] = useState(false);
  const [editName, setEditName] = useState(user?.name || '');
  const [editEmail, setEditEmail] = useState(user?.email || '');
  const [feedback, setFeedback] = useState('');

  const handleLogout = () => {
    setUser(null);
    navigation.replace('Login');
  };

  const handleSaveProfile = () => {
    if (!editName || !editEmail) {
      setFeedback('Please fill all fields');
      return;
    }
    setUser({ ...user, name: editName, email: editEmail });
    setFeedback('Profile updated!');
    setTimeout(() => {
      setEditVisible(false);
      setFeedback('');
    }, 1000);
  };

  if (!user) return null;

  // Get user's bookings
  const userBookings = mockBookings.filter(b => b.userId === user.id);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.avatarBox}>
          {user.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatarImg} />
          ) : (
            <View style={styles.avatarInitials}>
              <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
            </View>
          )}
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
        {user.schoolId && <Text style={styles.schoolId}>School ID: {user.schoolId}</Text>}
        <TouchableOpacity style={styles.editBtn} onPress={() => {
          setEditName(user.name); setEditEmail(user.email); setEditVisible(true);
        }} accessible={true} accessibilityLabel="Edit Profile" activeOpacity={0.7}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} accessible={true} accessibilityLabel="Logout" activeOpacity={0.7}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
        {/* Booking History */}
        <View style={{ width: '100%', marginTop: 32 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.primary, marginBottom: 12 }}>Booking History</Text>
          {userBookings.length === 0 ? (
            <Text style={{ color: colors.textSecondary, fontStyle: 'italic' }}>No bookings yet.</Text>
          ) : (
            userBookings.map(b => {
              const hostel = mockHostels.find(h => h.id === b.hostelId);
              const room = mockRooms.find(r => r.id === b.roomId);
              const status = (b.status || '').toLowerCase();
              return (
                <View key={b.id} style={{ backgroundColor: colors.surface, borderRadius: 10, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={{ fontWeight: 'bold', color: colors.textPrimary, fontFamily: 'Inter_500Medium' }}>{hostel?.name || 'Hostel'} - {room?.number || 'Room'}</Text>
                    <View style={{
                      marginLeft: 10,
                      backgroundColor: status === 'approved' ? '#4CAF50' : status === 'pending' ? '#FFC107' : '#F44336',
                      borderRadius: 6,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      alignSelf: 'flex-start',
                    }}>
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>{status.charAt(0).toUpperCase() + status.slice(1)}</Text>
                    </View>
                  </View>
                  <Text style={{ color: colors.textSecondary, fontFamily: 'Inter_400Regular' }}>Date: {b.date}</Text>
                </View>
              );
            })
          )}
        </View>
        {/* Edit Profile Modal */}
        <Modal visible={editVisible} transparent animationType="slide" onRequestClose={() => setEditVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 24, width: 300 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: colors.primary }}>Edit Profile</Text>
              <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Name</Text>
              <TextInput
                style={styles.input}
                value={editName}
                onChangeText={setEditName}
                placeholder="Name"
                autoCapitalize="words"
              />
              <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Email</Text>
              <TextInput
                style={styles.input}
                value={editEmail}
                onChangeText={setEditEmail}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
              {feedback ? <Text style={{ color: feedback === 'Profile updated!' ? colors.success : colors.error, marginBottom: 8 }}>{feedback}</Text> : null}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveProfile} accessible={true} accessibilityLabel="Save profile changes" activeOpacity={0.7}><Text style={styles.saveBtnText}>Save</Text></TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditVisible(false)} accessible={true} accessibilityLabel="Cancel" activeOpacity={0.7}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
    alignItems: 'center',
    paddingTop: 32,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  avatarBox: {
    marginBottom: 18,
  },
  avatarImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarInitials: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#fff',
    fontSize: 36,
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textPrimary,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 15,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    marginBottom: 2,
  },
  schoolId: {
    fontSize: 15,
    color: colors.textSecondary,
    fontFamily: 'Inter_400Regular',
    marginBottom: 18,
  },
  editBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  editBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  logoutBtn: {
    backgroundColor: colors.error,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: colors.error,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  logoutBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  input: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  saveBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: colors.primary,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
  cancelBtn: {
    backgroundColor: colors.error,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    shadowColor: colors.error,
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  cancelBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    fontFamily: 'Inter_500Medium',
  },
}); 