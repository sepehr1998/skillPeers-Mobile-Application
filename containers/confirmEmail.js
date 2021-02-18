

import React, { Component } from 'react';
import { View, KeyboardAvoidingView, TextInput, StyleSheet, Text, Platform, TouchableWithoutFeedback, Button, Keyboard, Linking } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Toast, {DURATION} from 'react-native-easy-toast';
import Color from '../constants/color.js';
import { Col } from 'native-base';
import {getServerErrorMessage,getHttpErrorMessage} from '../util/Util.js';
import {
    userLogined,
    userProfile
  } from '../redux/actions/index';


class ConfirmEmail extends Component {

    constructor(props) {
        super()
        this.state =
        {
            code: '',
            errorMessage:'',
            successMessage:'Code Sent Successfully'
        }
    }
    setCode = (code) => {
        this.setState({code: code.replace(/[^0-9]/g, '') });
    };
    isEmpty(str) {
        return (!str || 0 === str.length || !str.trim());
      }

    confirmCode() {
        this.setState({ errorMessage: '' });
        this.setState({ successMessage: '' });

        if(this.isEmpty(this.state.code)){
            this.setState({ errorMessage: 'Please Enter Confirmation Code' });
            return;
        }

        fetch(
            'http://44.240.53.177/api/idn/account/confirm-email?', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "" + this.props.currentUser?.accessToken ? this.props.currentUser?.accessToken : '' + ""
            },
            body: JSON.stringify({
                input: "" + this.state.code + "",
            })
        })
            //.then((response) => response.json())
            .then((response) => {
                this.props.profile.user.emailConfirmed=true;
                this.props.navigation.replace('Home',{initialState:'Home'});
            })
            .catch((error) => {
                console.log(error);
                this.setState({ errorMessage:'Connection Error' });
            });
    }

    resend(){
        this.setState({ errorMessage: '' });
        this.setState({ successMessage: '' });
        fetch(
            'http://44.240.53.177/api/pub/account/send-otp?', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "" + this.props.currentUser?.accessToken ? this.props.currentUser?.accessToken : '' + ""
            },
            body: JSON.stringify({
                email: this.props.profile.user.email,
                sendViaEmail: true,
                sendViaSms: false,

            })
        })
            .then((response) => {
                this.setState({ successMessage:'Code Successfully Send'  });
            })
            .catch((error) => {
                //console.log("salam",error);
                this.setState({ errorMessage:'Connection Error' });
            });
    }

    render() {

        return (
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <Text style={styles.header}>Email Confirmation</Text>
                        <Text style={styles.header2}>Please check your email for the confirmation code</Text>
                        <TextInput 
                        placeholder="Confirm Code"
                         style={styles.textInput} 
                         value={this.state.code}
                         onChangeText={text => this.setCode(text)} />

                        
                        <View>
                              <Text style={styles.errorMessage}>{this.state.errorMessage}</Text> 
                              <Text style={styles.successMessage}>{this.state.successMessage}</Text> 
                        </View>


                        <View style={styles.btnContainer}>
                            <Button title="CONFIRM" onPress={() => this.confirmCode()} />
                        </View>
                        <View style={styles.btnContainer}>
                            <Button title="RESEND" onPress={() => this.resend()} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <Toast
                    ref={(toast) => this.toast = toast}
                    style={{backgroundColor:Color.primaryBackground}}
                    position='center'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1200}
                    opacity={0.9}
                />
            </KeyboardAvoidingView>
        );
    }
};


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
export default connect(mapStateToProps, matchDispatchToProps)(ConfirmEmail);

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    inner: {
        padding: 24,
        flex: 1,

    },
    header: {
        fontSize: 36,
        marginBottom: 48,
        alignSelf: 'center',
        marginTop: 20
    },
    header2: {
        fontSize: 12,
        marginBottom: 18,
        alignSelf: 'center',
        marginTop: 10
    },
    textInput: {
        height: 43,
        fontSize: 14,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#eaeaea',
        backgroundColor: '#fafafa',
        paddingLeft: 10,
        marginLeft: 15,
        marginRight: 15,
        marginTop: 5,
        marginBottom: 5,
        elevation: 5
    },
    btnContainer: {
        backgroundColor: "white",
        margin: 22,
        elevation: 20
    },
    errorMessage:{
      textAlign:'center',
      color:Color.error,
      fontSize:16,
      fontWeight:'bold'
    },
    successMessage:{
        textAlign:'center',
        color:Color.success,
        fontSize:16,
        fontWeight:'bold'
    }
});

