
import Color from '../constants/color.js';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Login from './login';
import Register from './register';

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity
} from 'react-native';

export default class Profile extends Component {

  render() {
    return (
      <View style={styles.container}>
          <View style={styles.header}></View>
          <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
              <TouchableOpacity style={styles.saveButton}>
                <Text style={styles.success}>Save</Text>  
              </TouchableOpacity> 
              <TouchableOpacity style={styles.cancelButton}>
                <Text style={styles.danger}>Cancel</Text> 
              </TouchableOpacity>

          <View style={styles.body}>
            <View style={styles.bodyContent}>
              
            </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: Color.primaryBackground,
    height:200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
    alignSelf:'center',
    position: 'absolute',
    marginTop:130
  },
  name:{
    fontSize:22,
    color:"#FFFFFF",
    fontWeight:'600',
  },
  body:{
    marginTop:40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding:30,
  },
  name:{
    fontSize:28,
    color: "#696969",
    fontWeight: "600"
  },
  info:{
    fontSize:16,
    color: "#00BFFF",
    marginTop:10
  },
  description:{
    fontSize:16,
    color: "#696969",
    marginTop:10,
    textAlign: 'center'
  },
  saveButton: {
    marginTop:140,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:100,
    left:20,
    position:'absolute',
    borderRadius:30,
    backgroundColor: "#67c23a",
  },
  cancelButton: {
    marginTop:140,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:100,
    right:20,
    position:'absolute',
    borderRadius:30,
    backgroundColor: "#f56c6c",
  },
  success:{
     color:'white'
  },
  danger:{
color:'white'
  },
});
