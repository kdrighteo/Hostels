import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, TextInput, Alert, SafeAreaView, Image, ActivityIndicator } from 'react-native';
import colors from '../theme';
import { db } from '../firebase';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { mockHostels, mockRooms, mockBookings, mockPayments } from '../data/mockData';
import Toast from 'react-native-toast-message';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import { UserContext } from '../../App';

const TABS = [
  { label: '📊 Overview', key: 'overview' },
  { label: '🏠 Manage Hostels', key: 'hostels' },
  { label: '🚪 Manage Rooms', key: 'rooms' },
  { label: '📆 Approve Bookings', key: 'bookings' },
  { label: '💳 Payment Records', key: 'payments' },
  { label: '🧑‍💼 Agents', key: 'agents' }, // New tab for agent management
];

export default function AdminDashboardScreen({ navigation }) {
  const { setUser, user } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState(0);
  const [hostels, setHostels] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loadingHostels, setLoadingHostels] = useState(true);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editHostel, setEditHostel] = useState(null);
  const [hostelForm, setHostelForm] = useState({ name: '', gender: '', rooms: '' });
  const [roomModalVisible, setRoomModalVisible] = useState(false);
  const [editRoom, setEditRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({ hostelId: '', name: '', type: '', price: '', capacity: '', occupied: '' });
  const [roomHostelFilter, setRoomHostelFilter] = useState('');
  const [agents, setAgents] = useState(mockAgents);
  const [users, setUsers] = useState(mockUsers);
  const [savingHostel, setSavingHostel] = useState(false);
  const [savingRoom, setSavingRoom] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [errorHostels, setErrorHostels] = useState(null);
  const [errorRooms, setErrorRooms] = useState(null);
  const [errorBookings, setErrorBookings] = useState(null);
  const [hostelImages, setHostelImages] = useState([]);
  const [roomImages, setRoomImages] = useState([]);
  const [roomCondition, setRoomCondition] = useState('');
  const [roomNotes, setRoomNotes] = useState('');
  const [hostelDescription, setHostelDescription] = useState('');
  const [hostelAmenities, setHostelAmenities] = useState('');
  const [hostelAddress, setHostelAddress] = useState('');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const mockAgents = [
    { id: 'a1', name: 'Agent Smith', email: 'agent1@hostel.com' },
    { id: 'a2', name: 'Agent Jane', email: 'agent2@hostel.com' },
  ];
  const mockUsers = [
    { id: 'u1', name: 'Alice', email: 'alice@hostel.com', isAgent: false },
    { id: 'u2', name: 'Bob', email: 'bob@hostel.com', isAgent: false },
  ];

  useEffect(() => {
    setErrorHostels(null); setErrorRooms(null); setErrorBookings(null);
    const unsubHostels = onSnapshot(collection(db, 'hostels'), (snapshot) => {
      setHostels(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingHostels(false);
    }, (err) => { setErrorHostels('Failed to load hostels.'); setLoadingHostels(false); });
    const unsubRooms = onSnapshot(collection(db, 'rooms'), (snapshot) => {
      setRooms(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingRooms(false);
    }, (err) => { setErrorRooms('Failed to load rooms.'); setLoadingRooms(false); });
    const unsubBookings = onSnapshot(collection(db, 'bookings'), (snapshot) => {
      setBookings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingBookings(false);
    }, (err) => { setErrorBookings('Failed to load bookings.'); setLoadingBookings(false); });
    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setLoadingUsers(false);
    });
    return () => {
      unsubHostels();
      unsubRooms();
      unsubBookings();
      unsubUsers();
    };
  }, []);

  // Hostels CRUD
  const openAddHostel = () => {
    setEditHostel(null);
    setHostelForm({ name: '', gender: '', rooms: '' });
    setHostelImages([]);
    setHostelDescription('');
    setHostelAmenities('');
    setHostelAddress('');
    setModalVisible(true);
  };
  const openEditHostel = (hostel) => {
    setEditHostel(hostel);
    setHostelForm({ name: hostel.name, gender: hostel.gender, rooms: String(hostel.rooms) });
    setHostelImages(hostel.images || []);
    setHostelDescription(hostel.description || '');
    setHostelAmenities(hostel.amenities || '');
    setHostelAddress(hostel.address || '');
    setModalVisible(true);
  };
  const pickHostelImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsMultipleSelection: true });
    if (!result.canceled) {
      const uris = result.assets ? result.assets.map(a => a.uri) : [result.uri];
      setHostelImages([...hostelImages, ...uris]);
    }
  };
  const saveHostel = async () => {
    if (!hostelForm.name || !hostelForm.gender || !hostelForm.rooms) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setSavingHostel(true);
    try {
      let imageUrls = [];
      for (const uri of hostelImages) {
        const response = await fetch(uri);
        const blob = await response.blob();
        const filename = `hostels/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }
      const hostelData = {
        ...hostelForm,
        rooms: Number(hostelForm.rooms),
        images: imageUrls,
        description: hostelDescription,
        amenities: hostelAmenities,
        address: hostelAddress,
      };
      if (editHostel) {
        await updateDoc(doc(db, 'hostels', editHostel.id), hostelData);
        Toast.show({ type: 'success', text1: 'Hostel Updated' });
      } else {
        await addDoc(collection(db, 'hostels'), hostelData);
        Toast.show({ type: 'success', text1: 'Hostel Added' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Hostel Save Failed', text2: err.message });
    }
    setModalVisible(false);
    setSavingHostel(false);
    setHostelImages([]);
    setHostelDescription('');
    setHostelAmenities('');
    setHostelAddress('');
  };
  const deleteHostel = async (id) => {
    try {
      await deleteDoc(doc(db, 'hostels', id));
      Toast.show({ type: 'success', text1: 'Hostel Deleted' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Delete Failed', text2: err.message });
    }
  };

  // Bookings
  const approveBooking = async (id) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status: 'Approved' });
      Toast.show({ type: 'success', text1: 'Booking Approved' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Approval Failed', text2: err.message });
    }
  };
  const rejectBooking = async (id) => {
    try {
      await deleteDoc(doc(db, 'bookings', id));
      Toast.show({ type: 'success', text1: 'Booking Rejected' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Rejection Failed', text2: err.message });
    }
  };

  // Room CRUD
  const openAddRoom = () => {
    setEditRoom(null);
    setRoomForm({ hostelId: '', name: '', type: '', price: '', capacity: '', occupied: '' });
    setRoomImages([]);
    setRoomCondition('');
    setRoomNotes('');
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
    setRoomImages(room.images || []);
    setRoomCondition(room.condition || '');
    setRoomNotes(room.notes || '');
    setRoomModalVisible(true);
  };
  const pickRoomImages = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsMultipleSelection: true });
    if (!result.canceled) {
      const uris = result.assets ? result.assets.map(a => a.uri) : [result.uri];
      setRoomImages([...roomImages, ...uris]);
    }
  };
  const saveRoom = async () => {
    if (!roomForm.hostelId || !roomForm.name || !roomForm.type || !roomForm.price || !roomForm.capacity) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setSavingRoom(true);
    try {
      let imageUrls = [];
      for (const uri of roomImages) {
        const response = await fetch(uri);
        const blob = await response.blob();
        const filename = `rooms/${Date.now()}_${Math.random().toString(36).substring(2, 8)}.jpg`;
        const storageRef = ref(storage, filename);
        await uploadBytes(storageRef, blob);
        const url = await getDownloadURL(storageRef);
        imageUrls.push(url);
      }
      if (editRoom) {
        await updateDoc(doc(db, 'rooms', editRoom.id), { ...roomForm, price: Number(roomForm.price), capacity: Number(roomForm.capacity), occupied: Number(roomForm.occupied) || 0, images: imageUrls, condition: roomCondition, notes: roomNotes });
        Toast.show({ type: 'success', text1: 'Room Updated' });
      } else {
        await addDoc(collection(db, 'rooms'), { ...roomForm, price: Number(roomForm.price), capacity: Number(roomForm.capacity), occupied: Number(roomForm.occupied) || 0, images: imageUrls, condition: roomCondition, notes: roomNotes });
        Toast.show({ type: 'success', text1: 'Room Added' });
      }
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Room Save Failed', text2: err.message });
    }
    setRoomModalVisible(false);
    setSavingRoom(false);
    setRoomImages([]);
    setRoomCondition('');
    setRoomNotes('');
  };
  const deleteRoom = async (id) => {
    try {
      await deleteDoc(doc(db, 'rooms', id));
      Toast.show({ type: 'success', text1: 'Room Deleted' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Delete Failed', text2: err.message });
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    navigation.replace('Login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <View style={styles.tabRow}>
            {TABS.map((tab, idx) => {
              // Split emoji and title
              const [emoji, ...titleParts] = tab.label.split(' ');
              const title = titleParts.join(' ');
              return (
                <TouchableOpacity
                  key={tab.key}
                  style={[styles.tab, activeTab === idx && styles.tabActive]}
                  onPress={() => setActiveTab(idx)}
                  accessible={true}
                  accessibilityLabel={`Switch to ${tab.label} tab`}
                  activeOpacity={0.7}
                >
                  <Text style={{ fontSize: 28, textAlign: 'center' }}>{emoji}</Text>
                  <Text style={[styles.tabText, { fontWeight: 'bold', fontSize: 14, marginTop: 2 }, activeTab === idx && styles.tabTextActive]}>{title}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={styles.content}>
          {activeTab === 0 && (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 16 }}>
              <TouchableOpacity style={styles.card} onPress={() => setActiveTab(1)} activeOpacity={0.8} accessibilityLabel="Go to Manage Hostels tab">
                <Text style={styles.cardValue}>{hostels.length}</Text>
                <Text style={styles.cardLabel}>Hostels</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.card} onPress={() => setActiveTab(2)} activeOpacity={0.8} accessibilityLabel="Go to Manage Rooms tab">
                <Text style={styles.cardValue}>{rooms.length}</Text>
                <Text style={styles.cardLabel}>Rooms</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.card} onPress={() => setActiveTab(3)} activeOpacity={0.8} accessibilityLabel="Go to Approve Bookings tab">
                <Text style={styles.cardValue}>{bookings.filter(b => (b.status || '').trim().toLowerCase() === 'pending').length}</Text>
                <Text style={styles.cardLabel}>Pending Bookings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.card} onPress={() => setActiveTab(4)} activeOpacity={0.8} accessibilityLabel="Go to Payment Records tab">
                <Text style={styles.cardValue}>
                  ${bookings.filter(b => b.paid).reduce((sum, b) => sum + (b.totalAmount || 0), 0)}
                </Text>
                <Text style={styles.cardLabel}>Total Paid</Text>
              </TouchableOpacity>
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
                    {item.images && item.images.length > 0 ? (
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
                        {item.images.map((url, idx) => (
                          <Image key={idx} source={{ uri: url }} style={{ width: 120, height: 80, borderRadius: 12, backgroundColor: '#eee', marginRight: 8, marginBottom: 8 }} resizeMode="cover" />
                        ))}
                      </View>
                    ) : null}
                    <Text style={styles.hostelName}>{item.name}</Text>
                    <Text style={styles.hostelInfo}>{item.address}</Text>
                    <Text style={styles.hostelInfo}>{item.description}</Text>
                    <Text style={styles.hostelInfo}>Amenities: {item.amenities}</Text>
                    <Text style={styles.hostelInfo}>Manager: {item.manager} | Phone: {item.phone}</Text>
                    <Text style={styles.hostelInfo}>Rooms: {rooms.filter(r => r.hostelId === item.id).length}</Text>
                    <View style={styles.hostelActions}>
                      <TouchableOpacity onPress={() => openEditHostel(item)} accessible={true} accessibilityLabel={`Edit ${item.name}`} activeOpacity={0.7}><Text style={styles.editBtn}>Edit</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteHostel(item.id)} accessible={true} accessibilityLabel={`Delete ${item.name}`} activeOpacity={0.7}><Text style={styles.deleteBtn}>Delete</Text></TouchableOpacity>
                    </View>
                  </View>
                )}
                ListEmptyComponent={loadingHostels ? <Text style={styles.placeholder}>Loading hostels...</Text> : <Text style={styles.placeholder}>No hostels found. Add a hostel to get started.</Text>}
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
                    <TextInput
                      style={styles.input}
                      placeholder="Description"
                      value={hostelDescription}
                      onChangeText={setHostelDescription}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Amenities (comma separated)"
                      value={hostelAmenities}
                      onChangeText={setHostelAmenities}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Address"
                      value={hostelAddress}
                      onChangeText={setHostelAddress}
                    />
                    <TouchableOpacity style={styles.addBtn} onPress={pickHostelImages}>
                      <Text style={styles.addBtnText}>+ Add Images</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
                      {hostelImages.map((uri, idx) => (
                        <Image key={idx} source={{ uri }} style={{ width: 60, height: 60, borderRadius: 8, marginRight: 8, marginBottom: 8 }} />
                      ))}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                      <TouchableOpacity style={styles.saveBtn} onPress={saveHostel} accessible={true} accessibilityLabel={editHostel ? 'Save hostel changes' : 'Add hostel'} activeOpacity={0.7} disabled={savingHostel || !hostelForm.name || !hostelForm.gender || !hostelForm.rooms}>
                        <Text style={styles.saveBtnText}>{savingHostel ? 'Saving...' : 'Save'}</Text>
                      </TouchableOpacity>
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
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 8 }}>
                      {item.images && item.images.map((url, idx) => (
                        <Image key={idx} source={{ uri: url }} style={{ width: 80, height: 60, borderRadius: 8, backgroundColor: '#eee', marginRight: 8, marginBottom: 8 }} resizeMode="cover" />
                      ))}
                    </View>
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
                    {item.condition && <Text style={styles.roomInfo}>Condition: {item.condition}</Text>}
                    {item.notes && <Text style={styles.roomInfo}>Notes: {item.notes}</Text>}
                    <View style={styles.hostelActions}>
                      <TouchableOpacity onPress={() => openEditRoom(item)}><Text style={styles.editBtn}>Edit</Text></TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteRoom(item.id)}><Text style={styles.deleteBtn}>Delete</Text></TouchableOpacity>
                    </View>
                  </View>
                )}
                ListEmptyComponent={loadingRooms ? <Text style={styles.placeholder}>Loading rooms...</Text> : <Text style={styles.placeholder}>No rooms found. Add a room to get started.</Text>}
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
                    <TouchableOpacity style={styles.addBtn} onPress={pickRoomImages}>
                      <Text style={styles.addBtnText}>+ Add Images</Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
                      {roomImages.map((uri, idx) => (
                        <Image key={idx} source={{ uri }} style={{ width: 60, height: 60, borderRadius: 8, marginRight: 8, marginBottom: 8 }} />
                      ))}
                    </View>
                    <TextInput
                      style={styles.input}
                      placeholder="Room Condition (e.g. Clean, Needs Repair)"
                      value={roomCondition}
                      onChangeText={setRoomCondition}
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="Notes (optional)"
                      value={roomNotes}
                      onChangeText={setRoomNotes}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 16 }}>
                      <TouchableOpacity style={styles.saveBtn} onPress={saveRoom} accessible={true} accessibilityLabel={editRoom ? 'Save room changes' : 'Add room'} activeOpacity={0.7} disabled={savingRoom || !roomForm.hostelId || !roomForm.name || !roomForm.type || !roomForm.price || !roomForm.capacity}>
                        <Text style={styles.saveBtnText}>{savingRoom ? 'Saving...' : 'Save'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.cancelBtn} onPress={() => setRoomModalVisible(false)} accessible={true} accessibilityLabel="Cancel" activeOpacity={0.7}><Text style={styles.cancelBtnText}>Cancel</Text></TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
            </View>
          )}
          {activeTab === 3 && (
            <FlatList
              data={bookings.filter(b => (b.status || '').trim().toLowerCase() === 'pending')}
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
              ListEmptyComponent={loadingBookings ? (
                <View style={{ alignItems: 'center', marginTop: 60 }}>
                  <ActivityIndicator size="large" color={colors.primary} />
                  <Text style={{ color: colors.textSecondary, marginTop: 16 }}>Loading bookings...</Text>
                </View>
              ) : (
                <View style={{ alignItems: 'center', marginTop: 60 }}>
                  <Text style={{ fontSize: 48 }}>📋</Text>
                  <Text style={{ color: colors.textSecondary, fontSize: 18, marginTop: 12 }}>No pending bookings at the moment.</Text>
                </View>
              )}
              contentContainerStyle={{ paddingBottom: 24 }}
            />
          )}
          {activeTab === 4 && (
            <>
              <FlatList
                data={bookings.filter(b => b.paid)}
                keyExtractor={item => item.id}
                renderItem={({ item }) => {
                  const hostel = hostels.find(h => h.id === item.hostelId);
                  const room = rooms.find(r => r.id === item.roomId);
                  return (
                    <TouchableOpacity
                      style={styles.paymentCard}
                      onPress={() => { setSelectedPayment({ booking: item, hostel, room }); setShowPaymentModal(true); }}
                      activeOpacity={0.8}
                      accessibilityLabel="View payment details"
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                        <Text style={styles.paymentInfo}>{item.name || item.student || 'User'} - {hostel?.name || item.hostel || 'Hostel'}</Text>
                        <View style={{
                          marginLeft: 10,
                          backgroundColor: '#4CAF50',
                          borderRadius: 6,
                          paddingHorizontal: 8,
                          paddingVertical: 2,
                          alignSelf: 'flex-start',
                        }}>
                          <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>Paid</Text>
                        </View>
                      </View>
                      <Text style={styles.roomInfo}>Room: {room?.name || item.room || 'N/A'} ({room?.type || ''})</Text>
                      <Text style={styles.roomInfo}>Amount: ${room?.price || 'N/A'}</Text>
                      <Text style={styles.paymentDate}>Date: {item.date ? new Date(item.date).toLocaleString() : 'N/A'}</Text>
                    </TouchableOpacity>
                  );
                }}
                ListEmptyComponent={<Text style={styles.placeholder}>No payment records.</Text>}
                contentContainerStyle={{ paddingBottom: 24 }}
              />
              {/* Payment Details Modal */}
              {showPaymentModal && selectedPayment && (
                <Modal
                  visible={showPaymentModal}
                  transparent
                  animationType="slide"
                  onRequestClose={() => setShowPaymentModal(false)}
                >
                  <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: colors.surface, borderRadius: 12, padding: 28, width: 320 }}>
                      <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.primary, marginBottom: 12 }}>Payment Details</Text>
                      <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>User:</Text>
                      <Text style={{ marginBottom: 8 }}>{selectedPayment.booking.name || selectedPayment.booking.student || 'User'}</Text>
                      <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Hostel:</Text>
                      <Text style={{ marginBottom: 8 }}>{selectedPayment.hostel?.name || selectedPayment.booking.hostel || 'Hostel'}</Text>
                      <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Room:</Text>
                      <Text style={{ marginBottom: 8 }}>{selectedPayment.room?.name || selectedPayment.booking.room || 'N/A'} ({selectedPayment.room?.type || ''})</Text>
                      <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Amount:</Text>
                      <Text style={{ marginBottom: 8 }}>${selectedPayment.room?.price || 'N/A'}</Text>
                      <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Date:</Text>
                      <Text style={{ marginBottom: 8 }}>{selectedPayment.booking.date ? new Date(selectedPayment.booking.date).toLocaleString() : 'N/A'}</Text>
                      <TouchableOpacity
                        style={{ backgroundColor: colors.error, paddingVertical: 12, borderRadius: 8, alignItems: 'center', marginTop: 16 }}
                        onPress={async () => {
                          await updateDoc(doc(db, 'bookings', selectedPayment.booking.id), { paid: false });
                          Toast.show({ type: 'success', text1: 'Payment Refunded', text2: 'Booking marked as unpaid.' });
                          setShowPaymentModal(false);
                        }}
                        accessible={true}
                        accessibilityLabel="Refund payment"
                        activeOpacity={0.7}
                      >
                        <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Refund Payment</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ marginTop: 12, alignItems: 'center' }}
                        onPress={() => setShowPaymentModal(false)}
                        accessible={true}
                        accessibilityLabel="Close payment details"
                        activeOpacity={0.7}
                      >
                        <Text style={{ color: colors.primary, fontWeight: 'bold', fontSize: 16 }}>Close</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )}
            </>
          )}
          {activeTab === 5 && (
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.primary, marginBottom: 12 }}>User Management</Text>
              {loadingUsers ? <Text style={{ color: colors.textSecondary }}>Loading users...</Text> : null}
              <FlatList
                data={users}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                  <View style={{ backgroundColor: colors.surface, borderRadius: 8, padding: 12, marginBottom: 8 }}>
                    <Text style={{ fontWeight: 'bold', color: colors.textPrimary }}>{item.name}</Text>
                    <Text style={{ color: colors.textSecondary }}>{item.email}</Text>
                    <Text style={{ color: colors.textSecondary }}>Role: {item.role}</Text>
                    <View style={{ flexDirection: 'row', marginTop: 6 }}>
                      {['user', 'agent', 'admin'].map(role => (
                        <TouchableOpacity
                          key={role}
                          style={{ marginRight: 8, padding: 6, borderRadius: 6, backgroundColor: item.role === role ? colors.primary : colors.surface, borderWidth: 1, borderColor: colors.primary }}
                          onPress={async () => {
                            await updateDoc(doc(db, 'users', item.id), { role });
                            Toast.show({ type: 'success', text1: `Role changed to ${role}` });
                          }}
                          disabled={item.role === role || (user && user.id === item.id)}
                        >
                          <Text style={{ color: item.role === role ? '#fff' : colors.primary, fontWeight: 'bold' }}>{role.charAt(0).toUpperCase() + role.slice(1)}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                )}
                ListEmptyComponent={<Text style={{ color: colors.textSecondary }}>No users found.</Text>}
              />
              {/* Logout button always visible under User Management */}
              <TouchableOpacity style={{ marginTop: 24, alignSelf: 'center', backgroundColor: colors.error, paddingVertical: 12, paddingHorizontal: 32, borderRadius: 8 }} onPress={handleLogout} accessible={true} accessibilityLabel="Logout" activeOpacity={0.7}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Logout</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
      <Toast />
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