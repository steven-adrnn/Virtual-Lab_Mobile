import React, { useEffect, useRef, useState, useCallback } from 'react';

interface Bar {
  value: number;
  index: number;
}

interface DragOffset {
  x: number;
  y: number;
}

interface Position {
  x: number;
  y: number;
}

interface SortingVisualizerProps {
  maxWidth?: number;
  defaultArraySize?: number;
}

const SortingVisualizer: React.FC<SortingVisualizerProps> = ({
  maxWidth = 800,
  defaultArraySize = 10
}) => {
  const [array, setArray] = useState<number[]>([]);
  const [steps, setSteps] = useState<number[][]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [draggedBar, setDraggedBar] = useState<Bar | null>(null);
  const [dragStartIndex, setDragStartIndex] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState<DragOffset>({ x: 0, y: 0 });
  const [currentPos, setCurrentPos] = useState<Position>({ x: 0, y: 0 });
  const [targetPos, setTargetPos] = useState<Position>({ x: 0, y: 0 });
  const [isTouch, setIsTouch] = useState(false);
  const [simulationSpeed, setSimulationSpeed] = useState(100);
  const [arraySize, setArraySize] = useState(defaultArraySize);
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<'bubble' | 'insertion' | 'quick' | 'merge'>('bubble');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const sortingInterval = useRef<NodeJS.Timeout>();

  const MAX_SPEED = 200;

  const generateRandomArray = useCallback((size: number) => {
    const newArray = Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
  }, []);

  const drawArray = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const barWidth = canvas.width / array.length;
    const maxValue = Math.max(...array);
    const scaleFactor = (canvas.height - 30) / maxValue;

    array.forEach((value, index) => {
      if (index !== dragStartIndex || !isDragging) {
        const barHeight = value * scaleFactor;
        const x = index * barWidth;
        const y = canvas.height - barHeight;

        // Draw shadow
        ctx.shadowColor = 'rgba(0, 0, 0, 0.2)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        // Draw bar
        ctx.fillStyle = '#02a9f7';
        ctx.fillRect(x, y, barWidth - 2, barHeight);

        // Reset shadow
        ctx.shadowColor = 'transparent';
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw value
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
      }
    });

    // Draw dragged bar
    if (isDragging && draggedBar !== null) {
      const barHeight = draggedBar.value * scaleFactor;
      
      ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;

      ctx.fillStyle = '#ff4444';
      ctx.fillRect(
        currentPos.x,
        currentPos.y,
        barWidth - 2,
        barHeight
      );

      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      ctx.fillStyle = 'black';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(
        draggedBar.value.toString(),
        currentPos.x + barWidth / 2,
        currentPos.y - 5
      );
    }
  }, [array, currentPos, draggedBar, dragStartIndex, isDragging]);

  // Sorting Algorithms
  const bubbleSort = useCallback((arr: number[]) => {
    const steps: number[][] = [];
    const tempArray = [...arr];
    const n = tempArray.length;
    
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (tempArray[j] > tempArray[j + 1]) {
          [tempArray[j], tempArray[j + 1]] = [tempArray[j + 1], tempArray[j]];
          steps.push([...tempArray]);
        }
      }
    }
    return steps;
  }, []);

  const insertionSort = useCallback((arr: number[]) => {
    const steps: number[][] = [];
    const tempArray = [...arr];
    const n = tempArray.length;
    
    for (let i = 1; i < n; i++) {
      const key = tempArray[i];
      let j = i - 1;
      while (j >= 0 && tempArray[j] > key) {
        tempArray[j + 1] = tempArray[j];
        j = j - 1;
      }
      tempArray[j + 1] = key;
      steps.push([...tempArray]);
    }
    return steps;
  }, []);

  const quickSort = useCallback((arr: number[]) => {
    const steps: number[][] = [];
    const tempArray = [...arr];

    const partition = (arr: number[], low: number, high: number) => {
      const pivot = arr[high];
      let i = low - 1;
      
      for (let j = low; j < high; j++) {
        steps.push([...arr]);
        if (arr[j] < pivot) {
          i++;
          [arr[i], arr[j]] = [arr[j], arr[i]];
          steps.push([...arr]);
        }
      }
      [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
      steps.push([...arr]);
      return i + 1;
    };

    const sort = (arr: number[], low: number, high: number) => {
      if (low < high) {
        const pi = partition(arr, low, high);
        sort(arr, low, pi - 1);
        sort(arr, pi + 1, high);
      }
    };

    sort(tempArray, 0, tempArray.length - 1);
    return steps;
  }, []);

  const mergeSort = useCallback((arr: number[]) => {
    const steps: number[][] = [];
    const tempArray = [...arr];

    const merge = (arr: number[], l: number, m: number, r: number) => {
      const n1 = m - l + 1;
      const n2 = r - m;
      const L = new Array(n1);
      const R = new Array(n2);

      for (let i = 0; i < n1; i++) L[i] = arr[l + i];
      for (let j = 0; j < n2; j++) R[j] = arr[m + 1 + j];

      let i = 0, j = 0, k = l;

      while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
          arr[k] = L[i];
          i++;
        } else {
          arr[k] = R[j];
          j++;
        }
        k++;
        steps.push([...arr]);
      }

      while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
        steps.push([...arr]);
      }

      while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
        steps.push([...arr]);
      }
    };

    const sort = (arr: number[], l: number, r: number) => {
      if (l < r) {
        const m = l + Math.floor((r - l) / 2);
        sort(arr, l, m);
        sort(arr, m + 1, r);
        merge(arr, l, m, r);
      }
    };

    sort(tempArray, 0, tempArray.length - 1);
    return steps;
  }, []);

  // Animation and Control Functions
  const animate = useCallback(() => {
    if (!isDragging) return;

    const easing = isTouch ? 0.4 : 0.2;
    
    setCurrentPos(prev => ({
      x: prev.x + (targetPos.x - prev.x) * easing,
      y: prev.y + (targetPos.y - prev.y) * easing
    }));

    drawArray();
    
    animationFrameId.current = requestAnimationFrame(animate);
  }, [drawArray, isDragging, isTouch, targetPos]);

  const startSimulation = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      return;
    }

    if (sortingInterval.current) clearInterval(sortingInterval.current);
    setCurrentStep(0);
    setIsPaused(false);
    
    let newSteps: number[][] = [];
    switch (selectedAlgorithm) {
      case 'bubble':
        newSteps = bubbleSort([...array]);
        break;
      case 'insertion':
        newSteps = insertionSort([...array]);
        break;
      case 'quick':
        newSteps = quickSort([...array]);
        break;
      case 'merge':
        newSteps = mergeSort([...array]);
        break;
    }
    
    setSteps(newSteps);
  }, [array, bubbleSort, insertionSort, isPaused, mergeSort, quickSort, selectedAlgorithm]);

  const pauseSimulation = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const resetSimulation = useCallback(() => {
    if (sortingInterval.current) clearInterval(sortingInterval.current);
    setIsPaused(false);
    setCurrentStep(0);
    generateRandomArray(arraySize);
  }, [arraySize, generateRandomArray]);

  // Event Handlers
  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPaused) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const barWidth = canvas.width / array.length;
      const newDragStartIndex = Math.floor(x / barWidth);

      if (newDragStartIndex >= 0 && newDragStartIndex < array.length) {
        setDragStartIndex(newDragStartIndex);
        setDraggedBar({ value: array[newDragStartIndex], index: newDragStartIndex });
        setIsDragging(true);
        setDragOffset({
          x: x - (newDragStartIndex * barWidth),
          y: y - (canvas.height - (array[newDragStartIndex] * (canvas.height - 30) / Math.max(...array)))
        });
        const newPos = {
          x: x - dragOffset.x,
          y: y - dragOffset.y
        };
        setTargetPos(newPos);
        setCurrentPos(newPos);
        requestAnimationFrame(animate);
      }
    }
  }, [animate, array, dragOffset.x, dragOffset.y, isPaused]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTargetPos({
      x: x - dragOffset.x,
      y: canvas.height - (draggedBar?.value ?? 0) * ((canvas.height - 30) / Math.max(...array))
    });
  }, [array, dragOffset.x, dragOffset.y, draggedBar?.value, isDragging]);

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const barWidth = canvas.width / array.length;
      const newIndex = Math.floor(targetPos.x / barWidth);
      
      if (newIndex >= 0 && newIndex < array.length && draggedBar) {
        const newArray = [...array];
        newArray.splice(draggedBar.index, 1);
        newArray.splice(newIndex, 0, draggedBar.value);
        setArray(newArray);
      }

      setIsDragging(false);
      setDraggedBar(null);
      setDragStartIndex(null);
      setDragOffset({ x: 0, y: 0 });
      setTargetPos({ x: 0, y: 0 });
      setCurrentPos({ x: 0, y: 0 });
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    }
  }, [array, draggedBar, isDragging, targetPos.x]);

  // Effects
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = Math.min(maxWidth, window.innerWidth - 40);
      canvas.height = 400;
      drawArray();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [drawArray, maxWidth]);

  useEffect(() => {
    generateRandomArray(arraySize);
  }, [arraySize, generateRandomArray]);

  useEffect(() => {
    if (!isPaused && steps.length > 0) {
      sortingInterval.current = setInterval(() => {
        setCurrentStep(prev => {
          if (prev < steps.length) {
            setArray(steps[prev]);
            return prev + 1;
          }
          if (sortingInterval.current) clearInterval(sortingInterval.current);
          return prev;
        });
      }, simulationSpeed);
    }
    return () => {
      if (sortingInterval.current) clearInterval(sortingInterval.current);
    };
  }, [isPaused, simulationSpeed, steps]);

  const updateSpeedDisplay = (sliderValue: number) => {
    let speedText;
    if (simulationSpeed > 150) {
      speedText = "Sangat Lambat";
    } else if (simulationSpeed > 100) {
      speedText = "Lambat";
    } else if (simulationSpeed > 50) {
      speedText = "Sedang";
    } else if (simulationSpeed > 20) {
      speedText = "Cepat";
    } else {
      speedText = "Sangat Cepat";
    }
    return speedText;
  };

  const getAlgorithmInfo = (algorithm: string) => {
    switch (algorithm) {
      case 'bubble':
        return {
          description: 'Bubble Sort membandingkan elemen berdekatan dan menukarnya jika tidak dalam urutan yang benar.',
          complexity: 'Kompleksitas Waktu: O(n^2)'
        };
      case 'insertion':
        return {
          description: 'Insertion Sort membandingkan elemen berdekatan dan menukarnya jika tidak dalam urutan yang benar.',
          complexity: 'Kompleksitas Waktu: O(n^2)'
        };
      case 'quick':
        return {
          description: 'Quick Sort memilih pivot dan mempartisi array menjadi dua bagian.',
          complexity: 'Kompleksitas Waktu: O(n log n)'
        };
      case 'merge':
        return {
          description: 'Merge Sort membagi array menjadi dua bagian dan menggabungkannya kembali.',
          complexity: 'Kompleksitas Waktu: O(n log n)'
        };
      default:
        return {
          description: '',
          complexity: ''
        };
    }
  };

  return (
    <body>
      <main>
        <section className="contact-hero">
            <h1>Simulasi Algoritma Pengurutan</h1>
            <p>Pilih algoritma, atur ukuran array, dan mulai simulasi untuk melihat bagaimana algoritma pengurutan bekerja secara visual.</p>
        </section>

        <div className="simulation-controls">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <select id="algorithm-select"
              value={selectedAlgorithm}
              onChange={(e) => setSelectedAlgorithm(e.target.value as typeof selectedAlgorithm)}
            >
              <option value="bubble">Bubble Sort</option>
              <option value="merge">Merge Sort</option>
              <option value="quick">Quick Sort</option>
              <option value="insertion">Insertion Sort</option>
            </select>

            <div className="speed-control">
              <label htmlFor="speed-slider">Kecepatan:</label>
              <input
                type="range"
                id="speed-slider"
                min="1"
                max={MAX_SPEED}
                value={MAX_SPEED - simulationSpeed + 1}
                onChange={(e) => setSimulationSpeed(MAX_SPEED - parseInt(e.target.value) + 1)}
                className="w-full"
              />
              <span className="min-w-[100px]">{updateSpeedDisplay(simulationSpeed)}</span>
            </div>

            <div className="flex items-center space-x-4">
              <label htmlFor="array-size">Ukuran Array:</label>
              <input
                type="number"
                id="array-size"
                min="5"
                max="100"
                value={arraySize}
                onChange={(e) => setArraySize(parseInt(e.target.value))}
                className="w-24 px-2 py-1 border rounded-md"
              />
            </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => generateRandomArray(arraySize)}
              id="generate-array"
            >
              Generate Array
            </button>
            <button
              onClick={startSimulation}
              id="start-simulation"
            >
              {isPaused ? 'Resume' : 'Mulai Simulasi'}
            </button>
            <button
              onClick={pauseSimulation}
              id="pause-simulation"
            >
              {isPaused ? 'Resume' : 'Pause'}
            </button>
            <button
              onClick={resetSimulation}
              id="reset-simulation"
            >
              Reset
            </button>
          </div>

          <div className="simulation-area">
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              className="w-full bg-white"
            />
          </div>

          <div className="simulation-info">
            <h2>Informasi Algoritma</h2>
            <p id="algorithm-description">{getAlgorithmInfo(selectedAlgorithm).description}</p>
            <p id="algorithm-complexity">{getAlgorithmInfo(selectedAlgorithm).complexity}</p>
          </div>
        </div>
      </main>

        <footer>
            <p>2024 Virtual Lab: Sorting Algorithm.</p>
        </footer>

        <script src="src/screens/utils/hamburger.js"></script>
        <script src="src/screens/utils/transition.js"></script>
    </body>
  );
};

export default SortingVisualizer;