import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const courseData = {
  name: "Algoritma Pengurutan",
  description:
    "Pelajari berbagai algoritma pengurutan populer dan bagaimana cara kerjanya. Klik pada setiap algoritma untuk melihat penjelasan detail dan video tutorial.",
  algorithms: [
    {
      title: "Bubble Sort",
      description:
        'Bubble Sort adalah algoritma sorting sederhana yang berulang kali menukar elemen yang berdekatan jika mereka dalam urutan yang salah. Ini dinamakan "Bubble" karena elemen terbesar perlahan-lahan naik ke atas seperti gelembung.',
      steps: [
        "Bandingkan elemen pertama dengan elemen kedua.",
        "Jika elemen pertama lebih besar, tukar posisi mereka.",
        "Lanjutkan membandingkan setiap elemen dengan elemen berikutnya dan tukar jika perlu.",
        "Setelah satu iterasi, elemen terbesar akan berada di posisi terakhir.",
        "Ulangi langkah 1-4 untuk elemen yang tersisa hingga tidak ada lagi yang perlu ditukar.",
      ],
      complexity: {
        best: "O(n)",
        worst: "O(n^2)",
        average: "O(n^2)",
      },
      image: "https://example.com/bubble-sort-example.gif",
    },
    {
      title: "Merge Sort",
      description:
        "Merge Sort adalah algoritma Divide and Conquer, yang membagi array menjadi dua bagian hingga setiap sub-array hanya memiliki satu elemen, kemudian menggabungkan (merge) sub-array tersebut secara bertahap dalam urutan yang benar.",
      steps: [
        "Bagi array menjadi dua bagian hingga tidak bisa dibagi lagi.",
        "Gabungkan sub-array tersebut dengan membandingkan elemen-elemen dari sub-array dan menyusunnya dalam urutan yang benar.",
        "Ulangi proses penggabungan hingga seluruh array terurut.",
      ],
      complexity: {
        best: "O(n log n)",
        worst: "O(n log n)",
        average: "O(n log n)",
      },
      image: "https://example.com/merge-sort-example.png",
    },
    {
      title: "Quick Sort",
      description:
        "Quick Sort juga merupakan algoritma Divide and Conquer yang memilih satu elemen sebagai pivot dan mengatur elemen lainnya sedemikian rupa sehingga elemen yang lebih kecil dari pivot berada di kiri dan yang lebih besar berada di kanan.",
      steps: [
        "Pilih pivot (biasanya elemen terakhir).",
        "Atur array sehingga elemen yang lebih kecil dari pivot berada di kiri dan elemen yang lebih besar berada di kanan.",
        "Terapkan Quick Sort secara rekursif pada sub-array kiri dan sub-array kanan.",
      ],
      complexity: {
        best: "O(n log n)",
        worst: "O(n^2)",
        average: "O(n log n)",
      },
      image: "https://example.com/quick-sort-example.gif",
    },
  ],
};

export default function CourseDetailsStatic() {
  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        onPress={() => console.log("Go Back")}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back-sharp" size={24} color="black" />
      </TouchableOpacity>
      <View>
        <Text style={styles.title}>{courseData.name}</Text>
        <Text style={styles.subtitle}>By Virtual Lab</Text>
        <Text style={styles.description}>{courseData.description}</Text>

        {courseData.algorithms.map((algorithm, index) => (
          <View key={index} style={styles.algorithmContainer}>
            <Text style={styles.algorithmTitle}>{algorithm.title}</Text>
            <Text style={styles.algorithmDescription}>
              {algorithm.description}
            </Text>
            <Image
              source={{ uri: algorithm.image }}
              style={styles.algorithmImage}
            />
            <Text style={styles.sectionTitle}>Langkah-langkah:</Text>
            {algorithm.steps.map((step, stepIndex) => (
              <Text key={stepIndex} style={styles.stepText}>
                - {step}
              </Text>
            ))}
            <Text style={styles.sectionTitle}>Kompleksitas Waktu:</Text>
            <Text style={styles.complexityText}>
              Best Case: {algorithm.complexity.best}
            </Text>
            <Text style={styles.complexityText}>
              Worst Case: {algorithm.complexity.worst}
            </Text>
            <Text style={styles.complexityText}>
              Average Case: {algorithm.complexity.average}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
  },
  backButton: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    color: "gray",
    marginBottom: 10,
  },
  description: {
    color: "gray",
    marginBottom: 20,
  },
  algorithmContainer: {
    marginBottom: 20,
  },
  algorithmTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  algorithmDescription: {
    color: "gray",
    marginTop: 10,
  },
  algorithmImage: {
    height: 150,
    marginTop: 10,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
  },
  stepText: {
    color: "gray",
    marginLeft: 10,
  },
  complexityText: {
    color: "gray",
  },
});
