import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Slider from "@react-native-community/slider";


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
  defaultArraySize = 10,
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
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<
    "bubble" | "insertion" | "quick" | "merge"
  >("bubble");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const sortingInterval = useRef<NodeJS.Timeout>();

  const MAX_SPEED = 200;

  const generateRandomArray = useCallback((size: number) => {
    const newArray = Array.from(
      { length: size },
      () => Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
  }, []);

  const drawArray = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
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

        ctx.shadowColor = "rgba(0, 0, 0, 0.2)";
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        ctx.fillStyle = "#02a9f7";
        ctx.fillRect(x, y, barWidth - 2, barHeight);

        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.fillStyle = "black";
        ctx.font = "12px Arial";
        ctx.textAlign = "center";
        ctx.fillText(value.toString(), x + barWidth / 2, y - 5);
      }
    });

    if (isDragging && draggedBar !== null) {
      const barHeight = draggedBar.value * scaleFactor;

      ctx.shadowColor = "rgba(0, 0, 0, 0.3)";
      ctx.shadowBlur = 8;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 4;

      ctx.fillStyle = "#ff4444";
      ctx.fillRect(currentPos.x, currentPos.y, barWidth - 2, barHeight);

      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      ctx.fillStyle = "black";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        draggedBar.value.toString(),
        currentPos.x + barWidth / 2,
        currentPos.y - 5
      );
    }
  }, [array, currentPos, draggedBar, dragStartIndex, isDragging]);

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

      let i = 0,
        j = 0,
        k = l;

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

  const animate = useCallback(() => {
    if (!isDragging) return;

    const easing = isTouch ? 0.4 : 0.2;

    setCurrentPos((prev) => ({
      x: prev.x + (targetPos.x - prev.x) * easing,
      y: prev.y + (targetPos.y - prev.y) * easing,
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
      case "bubble":
        newSteps = bubbleSort([...array]);
        break;
      case "insertion":
        newSteps = insertionSort([...array]);
        break;
      case "quick":
        newSteps = quickSort([...array]);
        break;
      case "merge":
        newSteps = mergeSort([...array]);
        break;
    }

    setSteps(newSteps);
  }, [
    array,
    bubbleSort,
    insertionSort,
    isPaused,
    mergeSort,
    quickSort,
    selectedAlgorithm,
  ]);

  const pauseSimulation = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const resetSimulation = useCallback(() => {
    if (sortingInterval.current) clearInterval(sortingInterval.current);
    setIsPaused(false);
    setCurrentStep(0);
    generateRandomArray(arraySize);
  }, [arraySize, generateRandomArray]);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
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
          setDraggedBar({
            value: array[newDragStartIndex],
            index: newDragStartIndex,
          });
          setIsDragging(true);
          setDragOffset({
            x: x - newDragStartIndex * barWidth,
            y:
              y -
              (canvas.height -
                (array[newDragStartIndex] * (canvas.height - 30)) /
                  Math.max(...array)),
          });
          const newPos = {
            x: x - dragOffset.x,
            y: y - dragOffset.y,
          };
          setTargetPos(newPos);
          setCurrentPos(newPos);
          requestAnimationFrame(animate);
        }
      }
    },
    [animate, array, dragOffset.x, dragOffset.y, isPaused]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLCanvasElement>) => {
      if (!isDragging) return;

      const canvas = canvasRef.current;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setTargetPos({
        x: x - dragOffset.x,
        y:
          canvas.height -
          (draggedBar?.value ?? 0) *
            ((canvas.height - 30) / Math.max(...array)),
      });
    },
    [array, dragOffset.x, dragOffset.y, draggedBar?.value, isDragging]
  );

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
      if (animationFrameId.current)
        cancelAnimationFrame(animationFrameId.current);
    }
  }, [array, draggedBar, isDragging, targetPos.x]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = Math.min(maxWidth, window.innerWidth - 40);
      canvas.height = 400;
      drawArray();
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [drawArray, maxWidth]);

  useEffect(() => {
    generateRandomArray(arraySize);
  }, [arraySize, generateRandomArray]);

  useEffect(() => {
    if (!isPaused && steps.length > 0) {
      sortingInterval.current = setInterval(() => {
        setCurrentStep((prev) => {
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
      case "bubble":
        return {
          description:
            "Bubble Sort membandingkan elemen berdekatan dan menukarnya jika tidak dalam urutan yang benar.",
          complexity: "Kompleksitas Waktu: O(n^2)",
        };
      case "insertion":
        return {
          description:
            "Insertion Sort membandingkan elemen berdekatan dan menukarnya jika tidak dalam urutan yang benar.",
          complexity: "Kompleksitas Waktu: O(n^2)",
        };
      case "quick":
        return {
          description:
            "Quick Sort memilih pivot dan mempartisi array menjadi dua bagian.",
          complexity: "Kompleksitas Waktu: O(n log n)",
        };
      case "merge":
        return {
          description:
            "Merge Sort membagi array menjadi dua bagian dan menggabungkannya kembali.",
          complexity: "Kompleksitas Waktu: O(n log n)",
        };
      default:
        return {
          description: "",
          complexity: "",
        };
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/4882066.jpg")}
      style={styles.background}
      imageStyle={styles.imageStyle}
    >
      <ScrollView style={styles.container}>

        <View>

          <Text style={styles.title}>Simulasi Algoritma Pengurutan</Text>
          <Text style={styles.description}>
            Pilih algoritma, atur ukuran array, dan mulai simulasi untuk
            melihat bagaimana algoritma pengurutan bekerja secara visual.
          </Text>
        
          <View style={styles.innerContainer}>
            <View style={styles.controls}>
              <View style={styles.controlRow}>
                <Text style={styles.label}>Pilih Algoritma:</Text>
                <Picker
                  selectedValue={selectedAlgorithm}
                  onValueChange={(value) => setSelectedAlgorithm(value)}
                  style={styles.picker}
                >
                  <Picker.Item label="Bubble Sort" value="bubble" />
                  <Picker.Item label="Merge Sort" value="merge" />
                  <Picker.Item label="Quick Sort" value="quick" />
                  <Picker.Item label="Insertion Sort" value="insertion" />
                </Picker>
              </View>

              <View style={styles.controlRow}>
                <Text style={styles.label}>Kecepatan:</Text>
                <Slider
                  style={styles.slider}
                  minimumValue={1}
                  maximumValue={MAX_SPEED}
                  value={MAX_SPEED - simulationSpeed + 1}
                  onValueChange={(value) =>
                    setSimulationSpeed(MAX_SPEED - Number(value) + 1)
                  }
                />
                <Text style={styles.speedLabel}>
                  {updateSpeedDisplay(simulationSpeed)}
                </Text>
              </View>

              <View style={styles.controlRow}>
                <Text style={styles.label}>Ukuran Array:</Text>
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="Masukkan ukuran array"
                  value={String(arraySize)}
                  onChangeText={(value) => {
                    const numericValue = value === "" ? 0 : parseInt(value, 10);
                    if (numericValue > 0) {
                      setArraySize(numericValue);
                      generateRandomArray(numericValue);
                    }
                  }}
                />
              </View>
            </View>

            <View style={styles.buttonGroup}>
              <TouchableOpacity
                style={[styles.button, styles.buttonFullWidth]}
                onPress={() => generateRandomArray(arraySize)}
              >
                <Text style={styles.buttonText}>Generate Array</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonFullWidth]}
                onPress={startSimulation}
              >
                <Text style={styles.buttonText}>
                  {isPaused ? "Resume" : "Mulai Simulasi"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonFullWidth]}
                onPress={pauseSimulation}
              >
                <Text style={styles.buttonText}>
                  {isPaused ? "Resume" : "Pause"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonFullWidth]}
                onPress={resetSimulation}
              >
                <Text style={styles.buttonText}>Reset</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.simulationArea}>
              <View style={styles.arrayContainer}>
                {array.map((value, index) => {
                  const barWidthPercent = 100 / array.length;
                  const showText = barWidthPercent > 3;

                  return (
                    <View
                      key={index}
                      style={[
                        styles.bar,
                        {
                          height: value * 2,
                          width: `${barWidthPercent}%`,
                        },
                      ]}
                    >
                      {showText && (
                        <Text
                          style={[
                            styles.barText,
                            {
                              fontSize: Math.min(
                                10,
                                Math.max(6, barWidthPercent)
                              ),
                            },
                          ]}
                          numberOfLines={1}
                          ellipsizeMode="clip"
                        >
                          {value}
                        </Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>

            <View style={styles.info}>
              <Text style={styles.infoTitle}>Informasi Algoritma</Text>
              <Text style={styles.infoText}>
                {getAlgorithmInfo(selectedAlgorithm).description}
              </Text>
              <Text style={styles.infoText}>
                {getAlgorithmInfo(selectedAlgorithm).complexity}
              </Text>
            </View>
          </View>
        </View>
        <Text></Text>
        <Text></Text>
        <Text></Text>
        <Text></Text>
        <Text></Text>
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageStyle: {
    opacity: 0.9,
    filter: "blur(5px)",

  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 70,
  },
  innerContainer: {
    padding: 16,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    paddingTop: 20,
    margin: 0,
  },
  description: {
    color: "white",
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 20,
    marginRight: 20,
    textAlign: "center",
  },
  header: {
    marginBottom: 16,
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
  },
  subtitle: {
    color: "lightgray",
    textAlign: "center",
    marginBottom: 10,
  },
  controls: {
    marginBottom: 16,
  },
  controlRow: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  picker: {
    height: 60,
    borderWidth: 5,
    borderColor: "#ccc",
    borderRadius: 8,    
  },
  slider: {
    width: "100%",
    marginVertical: 8,
  },
  speedLabel: {
    fontSize: 12,
    color: "#555",
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  buttonGroup: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonFullWidth: {
    flexBasis: "45%",
    marginBottom: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },

  backButton: {
    marginBottom: 20,
  },
  simulationArea: {
    height: 300,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 16,
    overflow: "hidden",
    paddingHorizontal: 8,
  },
  arrayContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: "100%",
    width: "100%",
    overflow: "hidden",
    paddingHorizontal: 8,
  },
  bar: {
    backgroundColor: "#007bff",
    justifyContent: "flex-end",
    alignItems: "center",
    overflow: "hidden",
    marginHorizontal: 0.5,
  },
  barText: {
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
    overflow: "hidden",
  },
  info: {
    padding: 16,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#555",
  },
});

export default SortingVisualizer;
