
import 'react-native-gesture-handler';
import React from 'react';

// import NetInfo from "@react-native-community/netinfo";
import ProslinkSlider from '../containers/ProslinkSlider';
import CardList from '../components/CardList';
import ConfirmEmail from '../containers/ConfirmEmail';
import { NavigationContainer,SafeAreaProvider } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../containers/Home';
import SignInContainer from '../containers/SignInContainer';
import UnderConstruction from '../containers/UnderConstruction';
import UserDetail from '../containers/UserDetail';
import MessageContainer from '../containers/MessageContainer';

const Stack = createStackNavigator();

const Navigation   = () => {
  return (
    <>
     <NavigationContainer> 
      <Stack.Navigator initialRouteName="Slider" headerMode="none" > 

        <Stack.Screen name="Slider" component={ProslinkSlider} options={{headerShown: false}} />
        <Stack.Screen name="Home" component={Home} /> 
        <Stack.Screen name="SignInContainer" component={SignInContainer} /> 
        <Stack.Screen name="CardList" component={CardList} /> 
        <Stack.Screen name="ConfirmEmail" component={ConfirmEmail} /> 
        <Stack.Screen name="UnderConstruction" component={UnderConstruction} /> 
        <Stack.Screen name="UserDetail" component={UserDetail} />
        <Stack.Screen name="MessageContainer" component={MessageContainer} />  
      </Stack.Navigator> 
     </NavigationContainer> 
    </>
  );
};
export default Navigation;