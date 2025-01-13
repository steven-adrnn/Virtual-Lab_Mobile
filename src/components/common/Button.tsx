import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'small' | 'medium' | 'large';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const getButtonStyle = () => {
    const buttonStyles: ViewStyle[] = [styles.button, styles[`${variant}Button`], styles[`${size}Button`]];
    
    if (disabled) {
      buttonStyles.push(styles.disabledButton);
    }
    
    if (style) {
      buttonStyles.push(style);
    }
    
    return buttonStyles;
  };

  const getTextStyle = () => {
    const textStyles: TextStyle[] = [styles.text, styles[`${variant}Text`], styles[`${size}Text`]];
    
    if (disabled) {
      textStyles.push(styles.disabledText);
    }
    
    if (textStyle) {
      textStyles.push(textStyle);
    }
    
    return textStyles;
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator 
          testID="activity-indicator"
          color={variant === 'outline' ? '#02a9f7' : '#fff'} 
          size={size === 'small' ? 'small' : 'small'}
        />
      ) : (
        <>
          {icon}
          <Text style={getTextStyle()}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  text: {
    fontWeight: '600',
    textAlign: 'center',
    marginLeft: 8,
  },
  // Variant styles
  primaryButton: {
    backgroundColor: '#02a9f7',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryButton: {
    backgroundColor: '#4CAF50',
  },
  secondaryText: {
    color: '#fff',
  },
  outlineButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#02a9f7',
  },
  outlineText: {
    color: '#02a9f7',
  },
  dangerButton: {
    backgroundColor: '#f44336',
  },
  dangerText: {
    color: '#fff',
  },
  // Size styles
  smallButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  smallText: {
    fontSize: 14,
  },
  mediumButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  mediumText: {
    fontSize: 16,
  },
  largeButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  largeText: {
    fontSize: 18,
  },
  // Disabled styles
  disabledButton: {
    opacity: 0.5,
  },
  disabledText: {
    opacity: 0.5,
  },
});
