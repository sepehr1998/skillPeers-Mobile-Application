import * as React from "react";
import Color from "../constants/color.js";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Inbox from "./Inbox.js";
import Outbox from "./Outbox.js";
import { Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { BackHandler } from "react-native";

const Tab = createMaterialTopTabNavigator();
const MessageContainer = (probs) => {
  BackHandler.addEventListener("hardwareBackPress", () => {
    console.log("back presses");
  });

  return (
    <View style={{ width: "100%", height: "100%", backgroundColor: "white" }}>
      <TouchableOpacity
        style={styles.messagesButton}
        onPress={() => {
          probs.navigation.replace("Home", { initialState: "Profile" });
        }}
      >
        <Text style={styles.messageText}>back</Text>
      </TouchableOpacity>
      <Tab.Navigator
        style={{ backgroundColor: "white" }}
        tabBarOptions={{
          activeTintColor: Color.primary,
          inactiveTintColor: "gray",
          labelStyle: { fontSize: 12 },
          style: { backgroundColor: "white" },
        }}
      >
        <Tab.Screen name="INBOX" component={Inbox} />

        <Tab.Screen name="OUTBOX" component={Outbox} />
      </Tab.Navigator>
    </View>
  );
};

export default MessageContainer;

const styles = StyleSheet.create({
  messagesButton: {
    height: 35,
    marginTop: 50,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 30,
    backgroundColor: "#409eff",
  },
  messageText: {
    color: "#FFF",
  },
});
