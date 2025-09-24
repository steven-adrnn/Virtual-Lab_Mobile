import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Button } from "react-native-rapi-ui";
import { supabase } from "../initSupabase";




const AboutScreen = () => {
  return (
    <ImageBackground
      source={require("../../assets/images/4882066.jpg")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <ScrollView style={styles.container}>
        
        <View style={styles.header}>
          <Text style={styles.title}>
            Tentang Virtual Lab: Sorting Algorithm
          </Text>
        </View>

        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>
            Membantu Anda memahami algoritma pengurutan dengan cara yang
            menyenangkan dan interaktif
          </Text>
        </View>

        <View style={styles.aboutContent}>
          <View style={styles.card}>
            <Ionicons
              name="ellipse"
              size={50}
              color="black"
              style={styles.icon}
            />
            <Text style={styles.cardTitle}>Misi Kami</Text>
            <Text style={styles.cardText}>
              Menyediakan alat pembelajaran untuk algoritma pengurutan, dapat
              memvisualisasikan, memahami konsep-konsep penting dalam ilmu
              komputer.
            </Text>
          </View>

          <View style={styles.card}>
            <Ionicons
              name="people"
              size={50}
              color="black"
              style={styles.icon}
            />
            <Text style={styles.cardTitle}>Tim Kami</Text>
            <Text style={styles.cardText}>
              Tim kami terdiri dari para ahli di bidang ilmu komputer dan
              pendidikan yang berkomitmen untuk menciptakan pengalaman belajar
              yang unggul bagi semua pengguna kami.
            </Text>
          </View>

          <View style={styles.card}>
            <Ionicons
              name="stats-chart"
              size={50}
              color="black"
              style={styles.icon}
            />
            <Text style={styles.cardTitle}>Pencapaian Kami</Text>
            <Text style={styles.cardText}>
              Sejak diluncurkan, platform kami telah membantu ribuan siswa dan
              profesional dalam memahami algoritma pengurutan dengan lebih baik.
            </Text>
          </View>
        </View>
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
    resizeMode: "cover",
    zIndex: 0,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  backButton: {
    marginBottom: 20,
  },
  
  container: {
    padding: 20,
    paddingTop: 70,
    
    zIndex: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginLeft: 10,
  },
  heroSection: {
    marginBottom: 20,
  },
  heroTitle: {
    textAlign: "center",
    fontSize: 16,
    color: "#fff",
  },
  aboutContent: {
    marginTop: 10,
  },
  backgroundImage: {
    opacity: 0.9,
    filter: "blur(5px)",
  },
  card: {
    marginBottom: 20,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    elevation: 0,
  },
  icon: {
    marginBottom: 10,
    alignSelf: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  cardText: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});

export default AboutScreen;
