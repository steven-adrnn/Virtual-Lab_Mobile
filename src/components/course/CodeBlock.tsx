import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

interface CodeBlockProps {
  code: string;
  language: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language }) => {
  return (
    <ScrollView 
      horizontal 
      style={styles.container}
      showsHorizontalScrollIndicator={false}
    >
      <View style={styles.codeContainer}>
        <Text style={styles.languageLabel}>{language}</Text>
        <Text style={styles.code}>{code}</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    marginVertical: 10,
  },
  codeContainer: {
    padding: 15,
  },
  languageLabel: {
    color: '#666',
    fontSize: 12,
    marginBottom: 5,
  },
  code: {
    color: '#fff',
    fontFamily: 'monospace',
    fontSize: 14,
  },
});