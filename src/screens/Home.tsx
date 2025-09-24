import React from "react";
import "../styles/style.css";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { supabase } from "../initSupabase";
import { Button } from "react-native-rapi-ui";
import { MainStackParamList } from "../types/navigation";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

const HomeScreen: React.FC<
  NativeStackScreenProps<MainStackParamList>
> = ({ navigation }) => {
  return (
    <ImageBackground
      source={require("../../assets/images/4882066.jpg")}
      style={styles.background}
      imageStyle={styles.backgroundImage}
    >
      <ScrollView style={styles.container}>
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Virtual Lab: Sorting Algorithm</Text>
          <Text style={styles.heroText}>
            Pelajari algoritma pengurutan melalui simulasi interaktif,
            course, dan kuis!
          </Text>
        </View>

        <View style={styles.featuresContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Simulation")}
            style={styles.featureCard}
          >
            <ImageBackground
              source={require("../../assets/images/8552601.jpg")}
              style={styles.featureBackground}
            >
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Simulasi</Text>
                <Text style={styles.featureText}>Visualisasikan algoritma pengurutan secara langsung.</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Course")}
            style={styles.featureCard}
          >
            <ImageBackground
              source={require("../../assets/images/20944033.jpg")}
              style={styles.featureBackground}
            >
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Course</Text>
                <Text style={styles.featureText}>Pelajari teori dan konsep algoritma pengurutan.</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.navigate("Quiz")}
            style={styles.featureCard}
          >
            <ImageBackground
              source={require("../../assets/images/97350-OKYIEE-393.jpg")}
              style={styles.featureBackground}
            >
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>Kuis</Text>
                <Text style={styles.featureText}>Uji pemahaman Anda dengan kuis interaktif.</Text>
              </View>
            </ImageBackground>
          </TouchableOpacity>
          
        </View>
        <Button
          text="Logout"
          onPress={async () => {
            const { error } = await supabase.auth.signOut();
            if (!error) {
              alert("Signed out!");
            }
            if (error) {
              alert(error.message);
            }
          }}
        />

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
    width: '100%',
    height: '100%',
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  
  container: {
    flex: 1,
    zIndex: 2,
    padding: 15,
    paddingTop: 70,
  },
  backgroundImage: {
    opacity: 0.9,
    filter: "blur(5px)",
  },
  heroSection: {
    backgroundColor: 'rgba(2, 169, 247, 0.9)',
    padding: 20,
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 10,
  },
  heroText: {
    fontSize: 16,
    color: '#fff',
    textAlign: 'center',
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    padding: 10,
    marginTop: 20,
  },
  featureCard: {
    width: 200,
    height: 250,
    margin: 10,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 1, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  featureBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  featureContent: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    padding: 15,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 5,
  },
  featureText: {
    fontSize: 14,
    color: '#fff',
    textAlign: 'center',
  },
});

export default HomeScreen;