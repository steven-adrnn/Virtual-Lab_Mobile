import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Slider from '@react-native-community/slider';

interface ControlsProps {
  algorithm: string;
  setAlgorithm: (algorithm: string) => void;
  arraySize: number;
  setArraySize: (size: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
  isPaused: boolean;
}

export const Controls: React.FC<ControlsProps> = ({
  algorithm,
  setAlgorithm,
  arraySize,
  setArraySize,
  speed,
  setSpeed,
  onStart,
  onPause,
  onReset,
  isPaused,
}) => {
  return (
    <View style={styles.container}>
      <Picker
        selectedValue={algorithm}
        onValueChange={setAlgorithm}
        style={styles.picker}
      >
        <Picker.Item label="Bubble Sort" value="bubble" />
        <Picker.Item label="Quick Sort" value="quick" />
        <Picker.Item label="Merge Sort" value="merge" />
        <Picker.Item label="Insertion Sort" value="insertion" />
      </Picker>

      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Ukuran Array: {arraySize}</Text>
        <Slider
          style={styles.slider}
          minimumValue={5}
          maximumValue={50}
          step={1}
          value={arraySize}
          onValueChange={setArraySize}
        />
      </View>

      <View style={styles.sliderContainer}>
        <Text style={styles.label}>Kecepatan</Text>
        <Slider
          style={styles.slider}
          minimumValue={1}
          maximumValue={200}
          value={speed}
          onValueChange={setSpeed}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={onStart}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, isPaused ? styles.resumeButton : styles.pauseButton]} 
          onPress={onPause}
        >
          <Text style={styles.buttonText}>
            {isPaused ? 'Resume' : 'Pause'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={onReset}>
          <Text style={styles.buttonText}>Reset</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  picker: {
    height: 50,
    marginBottom: 10,
  },
  sliderContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  slider: {
    height: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    backgroundColor: '#02a9f7',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  pauseButton: {
    backgroundColor: '#ff9800',
  },
  resumeButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
});