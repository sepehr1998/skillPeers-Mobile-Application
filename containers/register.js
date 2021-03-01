
import React, { Component } from 'react';
import { View, KeyboardAvoidingView, TextInput, StyleSheet, Text
    ,Image, TouchableWithoutFeedback, Button,Platform,
     Keyboard, Linking,TouchableOpacity } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements'
import {userLogined} from '../redux/actions/index';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Color from '../constants/color.js';
import Toast, {DURATION} from 'react-native-easy-toast';
import {checkPwdStrength, getStrengthError} from "../util/passChecker";
import { ProgressBar, Colors } from 'react-native-paper';
import {getServerErrorMessage,getHttpErrorMessage} from '../util/Util.js';

class Register extends Component {

    constructor(props) {
        super()
        this.state =
        {
            checked: false,
            username: '',
            email: '',
            password: '',
            rePassword: '',
            strengthColor : Colors.blueGrey600,
            passStrength : 0,
            errorText:'',
        }
        //this.username = this.username.bind(this);
    }
    setUsername = (username) => {
        this.setState({ username: username });
    };
    setEmail = (email) => {
        this.setState({ email: email });
    };
    setPassword = (password) => {
        this.setState({ password: password });
       
        let strength = checkPwdStrength(password.trim());
                if (strength == "good") {
                    this.setState({ strengthColor: Colors.green700 });
                    this.setState({ passStrength: 1 });
                } else if (strength == "not-bad") {
                    this.setState({ strengthColor: Colors.blue700 });
                    this.setState({ passStrength: 0.6 });
                } else {
                    this.setState({ strengthColor: Colors.lightBlueA700 });
                    this.setState({ passStrength: 0.3 });
                }



    };
    setRepassword = (rePassword) => {
        this.setState({ rePassword: rePassword });
    };


    notifyMessage(msg){
        //this.toast.show(msg);
        this.setState({ errorText:msg });
      }
      
    isEmpty(str) {
        return (!str || 0 === str.length || !str.trim());
    }
    validateEmail(email) 
    {
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }

