import React from 'react';
import { ScrollView, StyleSheet, View, Text } from 'react-native';
import { CourseCard } from '../../components/course/CourseCard';
import { useNavigation } from '@react-navigation/native';
import { MainStackParamList } from '../../types/navigation';
import { CompositeNavigationProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

type CourseScreenNavigationProp = CompositeNavigationProp<
  StackNavigationProp<MainStackParamList>,
  StackNavigationProp<MainStackParamList>
>;

export const CourseScreen = () => {
  const navigation = useNavigation<CourseScreenNavigationProp>();

  const algorithms = [
    {
      id: 'bubble',
      title: 'Bubble Sort',
      description: 'Algoritma sorting sederhana yang berulang kali menukar elemen yang berdekatan jika mereka dalam urutan yang salah.',
      icon: 'sort',
      imageUrl: 'https://your-domain.com/images/bubble-sort.gif',
    },
    {
      id: 'quick',
      title: 'Quick Sort',
      description: 'Algoritma sorting yang menggunakan strategi divide-and-conquer dengan memilih pivot.',
      icon: 'flash-on',
      imageUrl: 'https://your-domain.com/images/quick-sort.gif',
    },
    {
      id: 'merge',
      title: 'Merge Sort',
      description: 'Algoritma sorting yang menggunakan strategi divide-and-conquer dengan menggabungkan array yang telah diurutkan.',
      icon: 'call-split',
      imageUrl: 'https://your-domain.com/images/merge-sort.gif',
    },
    {
      id: 'insertion',
      title: 'Insertion Sort',
      description: 'Algoritma sorting yang membangun array terurut satu per satu dengan memasukkan elemen ke posisi yang tepat.',
      icon: 'input',
      imageUrl: 'https://your-domain.com/images/insertion-sort.gif',
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Course: Algoritma Pengurutan</Text>
        <Text style={styles.subtitle}>
          Pelajari berbagai algoritma pengurutan populer dan bagaimana cara kerjanya.
        </Text>
      </View>

      {algorithms.map((algorithm) => (
        <CourseCard
          key={algorithm.id}
          title={algorithm.title}
          description={algorithm.description}
          icon={algorithm.icon}
          imageUrl={algorithm.imageUrl}
          onPress={() => navigation.navigate('AlgorithmDetail', { algorithmId: algorithm.id })}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 15,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 24,
  },
});
