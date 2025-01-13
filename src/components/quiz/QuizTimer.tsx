import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface QuizTimerProps {
  duration: number;
  onTimeout: () => void;
  isActive: boolean;
}

export const QuizTimer: React.FC<QuizTimerProps> = ({
  duration,
  onTimeout,
  isActive,
}) => {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [animation] = useState(new Animated.Value(1));

  useEffect(() => {
    if (!isActive) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    Animated.timing(animation, {
      toValue: 0,
      duration: duration * 1000,
      useNativeDriver: false,
    }).start();

    return () => {
      clearInterval(timer);
      animation.setValue(1);
    };
  }, [duration, onTimeout, isActive]);

  const width = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>Waktu: {timeLeft} detik</Text>
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progress,
            {
              width,
              backgroundColor: timeLeft < 10 ? '#f44336' : '#02a9f7',
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  timer: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  progressContainer: {
    height: 4,
    backgroundColor: '#f5f5f5',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
  },
});