import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { ArrayElement } from '../../types/algorithm';
import { useTheme } from '../../contexts/ThemeContext';

interface Props {
  data: ArrayElement[];
  maxValue: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_WIDTH = SCREEN_WIDTH * 0.8;

export const SortingVisualizer: React.FC<Props> = ({ data, maxValue }) => {
  const { theme } = useTheme();
  const barWidth = BAR_WIDTH / data.length;

  return (
    <View style={styles.container}>
      {data.map((element, index) => {
        const height = (element.value / maxValue) * 200;
        
        const animatedStyle = useAnimatedStyle(() => {
          return {
            height: withSpring(height),
            backgroundColor: element.isComparing
              ? theme.colors.warning
              : element.isSwapping
              ? theme.colors.error
              : element.isSorted
              ? theme.colors.success
              : theme.colors.primary,
          };
        });

        return (
          <Animated.View
            key={index}
            style={[
              styles.bar,
              animatedStyle,
              {
                width: barWidth - 2,
              },
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 250,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
  bar: {
    marginHorizontal: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
}); 