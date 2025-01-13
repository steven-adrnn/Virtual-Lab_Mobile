import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../contexts/ThemeContext';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface ValidationErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../types/navigation';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const { register, loading } = useAuth();
  const { theme } = useTheme();

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'teacher',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validasi username
    if (!formData.username.trim()) {
      newErrors.username = 'Username wajib diisi';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username minimal 3 karakter';
    }

    // Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      newErrors.email = 'Email wajib diisi';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // Validasi password
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    // Validasi konfirmasi password
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password tidak cocok';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });
      
      Alert.alert(
        'Sukses',
        'Registrasi berhasil! Silakan login.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (err) {
      Alert.alert('Error', 'Registrasi gagal. Silakan coba lagi.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Daftar Akun
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Buat akun untuk mulai belajar
          </Text>
        </View>

        <Input
          label="Username"
          value={formData.username}
          onChangeText={(text) => setFormData({ ...formData, username: text })}
          error={errors.username}
          icon="person"
          autoCapitalize="none"
        />

        <Input
          label="Email"
          value={formData.email}
          onChangeText={(text) => setFormData({ ...formData, email: text })}
          keyboardType="email-address"
          error={errors.email}
          icon="email"
          autoCapitalize="none"
        />

        <Input
          label="Password"
          value={formData.password}
          onChangeText={(text) => setFormData({ ...formData, password: text })}
          secureTextEntry
          error={errors.password}
          icon="lock"
        />

        <Input
          label="Konfirmasi Password"
          value={formData.confirmPassword}
          onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
          secureTextEntry
          error={errors.confirmPassword}
          icon="lock"
        />

        <View style={styles.roleContainer}>
          <Text style={[styles.roleLabel, { color: theme.colors.text }]}>
            Daftar sebagai:
          </Text>
          <View style={styles.roleButtons}>
            <TouchableOpacity
              style={[
                styles.roleButton,
                formData.role === 'student' && styles.roleButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, role: 'student' })}
            >
              <Icon 
                name="school" 
                size={24} 
                color={formData.role === 'student' ? theme.colors.primary : '#666'} 
              />
              <Text style={[
                styles.roleText,
                formData.role === 'student' && { color: theme.colors.primary }
              ]}>
                Pelajar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleButton,
                formData.role === 'teacher' && styles.roleButtonActive,
              ]}
              onPress={() => setFormData({ ...formData, role: 'teacher' })}
            >
              <Icon 
                name="person" 
                size={24} 
                color={formData.role === 'teacher' ? theme.colors.primary : '#666'} 
              />
              <Text style={[
                styles.roleText,
                formData.role === 'teacher' && { color: theme.colors.primary }
              ]}>
                Pengajar
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Button
          title="Daftar"
          onPress={handleRegister}
          loading={loading}
          style={styles.registerButton}
        />

        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.loginLink}
        >
          <Text style={styles.loginText}>
            Sudah punya akun? Login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
  },
  roleContainer: {
    marginVertical: 20,
  },
  roleLabel: {
    fontSize: 16,
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    marginHorizontal: 8,
  },
  roleButtonActive: {
    borderColor: '#02a9f7',
    backgroundColor: '#e3f2fd',
  },
  roleText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  registerButton: {
    marginTop: 20,
  },
  loginLink: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    color: '#02a9f7',
    fontSize: 16,
  },
});
