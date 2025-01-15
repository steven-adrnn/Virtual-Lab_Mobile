import React, { useEffect } from "react";
import "../styles/style.css"; // Importing the CSS file
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { supabase } from "../initSupabase";
import { Button, useTheme } from "react-native-rapi-ui";
import { MainStackParamList } from "../types/navigation";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { BlurView } from 'expo-blur';


const HomeScreen: React.FC<
  NativeStackScreenProps<MainStackParamList, "MainTabs">
> = ({ navigation }) => {
  const { isDarkmode, setTheme } = useTheme();

  useEffect(() => {
    const hamburger = document.querySelector(".hamburger");
    const navMenu = document.querySelector(".nav-menu");
    const body = document.body;

    if (hamburger && navMenu) {
      const overlay = document.createElement("div");
      overlay.className = "menu-overlay";
      body.appendChild(overlay);

      let scrollPosition = 0;

      hamburger.addEventListener("click", () => {
        hamburger.classList.toggle("active");
        navMenu.classList.toggle("active");
        overlay.classList.toggle("active");

        if (!body.classList.contains("menu-open")) {
          scrollPosition = window.pageYOffset;
          body.classList.add("menu-open");
          body.style.top = `-${scrollPosition}px`;
        } else {
          body.classList.remove("menu-open");
          body.style.top = "";
          window.scrollTo(0, scrollPosition);
        }
      });

      overlay.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
        overlay.classList.remove("active");

        body.classList.remove("menu-open");
        body.style.top = "";
        window.scrollTo(0, scrollPosition);
      });
    }
  }, []);

  return (
    <body>
      {/* <header>
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <nav className="nav-menu">
          <ul>
            <li>
              <a href="#" className="active">
                Beranda
              </a>
            </li>
            <li>
              <a onClick={() => navigation.navigate("Simulation")}>Simulasi</a>
            </li>
            <li>
              <a href="course.html">Course</a>
            </li>
            <li>
              <a href="kuis.html">Kuis</a>
            </li>
            <li>
              <a href="about.html">Tentang Kami</a>
            </li>
            <li>
              <a href="contact.html">Kontak</a>
            </li>
            <li>
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
            </li>
          </ul>
        </nav>
      </header> */}
      <ImageBackground
        source={require("../../assets/images/8552601.jpg")} // Ganti path ini sesuai lokasi gambar Anda
        style={styles.background}
      >        
        <BlurView 
          intensity={50} // Intensitas blur (0-100)
          style={styles.blurOverlay}
        />
        <View style={styles.overlay} />
      
        <ScrollView style={styles.container}>
          <main>
            <section className="hero">
              <h1>Virtual Lab: Sorting Algorithm</h1>
              <p>
                Pelajari algoritma pengurutan melalui simulasi interaktif, course,
                dan kuis!
              </p>
            </section>

            <section className="features">
              <a
                onClick={() => navigation.navigate("Simulation")}
                className="feature"
              >
                <ImageBackground
                  source={require("../../assets/images/52132.jpg")} // Ganti path ini sesuai lokasi gambar Anda
                  style={styles.background}
                ></ImageBackground>
                  <h2>Simulasi</h2>
                  <p>Visualisasikan algoritma pengurutan secara langsung.</p>
              </a>
              <a
                onClick={() => navigation.navigate("Course")}
                className="feature"
              >
                <ImageBackground
                  source={require("../../assets/images/20944033.jpg")} // Ganti path ini sesuai lokasi gambar Anda
                  style={styles.background}
                ></ImageBackground>
                  <h2>Course</h2>
                  <p>Pelajari teori dan konsep algoritma pengurutan.</p>
                
              </a>
              
              <a
                onClick={() => navigation.navigate("Quiz")}
                className="feature"
                
              >
                <ImageBackground
                  source={require("../../assets/images/97350-OKYIEE-393.jpg")} // Ganti path ini sesuai lokasi gambar Anda
                  style={styles.background}
                ></ImageBackground>
                  <h2>Kuis</h2>
                  <p>Uji pemahaman Anda dengan kuis interaktif.</p>
              </a>
            </section>
          </main>

          <footer>
            <p>2024 Virtual Lab: Sorting Algorithm.</p>
          </footer>
        </ScrollView>
      </ImageBackground>

      <script src="src/screens/utils/hamburger.js"></script>
      <script src="src/screens/utils/transition.js"></script>
    </body>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    width: "100%",
    height: "100%",
    zIndex: 2,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    color: 'black',
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    zIndex: 1,
  },

  container: {
    padding: 20,
    borderRadius: 10,
    margin: 10,
    zIndex: 4, // Pastikan konten berada di atas lapisan blur
  },
});

export default HomeScreen;
