
import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Color from '../constants/color.js';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

const Tab = createMaterialTopTabNavigator();


function About() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'#FFFFFF' }}>
      <Text>Under Construction</Text>
    </View>
  );
}


function Contact() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center',backgroundColor:'#FFFFFF' }}>
      <Text>Under Construction</Text>
    </View>
  );
}

export default function AboutUs() {
  return (
    <Tab.Navigator style={{paddingTop:40,backgroundColor:'white'}} 
    tabBarOptions={{
      activeTintColor: Color.primary,
      inactiveTintColor: 'gray',
      labelStyle: { fontSize: 12 },
      style: { backgroundColor: 'white' }
    }}>
      <Tab.Screen name="About Us" component={About} />
      <Tab.Screen name="Contact Us" component={Contact} />
    </Tab.Navigator>
  );
}




