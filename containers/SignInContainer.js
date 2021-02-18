
import * as React from 'react';
import Color from '../constants/color.js';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Login from './Login';
import Register from './Register';

const Tab = createMaterialTopTabNavigator();

export default function SignInContainer() {
  return (
    <Tab.Navigator style={{paddingTop:40,backgroundColor:'white'}} 
    tabBarOptions={{
      activeTintColor: Color.primary,
      inactiveTintColor: 'gray',
      labelStyle: { fontSize: 12 },
      style: { backgroundColor: 'white' }
    }}>
      <Tab.Screen 
      name="SIGN IN" 
      component={Login} 
      />

      <Tab.Screen 
      name="SIGN UP" 
      component={Register} 
      />
    </Tab.Navigator>
  );
}




