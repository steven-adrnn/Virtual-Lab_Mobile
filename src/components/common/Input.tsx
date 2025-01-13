import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  KeyboardTypeOptions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  secureTextEntry?: boolean;
  keyboardType?: KeyboardTypeOptions;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[] | null | undefined; // Explicitly exclude invalid types
  inputStyle?: TextStyle;
  maxLength?: number;
  multiline?: boolean;
  icon?: string;
  onIconPress?: () => void;
}

export const Input: React.FC<InputProps> = ({
  value,
  onChangeText,
  placeholder,
  label,
  error,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  disabled = false,
  style,
  inputStyle,
  maxLength,
  multiline = false,
  icon,
  onIconPress,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(!secureTextEntry);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Ensure the style prop is valid
  const containerStyle = Array.isArray(style) 
    ? [styles.container, ...style.filter(s => s && typeof s === 'object')] 
    : [styles.container, (style && typeof style === 'object') ? style : {}];

  return (
    <View style={containerStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={[
        styles.inputContainer,
        isFocused && styles.focusedInput,
        disabled && styles.disabledInput,
      ]}>
        {icon && (
          <TouchableOpacity onPress={onIconPress} disabled={!onIconPress}>
            <Icon name={icon} size={24} color="#666" style={styles.icon} />
          </TouchableOpacity>
        )}
        
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={!disabled}
          maxLength={maxLength}
          multiline={multiline}
          style={[
            styles.input,
            inputStyle,
            multiline && styles.multilineInput,
          ]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        {secureTextEntry && (
          <TouchableOpacity onPress={togglePasswordVisibility}>
            <Icon
              name={isPasswordVisible ? 'visibility' : 'visibility-off'}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 48,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  icon: {
    marginRight: 8,
  },
  focusedInput: {
    borderColor: '#02a9f7',
    backgroundColor: '#fff',
  },
  errorInput: {
    borderColor: '#f44336',
  },
  disabledInput: {
    backgroundColor: '#eee',
    opacity: 0.7,
  },
  errorText: {
    color: '#f44336',
    fontSize: 14,
    marginTop: 4,
  },
});
