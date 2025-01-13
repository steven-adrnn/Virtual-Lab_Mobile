import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from '../../contexts/ThemeContext';
import { AlgorithmVisualizerProps, AlgorithmElement } from '../../types/algorithm';
import { AlgorithmControls } from './AlgorithmControls';

export const AlgorithmVisualizer: React.FC<AlgorithmVisualizerProps> = ({
  algorithm,
  initialArray,
  speed = 500,
  onComplete
}) => {
  const { theme } = useTheme();
  const [steps] = useState(algorithm.generateSteps(initialArray)); // Removed unused setSteps
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const animatedValues = useRef<Animated.Value[]>([]).current;
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Initialize animated values
    while (animatedValues.length < initialArray.length) {
      animatedValues.push(new Animated.Value(0));
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handlePlay = () => {
    setIsPlaying(true);
    intervalRef.current = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(intervalRef.current);
          setIsPlaying(false);
          onComplete?.();
          return prev;
        }
        return prev + 1;
      });
    }, speed);
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleSpeedChange = (newSpeed: number) => {
    if (isPlaying) {
      handlePause();
      handlePlay();
    }
    // Use newSpeed to update the speed
    speed = newSpeed;
  };

  const getBarColor = (element: AlgorithmElement) => {
    if (element.isSorted) return theme.colors.sorted;
    if (element.isSwapping) return theme.colors.swapping;
    if (element.isComparing) return theme.colors.comparing;
    return theme.colors.primary;
  };

  const maxValue = Math.max(...initialArray);
  const barWidth = 100 / initialArray.length;

  return (
    <View style={styles.container}>
      <View style={styles.visualizerContainer}>
        {steps[currentStep]?.array.map((element, index) => (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              {
                backgroundColor: getBarColor(element),
                width: `${barWidth - 2}%`,
                height: `${(element.value / maxValue) * 100}%`,
              },
            ]}
          />
        ))}
      </View>

      <AlgorithmControls
        onPlay={handlePlay}
        onPause={handlePause}
        onStep={handleStep}
        onReset={handleReset}
        onSpeedChange={handleSpeedChange}
        isPlaying={isPlaying}
        currentStep={currentStep}
        totalSteps={steps.length}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  visualizerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  bar: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
});
