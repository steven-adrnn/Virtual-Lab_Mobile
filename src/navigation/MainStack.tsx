import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { MainStackParamList } from "../types/navigation";
// import SecondScreen from "../screens/SecondScreen";
import MainTabs from "./MainTabs";
import Simulation from "../screens/Simulation";
import Course from "../screens/CourseData";
import Quiz from "../screens/Quiz";
import Home from "../screens/Home";

const MainStack = createNativeStackNavigator<MainStackParamList>();
const Main = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name="MainTabs" component={MainTabs} />
      <MainStack.Screen name="Simulation" component={Simulation} />
      <MainStack.Screen name="Course" component={Course} />
      <MainStack.Screen name="Quiz" component={Quiz} />
      <MainStack.Screen name="Home" component={Home} />
      {/* <MainStack.Screen name="SecondScreen" component={SecondScreen} /> */}
    </MainStack.Navigator>
  );
};

export default Main;
