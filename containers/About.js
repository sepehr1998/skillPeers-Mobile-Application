
import * as React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Color from '../constants/color.js';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import AboutUs from '../components/AboutUs';
import ContactUs from '../components/ContactUs';

const Tab = createMaterialTopTabNavigator();


export default function About() {
  return (
    <Tab.Navigator style={{paddingTop:40,backgroundColor:'white'}} 
    tabBarOptions={{
      activeTintColor: Color.primary,
      inactiveTintColor: 'gray',
      labelStyle: { fontSize: 12 },
      style: { backgroundColor: 'white' }
    }}>
      <Tab.Screen name="About Us" component={AboutUs} />
      <Tab.Screen name="Contact Us" component={ContactUs} />
    </Tab.Navigator>
  );
}




