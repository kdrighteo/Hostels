import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Modal, ActivityIndicator } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function PaymentScreen({ route, navigation }) {
  const [paymentMethod, setPaymentMethod] = useState('Mobile Money');
  const [processing, setProcessing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const bookingId = '123455';
  const room = route.params?.room || { name: 'Room A1', type: 'Double', price: 300, term: 'term' };
  const hostel = route.params?.hostel || { name: 'Jubilee Hostel' };

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowModal(true);
    }, 1500);
  };

  const handleModalClose = () => {
    setShowModal(false);
    navigation.navigate('MainTabs', { screen: 'Bookings' });
  };

  return (
    <View style={styles.container}>
      {/* Secure Payment Label */}
      <View style={styles.secureRow}>
        <MaterialIcons name="lock" size={20} color="#2ecc40" />
        <Text style={styles.secureText}>Secure Payment</Text>
      </View>
      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Booking Summary</Text>
        <Text style={styles.summaryText}>Hostel: <Text style={styles.bold}>{hostel.name}</Text></Text>
        <Text style={styles.summaryText}>Room: <Text style={styles.bold}>{room.name}</Text> ({room.type})</Text>
        <Text style={styles.summaryText}>Price: <Text style={styles.bold}>${room.price}</Text> / {room.term}</Text>
        <Text style={styles.summaryText}>Booking ID: <Text style={styles.bold}>{bookingId}</Text></Text>
      </View>
      {/* Payment Methods */}
      <Text style={styles.label}>Payment method</Text>
      <View style={styles.methodRow}>
        <TouchableOpacity
          style={[styles.methodBtn, paymentMethod === 'Mobile Money' && styles.methodBtnActive]}
          onPress={() => setPaymentMethod('Mobile Money')}
        >
          <FontAwesome name="mobile" size={22} color={paymentMethod === 'Mobile Money' ? '#fff' : '#222'} />
          <Text style={[styles.methodText, paymentMethod === 'Mobile Money' && styles.methodTextActive]}>Mobile Money</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.methodBtn, paymentMethod === 'Credit Card' && styles.methodBtnActive]}
          onPress={() => setPaymentMethod('Credit Card')}
        >
          <FontAwesome name="credit-card" size={22} color={paymentMethod === 'Credit Card' ? '#fff' : '#222'} />
          <Text style={[styles.methodText, paymentMethod === 'Credit Card' && styles.methodTextActive]}>Credit Card</Text>
        </TouchableOpacity>
      </View>
      {/* Pay Button */}
      <TouchableOpacity
        style={[styles.button, processing && styles.buttonDisabled]}
        onPress={handlePay}
        disabled={processing || !paymentMethod}
      >
        {processing ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Pay Now</Text>}
      </TouchableOpacity>
      {/* Powered by badge */}
      <View style={styles.poweredByRow}>
        <FontAwesome name="cc-stripe" size={18} color="#222" />
        <Text style={styles.poweredByText}>Powered by Stripe (Demo)</Text>
      </View>
      {/* Confirmation Modal */}
      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <MaterialIcons name="check-circle" size={48} color="#2ecc40" />
            <Text style={styles.modalTitle}>Payment Successful!</Text>
            <Text style={styles.modalMsg}>Your booking has been confirmed.</Text>
            <TouchableOpacity style={styles.button} onPress={handleModalClose}>
              <Text style={styles.buttonText}>Go to Bookings</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  secureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  secureText: {
    color: '#2ecc40',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
  summaryCard: {
    backgroundColor: '#f4f4f4',
    borderRadius: 12,
    padding: 18,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: '#444',
    marginBottom: 2,
  },
  bold: {
    fontWeight: 'bold',
    color: '#222',
  },
  label: {
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 8,
    marginBottom: 4,
  },
  methodRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  methodBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    marginRight: 10,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
  },
  methodBtnActive: {
    backgroundColor: '#222',
    borderColor: '#222',
  },
  methodText: {
    fontSize: 15,
    color: '#222',
    marginLeft: 8,
    fontWeight: 'bold',
  },
  methodTextActive: {
    color: '#fff',
  },
  button: {
    backgroundColor: '#222',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  poweredByRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  poweredByText: {
    marginLeft: 6,
    color: '#888',
    fontSize: 13,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    width: 280,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 6,
    color: '#2ecc40',
  },
  modalMsg: {
    fontSize: 15,
    color: '#444',
    marginBottom: 18,
    textAlign: 'center',
  },
}); 