import React, { useEffect } from "react";
import '../styles/style.css'; // Importing the CSS file
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { supabase } from "../initSupabase";
import { Button, useTheme } from "react-native-rapi-ui";
import { MainStackParamList } from "../types/navigation";

const HomeScreen: React.FC<NativeStackScreenProps<MainStackParamList, "MainTabs">> = ({
  navigation,
}) => {
  const { isDarkmode, setTheme } = useTheme();

  useEffect(() => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const body = document.body;

    if (hamburger && navMenu) {
      const overlay = document.createElement('div');
      overlay.className = 'menu-overlay';
      body.appendChild(overlay);

      let scrollPosition = 0;

      hamburger.addEventListener('click', () => {
          hamburger.classList.toggle('active');
          navMenu.classList.toggle('active');
          overlay.classList.toggle('active');
          
          if (!body.classList.contains('menu-open')) {
              scrollPosition = window.pageYOffset;
              body.classList.add('menu-open');
              body.style.top = `-${scrollPosition}px`;
          } else {
              body.classList.remove('menu-open');
              body.style.top = '';
              window.scrollTo(0, scrollPosition);
          }
      });

      overlay.addEventListener('click', () => {
          hamburger.classList.remove('active');
          navMenu.classList.remove('active');
          overlay.classList.remove('active');
          
          body.classList.remove('menu-open');
          body.style.top = '';
          window.scrollTo(0, scrollPosition);
      });
    }
  }, []);

  return (
    <body>
      <header>
        <div className="hamburger">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <nav className="nav-menu">
          <ul>
            <li><a href="#" className="active">Beranda</a></li>
            <li><a onClick={() => navigation.navigate('Simulation')}>Simulasi</a></li>
            <li><a href="course.html">Course</a></li>
            <li><a href="kuis.html">Kuis</a></li>
            <li><a href="about.html">Tentang Kami</a></li>
            <li><a href="contact.html">Kontak</a></li>
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
      </header>

      <main>
        <section className="hero">
          <h1>Virtual Lab: Sorting Algorithm</h1>
          <p>Pelajari algoritma pengurutan melalui simulasi interaktif, course, dan kuis!</p>
        </section>

        <section className="features">
          <a onClick={() => navigation.navigate('Simulation')} className="feature">
            <h2>Simulasi</h2>
            <p>Visualisasikan algoritma pengurutan secara langsung.</p>
          </a>
          <a href="course.html" className="feature">
            <h2>Course</h2>
            <p>Pelajari teori dan konsep algoritma pengurutan.</p>
          </a>
          <a href="kuis.html" className="feature">
            <h2>Kuis</h2>
            <p>Uji pemahaman Anda dengan kuis interaktif.</p>
          </a>
        </section>
      </main>

      <footer>
        <p>2024 Virtual Lab: Sorting Algorithm.</p>
      </footer>

      <script src="src/screens/utils/hamburger.js"></script>
      <script src="src/screens/utils/transition.js"></script>
    </body>
  );
}

export default HomeScreen;
