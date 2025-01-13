import ReactNativeBiometrics, { BiometryTypes } from 'react-native-biometrics';
import { Platform } from 'react-native';
import EncryptedStorage from 'react-native-encrypted-storage';

interface BiometricCredentials {
  email: string;
  password: string;
}

class BiometricServiceClass {
  private rnBiometrics: ReactNativeBiometrics;

  constructor() {
    this.rnBiometrics = new ReactNativeBiometrics({
      allowDeviceCredentials: true
    });
  }

  async isBiometricAvailable() {
    try {
      const { available, biometryType } = await this.rnBiometrics.isSensorAvailable();
      
      if (!available) return { available: false, type: null };

      let type = '';
      switch (biometryType) {
        case BiometryTypes.TouchID:
          type = 'TouchID';
          break;
        case BiometryTypes.FaceID:
          type = 'FaceID';
          break;
        case BiometryTypes.Biometrics:
          type = Platform.OS === 'android' ? 'Fingerprint' : 'Biometric';
          break;
      }

      return { available, type };
    } catch (error) {
      console.error('Biometric check error:', error);
      return { available: false, type: null };
    }
  }

  async authenticate(promptMessage: string = 'Konfirmasi identitas Anda') {
    try {
      const { success } = await this.rnBiometrics.simplePrompt({
        promptMessage,
        cancelButtonText: 'Batal',
        fallbackPromptMessage: 'Gunakan PIN/Password'
      });
      
      return success;
    } catch (error) {
      console.error('Authentication error:', error);
      return false;
    }
  }

  async saveBiometricCredentials(credentials: BiometricCredentials) {
    try {
      await EncryptedStorage.setItem(
        'biometric_credentials',
        JSON.stringify(credentials)
      );
      return true;
    } catch (error) {
      console.error('Save credentials error:', error);
      return false;
    }
  }

  async getBiometricCredentials(): Promise<BiometricCredentials | null> {
    try {
      const credentials = await EncryptedStorage.getItem('biometric_credentials');
      return credentials ? JSON.parse(credentials) : null;
    } catch (error) {
      console.error('Get credentials error:', error);
      return null;
    }
  }

  async clearBiometricCredentials() {
    try {
      await EncryptedStorage.removeItem('biometric_credentials');
      return true;
    } catch (error) {
      console.error('Clear credentials error:', error);
      return false;
    }
  }
}

export const BiometricService = new BiometricServiceClass();