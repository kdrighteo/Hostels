import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Alert, SafeAreaView, Image } from 'react-native';
import colors from '../theme';
import { mockHostels, mockRooms, mockBookings, mockPayments } from '../data/mockData';

const TABS = [
  { label: '📊 Overview', key: 'overview' },
  { label: '🏠 Manage Hostels', key: 'hostels' },
  { label: '🚪 Manage Rooms', key: 'rooms' },
  { label: '📆 Approve Bookings', key: 'bookings' },
  { label: '💳 Payment Records', key: 'payments' },
];

export default function AdminDashboardScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [hostels, setHostels] = useState(mockHostels);
  const [bookings, setBookings] = useState(mockBookings);
  const [rooms, setRooms] = useState(mockRooms);
  const [payments, setPayments] = useState(mockPayments);
  const [modalVisible, setModalVisible] = useState(false);
  const [editHostel, setEditHostel] = useState(null);
  const [hostelForm, setHostelForm] = useState({ name: '', gender: '', rooms: '' });
  const [roomModalVisible, setRoomModalVisible] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({ hostelId: '', name: '', type: '', price: '', capacity: '', occupied: '' });
  const [roomHostelFilter, setRoomHostelFilter] = useState('');

  // Hostels CRUD
  const openAddHostel = () => {
    setEditHostel(null);
    setHostelForm({ name: '', gender: '', rooms: '' });
    setModalVisible(true);
  };
  const openEditHostel = (hostel) => {
    setEditHostel(hostel);
    setHostelForm({ name: hostel.name, gender: hostel.gender, rooms: String(hostel.rooms) });
    setModalVisible(true);
  };
  const saveHostel = () => {
    if (!hostelForm.name || !hostelForm.gender || !hostelForm.rooms) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (editHostel) {
      setHostels(hostels.map(h => h.id === editHostel.id ? { ...editHostel, ...hostelForm, rooms: Number(hostelForm.rooms) } : h));
    } else {
      setHostels([...hostels, { id: Date.now().toString(), ...hostelForm, rooms: Number(hostelForm.rooms) }]);
    }
    setModalVisible(false);
  };
  const deleteHostel = (id) => {
    setHostels(hostels.filter(h => h.id !== id));
  };

  // Bookings
  const approveBooking = (id) => {
    setBookings(bookings.map(b => b.id === id ? { ...b, status: 'Approved' } : b));
  };
  const rejectBooking = (id) => {
    setBookings(bookings.filter(b => b.id !== id));
  };

  // Room CRUD
  const openAddRoom = () => {
    setEditRoom(null);
    setRoomForm({ hostelId: '', name: '', type: '', price: '', capacity: '', occupied: '' });
    setRoomModalVisible(true);
  };
  const openEditRoom = (room) => {
    setEditRoom(room);
    setRoomForm({
      hostelId: room.hostelId,
      name: room.name,
      type: room.type,
      price: String(room.price),
      capacity: String(room.capacity),
      occupied: String(room.occupied),
    });
    setRoomModalVisible(true);
  };
  const saveRoom = () => {
    if (!roomForm.hostelId || !roomForm.name || !roomForm.type || !roomForm.price || !roomForm.capacity) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (editRoom) {
      setRooms(rooms.map(r => r.id === editRoom.id ? { ...editRoom, ...roomForm, price: Number(roomForm.price), capacity: Number(roomForm.capacity), occupied: Number(roomForm.occupied) || 0 } : r));
    } else {
      setRooms([...rooms, { id: Date.now().toString(), ...roomForm, price: Number(roomForm.price), capacity: Number(roomForm.capacity), occupied: Number(roomForm.occupied) || 0 }]);
    }
    setRoomModalVisible(false);
  };
  const deleteRoom = (id) => {
    setRooms(rooms.filter(r => r.id !== id));
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.tabRow}>
          {TABS.map((tab, idx) => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, activeTab === idx && styles.tabActive]}
              onPress={() => setActiveTab(idx)}
              accessible={true}
              accessibilityLabel={`Switch to ${tab.label} tab`}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === idx && styles.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.content}>
          {activeTab === 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16 }}>
              <View style={styles.card}>
                <Text style={styles.cardValue}>{hostels.length}</Text>
                <Text style={styles.cardLabel}>Hostels</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardValue}>{rooms.length}</Text>
                <Text style={styles.cardLabel}>Rooms</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardValue}>{bookings.filter(b => b.status === 'pending').length}</Text>
                <Text style={styles.cardLabel}>Pending Bookings</Text>
              </View>
              <View style={styles.card}>
                <Text style={styles.cardValue}>
                  ${payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0)}
                </Text>
                <Text style={styles.cardLabel}>Total Paid</Text>
              </View>
            </View>
          )}
          {activeTab === 1 && (
            <View style={{ flex: 1 }}>
              <TouchableOpacity style={styles.addBtn} onPress={openAddHostel}>
                <Text style={styles.addBtnText}>+ Add Hostel</Text>
              </TouchableOpacity>
              <FlatList
                data={hostels}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.hostelCard}>
                    {item.image ? (
                      <View style={{ alignItems: 'center', marginBottom: 8 }}>
                        <Image source={{ uri: item.image }} style={{ width: 120, height: 80, borderRadius: 12, backgroundColor: '#eee' }} resizeMode="cover" />
                      </View>
                    ) : null}
                    <Text style={styles.hostelName}>{item.name}</Text>
                    <Text style={styles.hostelInfo}>{item.address}</Text>
                    <Text style={styles.hostelInfo}>Manager: {item.manager} | Phone: {item.phone}</Text>
                    <Text style={styles.hostelInfo}>Rooms: {rooms.filter(r => r.hostelId === item.id).length}</Text>
                    <View style={styles.hostelActions}>
                      <TouchableOpacity onPress={() => openEditHostel(item)} accessible={true} accessibilityLabel={`Edit ${item.name}`} activeOpacity={0.7}><Text style={styles.editBtn}>Edit</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteHostel(item.id)} accessible={true} accessibilityLabel={`Delete ${item.name}`} activeOpacity={0.7}><Text style={styles.deleteBtn}>Delete</Text></TouchableOpacity>
                    </View>
                  </View>
                )}
                contentContainerStyle={{ paddingBottom: 24 }}
              />
              <Modal
                visible={modalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setModalVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{editHostel ? 'Edit Hostel' : 'Add Hostel'}</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Hostel Name"
                      value={hostelForm.name}
                      onChangeText={v => setHostelForm(f => ({ ...f, name: v }))}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Gender"
                      value={hostelForm.gender}
                      onChangeText={v => setHostelForm(f => ({ ...f, gender: v }))}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Total Rooms"
                      value={hostelForm.rooms}
                      onChangeText={v => setHostelForm(f => ({ ...f, rooms: v.replace(/[^0-9]/g, '') }))}
                      keyboardType="numeric"
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                      <TouchableOpacity style={styles.saveBtn} onPress={saveHostel} accessible={true} accessibilityLabel={editHostel ? 'Save hostel changes' : 'Add hostel'} activeOpacity={0.7}><Text style={styles.saveBtnText}>Save</Text></TouchableOpacity>
                      <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)} accessible={true} accessibilityLabel="Cancel" activeOpacity={0.7}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          )}
          {activeTab === 2 && (
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Text style={{ fontWeight: 'bold', marginRight: 8 }}>Filter by Hostel:</Text>
                <TouchableOpacity
                  style={[styles.filterBtn, !roomHostelFilter && styles.filterBtnActive]}
                  onPress={() => setRoomHostelFilter('')}
                >
                  <Text style={{ color: !roomHostelFilter ? '#fff' : '#222' }}>All</Text>
                </TouchableOpacity>
                {hostels.map(h => (
                  <TouchableOpacity
                    key={h.id}
                    style={[styles.filterBtn, roomHostelFilter === h.id && styles.filterBtnActive]}
                    onPress={() => setRoomHostelFilter(h.id)}
                  >
                    <Text style={{ color: roomHostelFilter === h.id ? '#fff' : '#222' }}>{h.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity style={styles.addBtn} onPress={openAddRoom}>
                <Text style={styles.addBtnText}>+ Add Room</Text>
              </TouchableOpacity>
              <FlatList
                data={rooms.filter(r => !roomHostelFilter || r.hostelId === roomHostelFilter)}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={styles.roomCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                      <Text style={styles.roomName}>{item.name}</Text>
                      <View style={{
                        marginLeft: 10,
                        backgroundColor: item.status === 'available' ? '#4CAF50' : '#F44336',
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        alignSelf: 'flex-start',
                      }}>
                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                          {item.status === 'available' ? 'Available' : 'Taken'}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.roomInfo}>Hostel: {hostels.find(h => h.id === item.hostelId)?.name || 'N/A'}</Text>
                    <Text style={styles.roomInfo}>Type: {item.type} | Price: ${item.price}</Text>
                    <Text style={styles.roomInfo}>Capacity: {item.capacity} | Occupied: {item.occupied}</Text>
                    <View style={styles.hostelActions}>
                      <TouchableOpacity onPress={() => openEditRoom(item)}><Text style={styles.editBtn}>Edit</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteRoom(item.id)}><Text style={styles.deleteBtn}>Delete</Text></TouchableOpacity>
                    </View>
                  </View>
                )}
                ListEmptyComponent={<Text style={styles.placeholder}>No rooms found.</Text>}
                contentContainerStyle={{ paddingBottom: 24 }}
              />
              <Modal
                visible={roomModalVisible}
                animationType="slide"
                transparent
                onRequestClose={() => setRoomModalVisible(false)}
              >
                <View style={styles.modalOverlay}>
                  <View style={styles.modalContent}>
                    <Text style={styles.modalTitle}>{editRoom ? 'Edit Room' : 'Add Room'}</Text>
                    <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Hostel</Text>
                    <FlatList
                      data={hostels}
                      keyExtractor={item => item.id}
                      horizontal
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={[styles.filterBtn, roomForm.hostelId === item.id && styles.filterBtnActive, { marginRight: 8 }]}
                          onPress={() => setRoomForm(f => ({ ...f, hostelId: item.id }))}
                          accessible={true}
                          accessibilityLabel={`Select hostel ${item.name} for room`}
                          activeOpacity={0.7}
                        >
                          <Text style={{ color: roomForm.hostelId === item.id ? '#fff' : '#222' }}>{item.name}</Text>
                        </TouchableOpacity>
                      )}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Room Name"
                      value={roomForm.name}
                      onChangeText={v => setRoomForm(f => ({ ...f, name: v }))}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Type"
                      value={roomForm.type}
                      onChangeText={v => setRoomForm(f => ({ ...f, type: v }))}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Price"
                      value={roomForm.price}
                      onChangeText={v => setRoomForm(f => ({ ...f, price: v.replace(/[^0-9]/g, '') }))}
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Capacity"
                      value={roomForm.capacity}
                      onChangeText={v => setRoomForm(f => ({ ...f, capacity: v.replace(/[^0-9]/g, '') }))}
                      keyboardType="numeric"
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Occupied"
                      value={roomForm.occupied}
                      onChangeText={v => setRoomForm(f => ({ ...f, occupied: v.replace(/[^0-9]/g, '') }))}
                      keyboardType="numeric"
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                      <TouchableOpacity style={styles.saveBtn} onPress={saveRoom} accessible={true} accessibilityLabel={editRoom ? 'Save room changes' : 'Add room'} activeOpacity={0.7}><Text style={styles.saveBtnText}>Save</Text></TouchableOpacity>
                      <TouchableOpacity style={styles.cancelBtn} onPress={() => setRoomModalVisible(false)} accessible={true} accessibilityLabel="Cancel" activeOpacity={0.7}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          )}
          {activeTab === 3 && (
            <FlatList
              data={bookings.filter(b => b.status === 'pending' || b.status === 'Pending')}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                const userName = item.name || item.student || 'User';
                const hostelName = hostels.find(h => h.id === item.hostelId)?.name || item.hostel || 'Hostel';
                const roomName = rooms.find(r => r.id === item.roomId)?.number || item.room || 'Room';
                const status = (item.status || '').toLowerCase();
                return (
                  <View style={styles.bookingCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <Text style={styles.bookingInfo}>{userName} - {hostelName} ({roomName})</Text>
                      <View style={{
                        marginLeft: 10,
                        backgroundColor: status === 'approved' ? '#4CAF50' : status === 'pending' ? '#FFC107' : '#F44336',
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        alignSelf: 'flex-start',
                      }}>
                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.roomInfo}>Date: {item.date}</Text>
                    <View style={styles.bookingActions}>
                      <TouchableOpacity onPress={() => approveBooking(item.id)} accessible={true} accessibilityLabel={`Approve booking for ${userName} in ${hostelName} (${roomName})`} activeOpacity={0.7}><Text style={styles.approveBtn}>Approve</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => rejectBooking(item.id)} accessible={true} accessibilityLabel={`Reject booking for ${userName} in ${hostelName} (${roomName})`} activeOpacity={0.7}><Text style={styles.rejectBtn}>Reject</Text></TouchableOpacity>
                    </View>
                  </View>
                );
              }}
              ListEmptyComponent={<Text style={styles.placeholder}>No pending bookings.</Text>}
              contentContainerStyle={{ paddingBottom: 24 }}
            />
          )}
          {activeTab === 4 && (
            <FlatList
              data={payments}
              keyExtractor={item => item.id}
              renderItem={({ item }) => {
                const booking = bookings.find(b => b.id === item.bookingId);
                const userName = booking?.name || booking?.student || 'User';
                const hostelName = hostels.find(h => h.id === booking?.hostelId)?.name || booking?.hostel || 'Hostel';
                const status = (item.status || '').toLowerCase();
                return (
                  <View style={styles.paymentCard}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <Text style={styles.paymentInfo}>{userName} - {hostelName}</Text>
                      <View style={{
                        marginLeft: 10,
                        backgroundColor: status === 'paid' ? '#4CAF50' : '#FFC107',
                        borderRadius: 6,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        alignSelf: 'flex-start',
                      }}>
                        <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.roomInfo}>Amount: ${item.amount} | Method: {item.method}</Text>
                    <Text style={styles.paymentDate}>Date: {item.date}</Text>
                  </View>
                );
              }}
              ListEmptyComponent={<Text style={styles.placeholder}>No payment records.</Text>}
              contentContainerStyle={{ paddingBottom: 24 }}
            />
          )}
        </View>
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
    backgroundColor: colors.background,
    paddingTop: 32,
  },
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: colors.border, marginHorizontal: 8 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderColor: colors.primary },
  tabText: { fontSize: 15, color: colors.textSecondary, fontWeight: 'bold', fontFamily: 'Inter_500Medium' },
  tabTextActive: { color: colors.primary },
  content: { flex: 1, padding: 16 },
  card: { backgroundColor: colors.surface, borderRadius: 10, padding: 24, marginRight: 16, alignItems: 'center', minWidth: 120, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  cardValue: { fontSize: 22, fontWeight: 'bold', marginBottom: 6, color: colors.primary, fontFamily: 'Inter_700Bold' },
  cardLabel: { fontSize: 14, color: colors.textSecondary, fontFamily: 'Inter_400Regular' },
  addBtn: { backgroundColor: colors.primary, padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12, shadowColor: colors.primary, shadowOpacity: 0.12, shadowRadius: 6, elevation: 2 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, fontFamily: 'Inter_500Medium' },
  hostelCard: { backgroundColor: colors.surface, borderRadius: 10, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  hostelName: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary, fontFamily: 'Inter_700Bold' },
  hostelInfo: { fontSize: 14, color: colors.textSecondary, marginBottom: 4, fontFamily: 'Inter_400Regular' },
  hostelActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  editBtn: { color: colors.secondary, marginRight: 16, fontWeight: 'bold', fontFamily: 'Inter_500Medium' },
  deleteBtn: { color: colors.error, fontWeight: 'bold', fontFamily: 'Inter_500Medium' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: colors.surface, borderRadius: 12, padding: 24, width: 300, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center', color: colors.primary, fontFamily: 'Inter_700Bold' },
  input: { height: 44, borderColor: colors.border, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, backgroundColor: colors.background, marginBottom: 12, fontFamily: 'Inter_400Regular', color: colors.textPrimary },
  saveBtn: { backgroundColor: colors.primary, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8, shadowColor: colors.primary, shadowOpacity: 0.12, shadowRadius: 6, elevation: 2 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15, fontFamily: 'Inter_500Medium' },
  cancelBtn: { backgroundColor: colors.surface, paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  cancelBtnText: { color: colors.primary, fontWeight: 'bold', fontSize: 15, fontFamily: 'Inter_500Medium' },
  bookingCard: { backgroundColor: colors.surface, borderRadius: 10, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  bookingInfo: { fontSize: 15, fontWeight: 'bold', marginBottom: 8, color: colors.textPrimary, fontFamily: 'Inter_500Medium' },
  bookingActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  approveBtn: { color: colors.success, fontWeight: 'bold', marginRight: 16, fontFamily: 'Inter_500Medium' },
  rejectBtn: { color: colors.error, fontWeight: 'bold', fontFamily: 'Inter_500Medium' },
  paymentCard: { backgroundColor: colors.surface, borderRadius: 10, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  paymentInfo: { fontSize: 15, fontWeight: 'bold', color: colors.textPrimary, fontFamily: 'Inter_500Medium' },
  paymentDate: { fontSize: 13, color: colors.textSecondary, marginTop: 4, fontFamily: 'Inter_400Regular' },
  placeholder: { fontSize: 16, color: colors.textSecondary, textAlign: 'center', marginTop: 40, fontFamily: 'Inter_400Regular' },
  filterBtn: { backgroundColor: colors.surface, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginRight: 6, borderWidth: 1, borderColor: colors.border },
  filterBtnActive: { backgroundColor: colors.primary },
  roomCard: { backgroundColor: colors.surface, borderRadius: 10, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  roomName: { fontSize: 16, fontWeight: 'bold', color: colors.textPrimary, fontFamily: 'Inter_700Bold' },
  roomInfo: { fontSize: 14, color: colors.textSecondary, marginBottom: 2, fontFamily: 'Inter_400Regular' },
}); 