     signup() {
        if(this.isEmpty(this.state.username)){
            this.notifyMessage('username is required');
            return;
        }

        if(this.isEmpty(this.state.email)){
            this.notifyMessage('email is required');
            return;
        }

        if(!this.validateEmail(this.state.email)){
            this.notifyMessage('email is not valid');
            return;
        }

        if(this.isEmpty(this.state.password)){
            this.notifyMessage('password is required');
            return;
        }

        if(this.state.passStrength<0.6){
            this.notifyMessage(getStrengthError(this.state.password));
            return;
        }

        if(this.isEmpty(this.state.rePassword)){
            this.notifyMessage('re-password is required');
            return;
        }
        
        if(this.state.password != this.state.rePassword){
            this.notifyMessage('password and re-password not equal');
            return;
        }

        if(!this.state.checked){
            this.notifyMessage('you must agree with terms and conditions');
            return;
        }

        this.setState({ errorText:'' });

        fetch(
            'http://44.240.53.177/api/pub/account/register', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: "" + this.state.password.trim() + "",
                passwordConfirm: "" + this.state.rePassword.trim() + "",
                clientType: "WEB",
                uniqueId: "admin",
                username: "" + this.state.username.trim() + "",
                user: {

                    email: "" + this.state.email.trim() + "",
                    legal: false,
                    firstName: "",
                    lastName: "",
                    nationalId: "9824299012"
                },
                profile: {
                    gender: "MALE",
                    birthDate: "1990-06-13T16:27:56.658",
                    education: "",
                    expertise: ""

                }
            })
        })
            .then((response) => response.json())
            .then((json) => {
                if(json[0] && json[0].error){
                    this.setState({ errorText:getServerErrorMessage(json[0]) });
                  }else if(json.error){
                    this.setState({ errorText:getHttpErrorMessage(json)  });
                  }else{
                    this.props.userLogined(json);
                    this.props.navigation.replace('ConfirmEmail');
                  }
                
            })
            .catch((error) => {
                this.setState({ errorText:'Connection Error' });
            });
            
    }



    render() {
        // const [text, setText] = useState('');
        return (
            <KeyboardAvoidingView
                behavior={Platform.OS == "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <Text style={styles.header}>SIGN UP</Text>

                        <View style={styles.inputContainer}>
                            <TextInput style={styles.inputs}
                            placeholder="Username (or email address)"
                            onChangeText={text => this.setUsername(text)}
                            underlineColorAndroid='transparent'/>
                            <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/nolan/40/000000/user.png'}}/>
                        </View>
                        

                        <View style={styles.inputContainer}>
                            <TextInput style={styles.inputs}
                            placeholder="Email"
                            keyboardType="email-address"
                            onChangeText={text => this.setEmail(text)}
                            underlineColorAndroid='transparent'/>
                            <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/nolan/40/000000/email.png'}}/>
                        </View>
                        
                        
                        
                        <View style={[styles.inputContainer,{marginBottom:5}]}>
                            <TextInput style={styles.inputs}
                            placeholder="Password"
                            underlineColorAndroid='transparent'
                            secureTextEntry={true}
                            onChangeText={text => this.setPassword(text)} />
                            <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/nolan/40/000000/key.png'}}/>
                        </View>
                        <View style={styles.progressContainer}>
                            <Text style={styles.progressText}>Password Strength</Text>
                            <ProgressBar progress={this.state.passStrength} color={this.state.strengthColor} />
                        </View>
                        
                                                
                        
                        <View style={styles.inputContainer}>
                            <TextInput style={styles.inputs}
                            placeholder="Re-Password"
                            underlineColorAndroid='transparent'
                            secureTextEntry={true}
                            onChangeText={text => this.setRepassword(text)} />
                            <Image style={styles.inputIcon} source={{uri: 'https://img.icons8.com/nolan/40/000000/key.png'}}/>
                        </View>                        
                        
                        
                        
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={{ marginTop: 20, color: 'blue', alignSelf: 'center' }}
                                onPress={() => Linking.openURL('http://44.240.53.177/?#/terms')}>
                                Terms and Conditions.
                            </Text>
                            <CheckBox
                                center
                                title='I agree to these'
                                iconLeft
                                containerStyle ={{backgroundColor: 'transparent',borderColor:'transparent'}}
                                iconType='material-community'
                                checkedIcon='checkbox-marked-outline'
                                uncheckedIcon='checkbox-blank-outline'
                                checkedColor={Color.primary}
                                checked={this.state.checked}
                                onPress={() => this.setState({ checked: !this.state.checked })}
                            />
                        </View>

                        {/* <View style={styles.errorTextContainer}> */}
                            <Text style={styles.errorText}>{this.state.errorText}</Text>
                        {/* </View> */}
                        <TouchableOpacity style={[styles.buttonContainer, styles.loginButton]}  onPress={() => this.signup()} >
                            <Text style={styles.loginText}>Sign Up</Text>
                        </TouchableOpacity>
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
        )
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({ userLogined: userLogined}, dispatch)
  }
  export default connect(null,matchDispatchToProps)(Register);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCDCDC',
    },
    inner: {
        padding: 24,
        flex: 1,

    },
    header: {
        fontSize: 36,
        marginBottom: 48,
        alignSelf: 'center',
        marginTop: 30
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
    inputContainer: {
        borderBottomColor: '#F5FCFF',
        backgroundColor: '#FFFFFF',
        borderRadius:30,
        borderBottomWidth: 1,
        width:300,
        height:45,
        marginBottom:20,
        flexDirection: 'row',
        alignItems:'center',
    
        shadowColor: "#808080",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    
        elevation: 5,
      },
      inputs:{
        height:45,
        marginLeft:16,
        borderBottomColor: '#FFFFFF',
        flex:1,
      },
      inputIcon:{
        width:30,
        height:30,
        marginRight:15,
        justifyContent: 'center'
      },
      buttonContainer: {
        height:45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom:20,
        width:300,
        borderRadius:30,
        backgroundColor:'transparent'
      },
      loginButton: {
        backgroundColor: Color.primaryBackground,
    
        shadowColor: "#808080",
        shadowOffset: {
          width: 0,
          height: 9,
        },
        shadowOpacity: 0.50,
        shadowRadius: 12.35,
    
        elevation: 19,
      },
      loginText: {
        color: 'white',
      },
      progressContainer:{
          marginLeft:20,
          marginRight:20,
          marginBottom:20
      },
      progressText:{
          fontSize:8,
          marginBottom:5
      },
      errorText: {
        color: Color.error,
        fontSize:14,
        marginRight:10,
        marginLeft:10,
        textAlign:'center',
        marginBottom:20,
      },
      errorTextContainer:{
        flex:1,
        height:40,
        alignItems:'center',
        justifyContent:'flex-end',
        marginBottom:10,    
      }
});