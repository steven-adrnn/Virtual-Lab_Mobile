import { useState, useEffect } from 'react';
import { BiometricService } from '../services/biometric';

export const useBiometric = () => {
  const [isAvailable, setIsAvailable] = useState(false);
  const [biometricType, setBiometricType] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkBiometric();
  }, []);

  const checkBiometric = async () => {
    const { available, type } = await BiometricService.isBiometricAvailable();
    setIsAvailable(available);
    setBiometricType(type);
  };

  const authenticate = async (promptMessage?: string) => {
    if (!isAvailable) return false;

    const success = await BiometricService.authenticate(promptMessage);
    setIsAuthenticated(success);
    return success;
  };

  return {
    isAvailable,
    biometricType,
    isAuthenticated,
    authenticate,
  };
};