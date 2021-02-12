
import * as React from 'react';
import Color from '../constants/color.js';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Login from './login';
import Register from './register';

const Tab = createMaterialTopTabNavigator();

export default function SignInContainer() {
  return (
    <Tab.Navigator style={{marginTop:37}} 
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




