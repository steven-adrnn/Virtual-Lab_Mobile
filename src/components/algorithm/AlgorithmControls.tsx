import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Slider from '@react-native-community/slider';
import { useTheme } from '../../contexts/ThemeContext';
import { AlgorithmControlsProps } from '../../types/algorithm';

export const AlgorithmControls: React.FC<AlgorithmControlsProps> = ({
  onPlay,
  onPause,
  onStep,
  onReset,
  onSpeedChange,
  isPlaying,
}) => {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={onReset}
          style={[styles.button, { backgroundColor: theme.colors.surface }]}
        >
          <Icon name="replay" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onStep}
          style={[styles.button, { backgroundColor: theme.colors.surface }]}
          disabled={isPlaying}
        >
          <Icon name="skip-next" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={isPlaying ? onPause : onPlay}
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
        >
          <Icon
            name={isPlaying ? 'pause' : 'play-arrow'}
            size={24}
            color={theme.colors.white}
          />
        </TouchableOpacity>
      </View>

      <Slider
        style={styles.slider}
        minimumValue={100}
        maximumValue={1000}
        step={100}
        onValueChange={onSpeedChange}
        minimumTrackTintColor={theme.colors.primary}
        maximumTrackTintColor={theme.colors.border}
        thumbTintColor={theme.colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },
}); 