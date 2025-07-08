import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, SafeAreaView } from 'react-native';
import colors from '../theme';
import { useFonts } from 'expo-font';
import { Inter_700Bold, Inter_500Medium, Inter_400Regular } from '@expo-google-fonts/inter';
import { UserContext } from '../../App';
import { db, auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Toast from 'react-native-toast-message';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [showVerify, setShowVerify] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState('');
  const { setUser } = useContext(UserContext);

  const handleAuth = async () => {
    if (isRegister) {
      if (!fullName || !institution || !contactNumber || !email || !password) {
        Alert.alert('Error', 'Please fill in all fields');
        return;
      }
      try {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const userId = userCred.user.uid;
        // Save profile to Firestore
        await setDoc(doc(db, 'users', userId), {
          name: fullName,
          institution,
          contactNumber,
          email,
          role: 'user',
        });
        await sendEmailVerification(userCred.user);
        setRegisteredEmail(email);
        setShowVerify(true);
        Toast.show({ type: 'success', text1: 'Verification email sent', text2: 'Please check your inbox.' });
      } catch (err) {
        Alert.alert('Registration Error', err.message);
      }
      return;
    }
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      if (!userCred.user.emailVerified) {
        setRegisteredEmail(email);
        setShowVerify(true);
        Toast.show({ type: 'error', text1: 'Email not verified', text2: 'Please verify your email.' });
        return;
      }
      const userId = userCred.user.uid;
      // Fetch profile from Firestore
      const userSnap = await getDoc(doc(db, 'users', userId));
      if (!userSnap.exists()) {
        Alert.alert('Login Error', 'User profile not found.');
        return;
      }
      const userData = userSnap.data();
      setUser({ id: userId, ...userData });
      navigation.replace('MainTabs');
    } catch (err) {
      Alert.alert('Login Error', err.message);
    }
  };

  const handleResendVerification = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, registeredEmail, password);
      await sendEmailVerification(userCred.user);
      Toast.show({ type: 'success', text1: 'Verification email resent', text2: 'Check your inbox.' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Resend failed', text2: err.message });
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Toast.show({ type: 'error', text1: 'Enter your email to reset password.' });
      return;
    }
    try {
      await sendPasswordResetEmail(auth, email);
      Toast.show({ type: 'success', text1: 'Password reset email sent', text2: 'Check your inbox.' });
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Reset failed', text2: err.message });
    }
  };

  const [fontsLoaded] = useFonts({
    Inter_700Bold,
    Inter_500Medium,
    Inter_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.form}>
          <Text style={styles.title}>{isRegister ? 'Register' : 'Login'}</Text>
          {isRegister && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                accessible={true}
                accessibilityLabel="Full Name input"
              />
              <TextInput
                style={styles.input}
                placeholder="Institution"
                value={institution}
                onChangeText={setInstitution}
                autoCapitalize="words"
                accessible={true}
                accessibilityLabel="Institution input"
              />
              <TextInput
                style={styles.input}
                placeholder="Contact Number"
                value={contactNumber}
                onChangeText={setContactNumber}
                keyboardType="phone-pad"
                accessible={true}
                accessibilityLabel="Contact Number input"
              />
            </>
          )}
          <TextInput
            style={styles.input}
            placeholder="Email / School ID"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            accessible={true}
            accessibilityLabel="Email or School ID input"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            accessible={true}
            accessibilityLabel="Password input"
          />
          <TouchableOpacity
            onPress={handleAuth}
            accessible={true}
            accessibilityLabel={isRegister ? 'Register' : 'Login'}
            activeOpacity={0.7}
            style={styles.button}
          >
            <Text style={styles.buttonText}>{isRegister ? 'Register' : 'Login'}</Text>
          </TouchableOpacity>
          {!isRegister && (
            <TouchableOpacity onPress={handleForgotPassword} style={{ marginTop: 12 }}>
              <Text style={{ color: colors.primary, textAlign: 'center' }}>Forgot Password?</Text>
            </TouchableOpacity>
          )}
          {showVerify && (
            <View style={{ marginTop: 24, alignItems: 'center' }}>
              <Text style={{ color: colors.error, marginBottom: 8 }}>Please verify your email to continue.</Text>
              <TouchableOpacity onPress={handleResendVerification} style={{ backgroundColor: colors.primary, padding: 10, borderRadius: 8 }}>
                <Text style={{ color: '#fff', fontWeight: 'bold' }}>Resend Verification Email</Text>
              </TouchableOpacity>
            </View>
          )}
          <TouchableOpacity
            onPress={() => setIsRegister(!isRegister)}
            accessible={true}
            accessibilityLabel={isRegister ? 'Switch to Login' : 'Switch to Register'}
            activeOpacity={0.7}
          >
            <Text style={styles.switchText}>
              {isRegister ? 'Already have an account? Login' : "Don't have an account? Register"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingTop: 32,
  },
  form: {
    width: '85%',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: colors.primary,
    fontFamily: 'Inter_700Bold',
  },
  input: {
    height: 48,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 12,
    backgroundColor: colors.surface,
    fontFamily: 'Inter_400Regular',
    color: colors.textPrimary,
  },
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
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
  switchText: {
    color: colors.accent,
    textAlign: 'center',
    marginTop: 8,
    fontFamily: 'Inter_400Regular',
  },
}); 