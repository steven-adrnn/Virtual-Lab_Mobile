import React from 'react';
import { RouteProp } from '@react-navigation/native';
import { AlgorithmDetail } from '../../components/course/AlgorithmDetail';
import { algorithmData } from '../../data/algorithmData';
import { MainStackParamList } from '../../types/navigation';

type AlgorithmDetailRouteProp = RouteProp<MainStackParamList, 'AlgorithmDetail'>;

export const AlgorithmDetailScreen = ({ route }: { route: AlgorithmDetailRouteProp }) => {
  const { algorithmId } = route.params;
  const algorithm = algorithmData[algorithmId as keyof typeof algorithmData];

  return (
    <AlgorithmDetail {...algorithm} />
  );
};
