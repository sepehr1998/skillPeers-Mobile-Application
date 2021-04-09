import * as React from "react";
import { Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Color from "../constants/color.js";
import About from "./About";
import Settings from "./Settings";
import Profile from "./Profile";
import CardList from "../components/CardList";

const Tab = createBottomTabNavigator();

export default function Home({ route }) {
  let initialState = "Home";
  if (route.params && route.params.initialState) {
    initialState = route.params.initialState;
  }

  return (
    <Tab.Navigator
      initialRouteName={initialState}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else if (route.name === "About") {
            iconName = focused
              ? "information-circle"
              : "information-circle-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBarOptions={{
        activeTintColor: Color.primaryBackground,
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="Settings" component={Settings} />
      <Tab.Screen name="About" component={About} />
      <Tab.Screen name="Home" component={CardList} />
    </Tab.Navigator>
  );
}
