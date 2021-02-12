
import React from 'react';
import { Image ,Text,View }from 'react-native';
import Login from './login';
import Register from './register';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome';



const Tab = createBottomTabNavigator();
export default function Authentication({route}){
    const { initRoute } = route.params;
  
 

  let eventstring = JSON.stringify(initRoute).replace(/"/g, "");

    return (
        <Tab.Navigator initialRouteName={eventstring}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
    
            if (route.name === 'Login') {
              iconName = focused ? 'list' : 'table';
            } else if (route.name === 'Register') {
              iconName = focused ? 'list' : 'table';
            }
            return <Icon name={iconName} size={size} color={color}  />;
          },
        })}
        tabBarOptions={{
          activeTintColor: 'tomato',
          inactiveTintColor: 'gray',
        }}
      >
        <Tab.Screen name="Login" component={Login} />
        <Tab.Screen name="Register" component={Register} />
      </Tab.Navigator> 
    )
}