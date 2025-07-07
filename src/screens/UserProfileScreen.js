import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Image, Modal } from 'react-native';
import colors from '../theme';
import { UserContext } from '../context/UserContext';

export default function UserProfileScreen({ navigation }) {
  const { user, setUser } = useContext(UserContext);
  const [editVisible, setEditVisible] = useState(false);

  const handleLogout = () => {
    setUser(null);
    navigation.replace('Login');
  };

  if (!user) return null;

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
        <TouchableOpacity style={styles.editBtn} onPress={() => setEditVisible(true)} accessible={true} accessibilityLabel="Edit Profile" activeOpacity={0.7}>
          <Text style={styles.editBtnText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} accessible={true} accessibilityLabel="Logout" activeOpacity={0.7}>
          <Text style={styles.logoutBtnText}>Logout</Text>
        </TouchableOpacity>
        <Modal visible={editVisible} transparent animationType="slide" onRequestClose={() => setEditVisible(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 24, width: 300 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16, color: colors.primary }}>Edit Profile (Coming Soon)</Text>
              <TouchableOpacity style={styles.editBtn} onPress={() => setEditVisible(false)}><Text style={styles.editBtnText}>Close</Text></TouchableOpacity>
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
}); 