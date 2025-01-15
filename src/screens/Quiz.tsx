import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  ImageBackground,
} from "react-native";

interface Question {
  question: string;
  options: string[];
  correctAnswer: string;
}

const QuizScreen: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [timer, setTimer] = useState<number>(30);
  const [answerSelected, setAnswerSelected] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);

  const questions: Question[] = [
    {
      question: "Apa itu Bubble Sort?",
      options: [
        "Algoritma pengurutan yang membandingkan elemen berdekatan",
        "Algoritma pengurutan yang memilih pivot",
        "Algoritma pengurutan yang membagi array menjadi dua bagian",
      ],
      correctAnswer:
        "Algoritma pengurutan yang membandingkan elemen berdekatan",
    },
    {
      question: "Apa kompleksitas waktu rata-rata Quick Sort?",
      options: ["O(n)", "O(n log n)", "O(n^2)"],
      correctAnswer: "O(n log n)",
    },
    {
      question:
        "Algoritma pengurutan mana yang menggunakan teknik 'divide and conquer'?",
      options: ["Bubble Sort", "Insertion Sort", "Merge Sort"],
      correctAnswer: "Merge Sort",
    },
    {
      question:
        "Dalam kasus terburuk, algoritma pengurutan mana yang memiliki kompleksitas waktu O(n^2)?",
      options: ["Merge Sort", "Quick Sort", "Heap Sort"],
      correctAnswer: "Quick Sort",
    },
  ];

  // Timer
  useEffect(() => {
    if (timer > 0 && !answerSelected && !quizFinished) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else if (timer === 0 && !answerSelected) {
      handleNoAnswer();
    }
  }, [timer, answerSelected, quizFinished]);

  const handleAnswer = (selectedOption: string): void => {
    if (answerSelected) return;
    setAnswerSelected(true);

    const currentQuestion = questions[currentQuestionIndex];

    if (selectedOption === currentQuestion.correctAnswer) {
      setScore(score + 1);
      Alert.alert("Benar!", "Jawaban Anda benar.");
    } else {
      Alert.alert(
        "Salah!",
        `Jawaban yang benar adalah: ${currentQuestion.correctAnswer}`
      );
    }

    setTimeout(() => loadNextQuestion(), 1000);
  };

  const handleNoAnswer = (): void => {
    setAnswerSelected(true);
    Alert.alert("Waktu Habis!", "Anda tidak memilih jawaban.");
    setTimeout(() => loadNextQuestion(), 1000);
  };

  const loadNextQuestion = (): void => {
    setAnswerSelected(false);
    setTimer(30);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const restartQuiz = (): void => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimer(30);
    setAnswerSelected(false);
    setQuizFinished(false);
  };

  if (quizFinished) {
    return (
      <ImageBackground
        source={require("../../assets/images/52132.jpg")} // Ganti path ini sesuai lokasi gambar Anda
        style={styles.background}
        imageStyle={styles.imageStyle}
      >
        <View style={styles.overlay} />
        <View style={styles.container}>
          <Text style={styles.title}>Kuis Selesai!</Text>
          <Text style={styles.score}>
            Skor Anda: {score} dari {questions.length}
          </Text>
          <TouchableOpacity style={styles.startButton} onPress={restartQuiz}>
            <Text style={styles.startButtonText}>Mulai Ulang</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require("../../assets/images/52132.jpg")} // Ganti path ini sesuai lokasi gambar Anda
      style={styles.background}
      imageStyle={styles.imageStyle}
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Kuis: Virtual Lab</Text>
          <Text style={styles.subtitle}>
            Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
          </Text>
        </View>

        {/* Timer */}
        <Text style={styles.timer}>Waktu: {timer} detik</Text>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${
                  ((currentQuestionIndex + 1) / questions.length) * 100
                }%`,
              },
            ]}
          />
        </View>

        {/* Pertanyaan */}
        <Text style={styles.questionText}>
          {questions[currentQuestionIndex].question}
        </Text>

        {/* Pilihan Jawaban */}
        <FlatList
          data={questions[currentQuestionIndex].options}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.optionButton,
                answerSelected && {
                  backgroundColor:
                    item === questions[currentQuestionIndex].correctAnswer
                      ? "#4CAF50"
                      : "#f44336",
                },
              ]}
              disabled={answerSelected}
              onPress={() => handleAnswer(item)}
            >
              <Text style={styles.optionText}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  imageStyle: {
    opacity: 0.7, // Transparansi untuk menciptakan efek blur
    filter: "blur(10px)", // Blur untuk web
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // Menutupi seluruh layar
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Lapisan transparansi
  },
  container: {
    flex: 1,
    padding: 20,
    zIndex: 1, // Pastikan konten berada di atas overlay
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  subtitle: {
    fontSize: 16,
    color: "#ddd",
  },
  timer: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 20,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#4CAF50",
  },
  questionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: "#e0e0e0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  startButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 20,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  score: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginVertical: 20,
  },
});

export default QuizScreen;