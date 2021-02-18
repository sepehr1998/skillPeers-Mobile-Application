
import Color from '../constants/color.js';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Login from './Login';
import Register from './Register';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import {
  userLogined,
  userProfile
} from '../redux/actions/index';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  Button,
  TouchableOpacity
} from 'react-native';
import { ImageBackground } from 'react-native';

class UnderConstruction extends Component {

  constructor(props) {
    super();

  }

  render() {
    return (
      <View style={{
        flex: 1, 
        alignItems: 'center',
        justifyContent: 'center', 
        backgroundColor: Color.primary
    }}>
    <Image 
    source={require('../assets/under-construction.png')} 
      style={{width:200,height:200}}
    />
        <Text style={{color: 'white',fontSize:20,fontWeight:'bold',marginTop:20}}>
            Under Construction
        </Text>


        <View style={styles.buttonContainer}>
        <TouchableOpacity 
              style={[styles.button, { backgroundColor: '#f3f7fd' }]} 
              onPress={() =>this.props.navigation.pop() }>
              <Text style={styles.buttonText}>Go Back</Text>
        </TouchableOpacity> 
        </View>
    </View>
  );
  }
}


const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
    position:'absolute',
    bottom:30
  },
  button: {
    flex: 1,
    paddingVertical: 7,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: '#1cb278',
  },
  buttonText: {
    color: Color.primary,
    fontWeight: '700',
    textAlign: 'center',
  },
});

export default UnderConstruction;