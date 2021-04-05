
import * as React from 'react';
import Color from '../constants/color.js';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Inbox from './Inbox.js';
import Outbox from './Outbox.js';

const Tab = createMaterialTopTabNavigator();

export default function MessageContainer() {
  return (
    <Tab.Navigator style={{paddingTop:40,backgroundColor:'white'}} 
    tabBarOptions={{
      activeTintColor: Color.primary,
      inactiveTintColor: 'gray',
      labelStyle: { fontSize: 12 },
      style: { backgroundColor: 'white' }
    }}>
      <Tab.Screen 
      name="INBOX" 
      component={Inbox} 
      />

      <Tab.Screen 
      name="OUTBOX" 
      component={Outbox} 
      />
    </Tab.Navigator>
  );
}




