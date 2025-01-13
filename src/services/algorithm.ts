import { SortingAlgorithm, AlgorithmStep, AlgorithmElement } from '../types/algorithm';

const createStep = (
  array: number[],
  comparing: number[] = [],
  swapping: number[] = [],
  sorted: number[] = []
): AlgorithmStep => {
  const elements: AlgorithmElement[] = array.map((value, index) => ({
    value,
    isComparing: comparing.includes(index),
    isSwapping: swapping.includes(index),
    isSorted: sorted.includes(index),
  }));

  return {
    array: elements,
    description: `Comparing elements at positions ${comparing.join(', ')}`,
  };
};

export const bubbleSort: SortingAlgorithm = {
  name: 'Bubble Sort',
  description: 'Algoritma pengurutan sederhana yang berulang kali melintasi daftar, membandingkan elemen yang berdekatan dan menukarnya jika tidak dalam urutan yang benar.',
  complexity: {
    time: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
    },
    space: 'O(1)',
  },
  generateSteps: (initialArray: number[]) => {
    const steps: AlgorithmStep[] = [];
    const array = [...initialArray];
    const n = array.length;
    let sorted: number[] = [];

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        steps.push(createStep(array, [j, j + 1], [], sorted));

        if (array[j] > array[j + 1]) {
          steps.push(createStep(array, [], [j, j + 1], sorted));
          [array[j], array[j + 1]] = [array[j + 1], array[j]];
        }
      }
      sorted = [...sorted, n - i - 1];
      steps.push(createStep(array, [], [], sorted));
    }
    sorted.push(0);
    steps.push(createStep(array, [], [], sorted));

    return steps;
  },
};

// Tambahkan implementasi quickSort dan mergeSort
export const quickSort: SortingAlgorithm = {
  name: 'Quick Sort',
  description: 'Algoritma pengurutan yang menggunakan strategi divide-and-conquer untuk mengurutkan array.',
  complexity: {
    time: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
    },
    space: 'O(log n)',
  },
  generateSteps: (initialArray: number[]) => {
    const steps: AlgorithmStep[] = [];
    const array = [...initialArray];
    
    steps.push(createStep(array, [], [], []));
    
    return steps;
  },
};

export const mergeSort: SortingAlgorithm = {
  name: 'Merge Sort',
  description: 'Algoritma pengurutan yang menggunakan strategi divide-and-conquer dengan menggabungkan sub-array yang telah diurutkan.',
  complexity: {
    time: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
    },
    space: 'O(n)',
  },
  generateSteps: (initialArray: number[]) => {
    const steps: AlgorithmStep[] = [];
    const array = [...initialArray];
    
    steps.push(createStep(array, [], [], []));
    
    return steps;
  },
}; 