import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import colors from '../theme';

export default function BookingDetailsScreen({ route, navigation }) {
  const { booking, room, hostel } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Booking Details</Text>
        <View style={styles.detailBox}>
          <Text style={styles.label}>Hostel:</Text>
          <Text style={styles.value}>{hostel?.name || 'N/A'}</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.label}>Room:</Text>
          <Text style={styles.value}>{room?.name || 'N/A'}</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.label}>Type:</Text>
          <Text style={styles.value}>{room?.type || 'N/A'}</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.label}>Status:</Text>
          <Text style={styles.value}>{booking?.status || 'N/A'}</Text>
        </View>
        <View style={styles.detailBox}>
          <Text style={styles.label}>Payment:</Text>
          <Text style={[styles.value, { color: booking?.paid ? colors.success : colors.error }]}>{booking?.paid ? 'Paid' : 'Unpaid'}</Text>
        </View>
        <View style={{ marginTop: 32 }}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => alert('Cancel booking coming soon!')}>
            <Text style={styles.actionText}>Cancel Booking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background },
  container: { flex: 1, padding: 24 },
  title: { fontSize: 22, fontWeight: 'bold', color: colors.primary, marginBottom: 24 },
  detailBox: { flexDirection: 'row', marginBottom: 16 },
  label: { fontWeight: 'bold', width: 90, color: colors.textSecondary },
  value: { color: colors.textPrimary, fontSize: 16 },
  actionBtn: { backgroundColor: colors.error, padding: 14, borderRadius: 8, alignItems: 'center' },
  actionText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
}); 