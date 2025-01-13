export interface AlgorithmElement {
  value: number;
  isComparing: boolean;
  isSwapping: boolean;
  isSorted: boolean;
}

export interface ArrayElement {
  value: number;
  isComparing: boolean;
  isSwapping: boolean;
  isSorted: boolean;
}

export interface AlgorithmStep {
  array: AlgorithmElement[];
  description: string;
}

export interface SortingAlgorithm {
  name: string;
  description: string;
  complexity: {
    time: {
      best: string;
      average: string;
      worst: string;
    };
    space: string;
  };
  generateSteps: (array: number[]) => AlgorithmStep[];
}

export interface AlgorithmVisualizerProps {
  algorithm: SortingAlgorithm;
  initialArray: number[];
  speed?: number;
  onComplete?: () => void;
}

export interface AlgorithmControlsProps {
  onPlay: () => void;
  onPause: () => void;
  onStep: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  isPlaying: boolean;
  currentStep: number;
  totalSteps: number;
}
