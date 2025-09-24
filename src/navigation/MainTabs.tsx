import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { themeColor, useTheme } from "react-native-rapi-ui";

import Home from "../screens/Home";
import About from "../screens/About";
import Simulation from "../screens/Simulation";
import Quiz from "../screens/Quiz";
import Course from "../screens/CourseData";

const Tabs = createBottomTabNavigator();

const MainTabs = () => {
  const { isDarkmode } = useTheme();

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          borderTopColor: isDarkmode ? themeColor.dark100 : "#c0c0c0",
          backgroundColor: isDarkmode ? themeColor.dark200 : "#ffffff",
          paddingVertical: 8,
          height: 70,
        },
        tabBarShowLabel: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName: "key" | "search" | "repeat" | "link" | "at" | "filter" | "push" | "map" | "scale" | "home" | "home-outline" | "information-circle" | "information-circle-outline" | "rocket" | "rocket-outline" | "create" | "create-outline" | "school" | "school-outline" | undefined;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "About") {
            iconName = focused
              ? "information-circle"
              : "information-circle-outline";
          } else if (route.name === "Simulation") {
            iconName = focused ? "rocket" : "rocket-outline";
          } else if (route.name === "Quiz") {
            iconName = focused ? "create" : "create-outline";
          } else if (route.name === "Course") {
            iconName = focused ? "school" : "school-outline";
          }

          return (
            <View style={{ alignItems: "center", justifyContent: "center" }}>
              <Ionicons name={iconName} size={24} color={color} />
              <Text
                style={{
                  fontSize: 12,
                  color: focused ? themeColor.primary : "#808080",
                  marginTop: 2,
                }}
              >
                {route.name}
              </Text>
            </View>
          );
        },
        tabBarActiveTintColor: themeColor.primary,
        tabBarInactiveTintColor: isDarkmode ? "#888" : "#aaa",
      })}
    >
      <Tabs.Screen name="Home" component={Home} />
      <Tabs.Screen name="About" component={About} />
      <Tabs.Screen name="Simulation" component={Simulation} />
      <Tabs.Screen name="Quiz" component={Quiz} />
      <Tabs.Screen name="Course" component={Course} />
    </Tabs.Navigator>
  );
};

export default MainTabs;
