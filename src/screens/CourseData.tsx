import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from "react-native";

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
      image: require("../../assets/images/Bubble-sort-example-300px.gif"),
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
      image: require("../../assets/images/simulasi-icon.jpg"),
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
      image: require("../../assets/images/Sorting_quicksort_anim.gif"),
    },
    {
      title: "Insertion Sort",
      description:
        "Insertion Sort adalah algoritma yang membangun array terurut satu elemen pada satu waktu. Ini bekerja dengan memindahkan setiap elemen ke posisi yang sesuai dalam sub-array yang sudah terurut di sebelah kiri.",
      steps: [
        "Mulai dari elemen kedua, bandingkan dengan elemen sebelumnya.",
        "Jika elemen pertama lebih besar, tukar posisi mereka.Jika elemen tersebut lebih kecil, pindahkan elemen ke posisi yang sesuai di sub-array yang sudah terurut.",
        "Ulangi proses ini untuk setiap elemen hingga seluruh array terurut.",
      ],
      complexity: {
        best: " 𝑂(𝑛) (jika array sudah terurut)",
        worst: "𝑂(𝑛^2)",
        average: "𝑂(𝑛^2)",
      },
      image: require("../../assets/images/Insertion-sort-example-300px.gif"),
    },
  ],
};

export default function CourseDetailsStatic() {
  return (
    <ImageBackground
      source={require("../../assets/images/4882066.jpg")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <ScrollView style={styles.container}>
        
        <View>
          <Text style={styles.title}>{courseData.name}</Text>
          <Text style={styles.subtitle}>By Virtual Lab</Text>
          <Text style={styles.description}>{courseData.description}</Text>

          {courseData.algorithms.map((algorithm, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.algorithmTitle}>{algorithm.title}</Text>
              <Text style={styles.algorithmDescription}>
                {algorithm.description}
              </Text>
              <Image source={algorithm.image} style={styles.algorithmImage} />
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
        <Text></Text>
        <Text></Text>
        <Text></Text>
        <Text></Text>
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    width: "100%",
    height: "100%",
  },
  backgroundImage: {
    opacity: 0.9,
    filter: "blur(5px)",
  },
  container: {
    padding: 20,
    paddingTop: 70,
  },
  backButton: {
    marginBottom: 20,
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
  description: {
    color: "white",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  algorithmTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  algorithmDescription: {
    color: "black",
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
  algorithmImage: {
    width: "100%",
    height: undefined,
    aspectRatio: 1.5,
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
