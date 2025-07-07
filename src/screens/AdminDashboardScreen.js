import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Alert } from 'react-native';

const TABS = [
  { label: '📊 Overview', key: 'overview' },
  { label: '🏠 Manage Hostels', key: 'hostels' },
  { label: '🚪 Manage Rooms', key: 'rooms' },
  { label: '📆 Approve Bookings', key: 'bookings' },
  { label: '💳 Payment Records', key: 'payments' },
];
const mockOverview = [
  { id: '1', label: 'Total Bookings', value: 32 },
  { id: '2', label: 'Revenue', value: '$2,300' },
];
const initialHostels = [
  { id: '1', name: 'Jubilee Hostel', gender: 'Male', rooms: 50 },
  { id: '2', name: 'Addes Hostel', gender: 'Female', rooms: 30 },
];
const initialBookings = [
  { id: 'b1', student: 'Gilbert', hostel: 'Jubilee Hostel', room: 'A1', status: 'Pending' },
  { id: 'b2', student: 'Jane', hostel: 'Addes Hostel', room: 'B2', status: 'Pending' },
];
const mockPayments = [
  { id: 'p1', student: 'Gilbert', amount: 300, method: 'Mobile Money', date: '2024-07-07' },
  { id: 'p2', student: 'Jane', amount: 300, method: 'Credit Card', date: '2024-07-06' },
];
const initialRooms = [
  { id: 'r1', hostelId: '1', name: 'Room A1', type: 'Double', price: 300, capacity: 2, occupied: 1 },
  { id: 'r2', hostelId: '1', name: 'Room D4', type: '4-m 1', price: 300, capacity: 4, occupied: 3 },
  { id: 'r3', hostelId: '2', name: 'Room B2', type: 'Double', price: 300, capacity: 2, occupied: 2 },
];

export default function AdminDashboardScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [hostels, setHostels] = useState(initialHostels);
  const [bookings, setBookings] = useState(initialBookings);
  const [rooms, setRooms] = useState(initialRooms);
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
    <View style={styles.container}>
      <View style={styles.tabRow}>
        {TABS.map((tab, idx) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === idx && styles.tabActive]}
            onPress={() => setActiveTab(idx)}
          >
            <Text style={[styles.tabText, activeTab === idx && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.content}>
        {activeTab === 0 && (
          <FlatList
            data={mockOverview}
            keyExtractor={item => item.id}
            horizontal
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={styles.cardValue}>{item.value}</Text>
                <Text style={styles.cardLabel}>{item.label}</Text>
              </View>
            )}
            contentContainerStyle={{ paddingVertical: 16 }}
          />
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
                  <Text style={styles.hostelName}>{item.name}</Text>
                  <Text style={styles.hostelInfo}>Gender: {item.gender} | Rooms: {item.rooms}</Text>
                  <View style={styles.hostelActions}>
                    <TouchableOpacity onPress={() => openEditHostel(item)}><Text style={styles.editBtn}>Edit</Text></TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteHostel(item.id)}><Text style={styles.deleteBtn}>Delete</Text></TouchableOpacity>
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
                    <TouchableOpacity style={styles.saveBtn} onPress={saveHostel}><Text style={styles.saveBtnText}>Save</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
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
                  <Text style={styles.roomName}>{item.name}</Text>
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
                    <TouchableOpacity style={styles.saveBtn} onPress={saveRoom}><Text style={styles.saveBtnText}>Save</Text></TouchableOpacity>
                    <TouchableOpacity style={styles.cancelBtn} onPress={() => setRoomModalVisible(false)}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}
        {activeTab === 3 && (
          <FlatList
            data={bookings.filter(b => b.status === 'Pending')}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.bookingCard}>
                <Text style={styles.bookingInfo}>{item.student} - {item.hostel} ({item.room})</Text>
                <View style={styles.bookingActions}>
                  <TouchableOpacity onPress={() => approveBooking(item.id)}><Text style={styles.approveBtn}>Approve</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => rejectBooking(item.id)}><Text style={styles.rejectBtn}>Reject</Text></TouchableOpacity>
                </View>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.placeholder}>No pending bookings.</Text>}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}
        {activeTab === 4 && (
          <FlatList
            data={mockPayments}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.paymentCard}>
                <Text style={styles.paymentInfo}>{item.student} - ${item.amount} ({item.method})</Text>
                <Text style={styles.paymentDate}>{item.date}</Text>
              </View>
            )}
            ListEmptyComponent={<Text style={styles.placeholder}>No payment records.</Text>}
            contentContainerStyle={{ paddingBottom: 24 }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingTop: 24 },
  tabRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#eee', marginHorizontal: 8 },
  tab: { flex: 1, paddingVertical: 12, alignItems: 'center' },
  tabActive: { borderBottomWidth: 2, borderColor: '#222' },
  tabText: { fontSize: 15, color: '#888', fontWeight: 'bold' },
  tabTextActive: { color: '#222' },
  content: { flex: 1, padding: 16 },
  card: { backgroundColor: '#f4f4f4', borderRadius: 10, padding: 24, marginRight: 16, alignItems: 'center', minWidth: 120 },
  cardValue: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  cardLabel: { fontSize: 14, color: '#555' },
  addBtn: { backgroundColor: '#222', padding: 12, borderRadius: 8, alignItems: 'center', marginBottom: 12 },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  hostelCard: { backgroundColor: '#f4f4f4', borderRadius: 10, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  hostelName: { fontSize: 16, fontWeight: 'bold' },
  hostelInfo: { fontSize: 14, color: '#555', marginBottom: 4 },
  hostelActions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  editBtn: { color: '#007bff', marginRight: 16, fontWeight: 'bold' },
  deleteBtn: { color: '#ff4444', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { backgroundColor: '#fff', borderRadius: 12, padding: 24, width: 300, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 8, elevation: 3 },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  input: { height: 44, borderColor: '#ddd', borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, backgroundColor: '#f9f9f9', marginBottom: 12 },
  saveBtn: { backgroundColor: '#222', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 15 },
  cancelBtn: { backgroundColor: '#eee', paddingVertical: 10, paddingHorizontal: 24, borderRadius: 8 },
  cancelBtnText: { color: '#222', fontWeight: 'bold', fontSize: 15 },
  bookingCard: { backgroundColor: '#f4f4f4', borderRadius: 10, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  bookingInfo: { fontSize: 15, fontWeight: 'bold', marginBottom: 8 },
  bookingActions: { flexDirection: 'row', justifyContent: 'flex-end' },
  approveBtn: { color: 'green', fontWeight: 'bold', marginRight: 16 },
  rejectBtn: { color: 'red', fontWeight: 'bold' },
  paymentCard: { backgroundColor: '#f4f4f4', borderRadius: 10, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  paymentInfo: { fontSize: 15, fontWeight: 'bold' },
  paymentDate: { fontSize: 13, color: '#888', marginTop: 4 },
  placeholder: { fontSize: 16, color: '#888', textAlign: 'center', marginTop: 40 },
  filterBtn: { backgroundColor: '#eee', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6, marginRight: 6 },
  filterBtnActive: { backgroundColor: '#222' },
  roomCard: { backgroundColor: '#f4f4f4', borderRadius: 10, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  roomName: { fontSize: 16, fontWeight: 'bold' },
  roomInfo: { fontSize: 14, color: '#555', marginBottom: 2 },
}); 