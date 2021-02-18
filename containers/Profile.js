
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
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';
import { Card,
   ListItem,
    Button, Icon,
    Input
   } from 'react-native-elements';
import { Col } from 'native-base';

class Profile extends Component {

  constructor(props) {
    super();
  }


  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.currentUser !== this.props.currentUser) {
      fetch('http://44.240.53.177/api/idn/account/profile',
        {
          method: 'GET',
          headers: {
            'Authorization': ""+this.props.currentUser.accessToken+""
          }
        })
        .then(e => e.json())
        .then( (response) =>{
          //console.log(response);
            this.props.userProfile(response);
        }).catch((error) => {
          alert(error, "error");
          //console.log("profile error",error);
        });
    }
}

  render() {

    if(!this.props.currentUser){
      return (
        <View style={{
          flex: 1, 
          alignItems: 'center',
          justifyContent: 'center',
      }}>
          <Text style={{marginLeft:20,marginRight:20,fontSize:15,textAlign:'center'}}>
          You are not logged in. Please log in and try again
          </Text>
          <TouchableOpacity style={styles.signinSignout} onPress={()=>this.props.navigation.navigate('SignInContainer')}>
                <Text style={styles.success}>Signin / Signup</Text>  
          </TouchableOpacity>
      </View>
      );
    }else if(this.props.currentUser && !this.props.profile){
      return (
        <View style={[styles.container1, styles.horizontal]}>
          <ActivityIndicator size="large" color={Color.primary} />
        </View>
      );
    }else if(this.props.profile
      && this.props.profile.user
      && !this.props.profile.user.emailConfirmed){
      return (
        <View style={{
          flex: 1, 
          alignItems: 'center',
          justifyContent: 'center',
      }}>
          <Text style={{marginLeft:20,marginRight:20,fontSize:15,textAlign:'center'}}>
          You are not confirmed your email,
           please confirm your email and try again
          </Text>
          <TouchableOpacity style={styles.signinSignout} onPress={()=>this.props.navigation.replace('ConfirmEmail')}>
                <Text style={styles.success}>Confirm Email</Text>  
          </TouchableOpacity>
      </View>
      );
    } else
    // return (
    //   <View style={styles.container}>
    //       <View style={styles.header}></View>
          
          // <Image style={styles.avatar}  
          // source={(this.props.profile.profile  &&  this.props.profile.profile.image!==null)?
          //     { uri: 'http://44.240.53.177/files/' + this.props.profile.profile.image } :
          //     { uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
          //     key={this.props.profile.id}
          // />

    //           <TouchableOpacity style={styles.saveButton}>
    //             <Text style={styles.success}>Save</Text>  
    //           </TouchableOpacity> 
    //           <TouchableOpacity style={styles.cancelButton}>
    //             <Text style={styles.danger}>Cancel</Text> 
    //           </TouchableOpacity>

    //           <View style={styles.body}>
    //         <View style={styles.bodyContent}>
              
    //           <Text style={{fontSize:50}}>salam</Text>
    //         </View>
    //     </View>
    //   </View>
    // );
    return (
      <View style={styles.container}>
          <View style={styles.header}></View>
          <Image style={styles.avatar}  
          source={(this.props.profile.profile  &&  this.props.profile.profile.image!==null)?
              { uri: 'http://44.240.53.177/files/' + this.props.profile.profile.image } :
              { uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
              key={this.props.profile.id}
          />
               <TouchableOpacity style={styles.saveButton}>
                 <Text style={styles.success}>Save</Text>  
               </TouchableOpacity> 
               <TouchableOpacity style={styles.cancelButton}>
                 <Text style={styles.danger}>Cancel</Text> 
               </TouchableOpacity>
          
          {/* <View style={styles.body}>
            <View style={styles.bodyContent}>
              <Text style={styles.name}>John Doe</Text>
              <Text style={styles.info}>UX Designer / Mobile developer</Text>
              <Text style={styles.description}>Lorem ipsum dolor sit amet, saepe sapientem eu nam. Qui ne assum electram expetendis, omittam deseruisse consequuntur ius an,</Text>
              
              <TouchableOpacity style={styles.buttonContainer}>
                <Text>Opcion 1</Text>  
              </TouchableOpacity>              
              <TouchableOpacity style={styles.buttonContainer}>
                <Text>Opcion 2</Text> 
              </TouchableOpacity>
            </View>
        </View> */}
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
  buttonContainer: {
    marginTop:10,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:250,
    borderRadius:30,
    backgroundColor: "#00BFFF",
  },
  signinSignout: {
    marginTop:20,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:200,
    borderRadius:30,
    backgroundColor: Color.primaryBackground,
  },
    saveButton: {
    marginTop:175,
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
    marginTop:175,
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

//bind state variables to variables
function mapStateToProps(state) {
  return {
    currentUser : state.currentUser,
    profile:state.profile,
  };
}

//bind actions to props actions
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      userLogined: userLogined,
      userProfile:userProfile
    }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(Profile);