
import 'react-native-gesture-handler';
import React from 'react';

// import NetInfo from "@react-native-community/netinfo";
import ProslinkSlider from '../containers/ProslinkSlider';
import CardList from '../components/CardList';
import Authentication from '../containers/authentication';
import ConfirmEmail from '../containers/confirmEmail';
import { NavigationContainer,SafeAreaProvider } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../containers/Home';
import AboutUs from '../containers/AboutUs';
import SignInContainer from '../containers/SignInContainer';
import TestCode from '../containers/TestCode';

const Stack = createStackNavigator();

const Navigation   = () => {
  return (
    <>
     <NavigationContainer> 
      <Stack.Navigator initialRouteName="Home" headerMode="none" > 

        <Stack.Screen name="Slider" component={ProslinkSlider} options={{headerShown: false}} />
        <Stack.Screen name="Home" component={Home} /> 
        <Stack.Screen name="SignInContainer" component={SignInContainer} /> 
        <Stack.Screen name="Authentication" component={Authentication} /> 
        <Stack.Screen name="CardList" component={CardList} /> 
        <Stack.Screen name="TestCode" component={TestCode} /> 
        <Stack.Screen name="ConfirmEmail" component={ConfirmEmail} /> 
      </Stack.Navigator> 
     </NavigationContainer> 
    </>
  );
};
export default Navigation;