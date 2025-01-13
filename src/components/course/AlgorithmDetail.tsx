import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { CodeBlock } from './CodeBlock';

interface AlgorithmDetailProps {
  title: string;
  description: string;
  steps: string[];
  complexity: {
    best: string;
    average: string;
    worst: string;
  };
  code: string;
  illustration: string;
}

export const AlgorithmDetail: React.FC<AlgorithmDetailProps> = ({
  title,
  description,
  steps,
  complexity,
  code,
  illustration,
}) => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Deskripsi</Text>
        <Text style={styles.description}>{description}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Langkah-langkah</Text>
        {steps.map((step, index) => (
          <View key={index} style={styles.stepItem}>
            <Text style={styles.stepNumber}>{index + 1}.</Text>
            <Text style={styles.stepText}>{step}</Text>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kompleksitas Waktu</Text>
        <View style={styles.complexityContainer}>
          <Text style={styles.complexityItem}>Best Case: {complexity.best}</Text>
          <Text style={styles.complexityItem}>Average Case: {complexity.average}</Text>
          <Text style={styles.complexityItem}>Worst Case: {complexity.worst}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Implementasi</Text>
        <CodeBlock code={code} language="javascript" />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ilustrasi</Text>
        <Image 
          source={{ uri: illustration }}
          style={styles.illustration}
          resizeMode="contain"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#02a9f7',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    color: '#02a9f7',
  },
  stepText: {
    fontSize: 16,
    flex: 1,
    color: '#666',
  },
  complexityContainer: {
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
  },
  complexityItem: {
    fontSize: 16,
    marginBottom: 8,
    color: '#666',
  },
  illustration: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
});