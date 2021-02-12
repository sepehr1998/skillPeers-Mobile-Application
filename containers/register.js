
import React, { Component } from 'react';
import { View, KeyboardAvoidingView, TextInput, StyleSheet, Text, Platform, TouchableWithoutFeedback, Button, Keyboard, Linking } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements'
import {repoSelected} from '../redux/actions/index';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class Register extends Component {

    constructor(props) {
        super()
        this.state =
        {
            checked: false,
            username: '',
            email: '',
            password: '',
            rePassword: ''
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
    };
    setRepassword = (rePassword) => {
        this.setState({ rePassword: rePassword });
    };

     signup() {

        fetch(
            'http://44.240.53.177/api/pub/account/register', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password: "" + this.state.password + "",
                passwordConfirm: "" + this.state.rePassword + "",
                clientType: "WEB",
                uniqueId: "admin",
                username: "" + this.state.username + "",
                user: {

                    email: "" + this.state.email + "",
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
                alert(json[0].error)
                console.log(json)
                this.props.repoSelected(json)
            })
            .catch((error) => {
                alert(error)
            });
            this.props.navigation.navigate('ConfirmEmail');
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
                        <Text style={styles.header}>Sign Up</Text>
                        <TextInput placeholder="Username (It can be your email address)" style={styles.textInput} onChangeText={text => this.setUsername(text)} />
                        <TextInput placeholder="Email" style={styles.textInput} onChangeText={text => this.setEmail(text)} />
                        <TextInput placeholder="Password" style={styles.textInput} secureTextEntry={true} onChangeText={text => this.setPassword(text)} />
                        <TextInput placeholder="Re-Password" style={styles.textInput} secureTextEntry={true} onChangeText={text => this.setRepassword(text)} />
                        <View style={{ flex: 1, flexDirection: 'column' }}>
                            <Text style={{ marginTop: 20, color: 'blue', alignSelf: 'center' }}
                                onPress={() => Linking.openURL('http://44.240.53.177/?#/terms')}>
                                Terms and Conditions.
                            </Text>
                            <CheckBox
                                center
                                title='I agree to these'
                                iconLeft
                                iconType='material-community'
                                checkedIcon='checkbox-marked-outline'
                                uncheckedIcon='checkbox-blank-outline'
                                checkedColor='green'
                                checked={this.state.checked}

                                onPress={() => this.setState({ checked: !this.state.checked })}
                            />

                        </View>
                        <View style={styles.btnContainer}>
                            <Button title="Sign Up" onPress={() => this.signup()} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        )
    }
}

function matchDispatchToProps(dispatch){
    return bindActionCreators({ repoSelected: repoSelected}, dispatch)
  }
  export default connect(null,matchDispatchToProps)(Register);

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
    }
});