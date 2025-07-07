import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, Alert, SafeAreaView } from 'react-native';
import colors from '../theme';
import { useFonts } from 'expo-font';
import { Inter_700Bold, Inter_500Medium, Inter_400Regular } from '@expo-google-fonts/inter';
import { UserContext } from '../../App';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const { setUser } = useContext(UserContext);

  const handleAuth = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    // Mock authentication: set user with isAdmin if email is admin@hostel.com or admin@hostels.com
    const isAdmin = email === 'admin@hostel.com' || email === 'admin@hostels.com';
    setUser({ id: isAdmin ? 'admin' : 'u1', name: isAdmin ? 'Admin' : 'Gilbert', email, isAdmin });
    navigation.replace('MainTabs');
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
            style={styles.button}
            onPress={handleAuth}
            accessible={true}
            accessibilityLabel={isRegister ? 'Register' : 'Login'}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>{isRegister ? 'Register' : 'Login'}</Text>
          </TouchableOpacity>
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