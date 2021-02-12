

import React, { Component } from 'react';
import { View, KeyboardAvoidingView, TextInput, StyleSheet, Text, Platform, TouchableWithoutFeedback, Button, Keyboard, Linking } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';
import { repoSelected } from '../redux/actions/index';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class ConfirmEmail extends Component {

    constructor(props) {
        super()
        this.state =
        {
            code: '',
        }
    }
    setCode = (code) => {
        this.setState({ code: code });
    };

    confirmCode() {
        
        fetch(
            'http://44.240.53.177/api/idn/account/confirm-email?', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                'Authorization': "" + this.props.activeRepo?.accessToken ? this.props.activeRepo?.accessToken : '' + ""
            },
            body: JSON.stringify({
                input: "" + this.state.code + "",

            })
        })
            .then((response) => response.json())
            .then((json) => {
                //alert(json[0]?.error?json[0].error:'success');
                //alert(json.accessToken?json.accessToken:'no user');
                console.log(json)

            })
            .catch((error) => {
                alert(error)
            });
        this.props.navigation.navigate('Slider');
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
                        <TextInput placeholder="Confirm Code" style={styles.textInput} onChangeText={text => this.setCode(text)} />

                        <View style={styles.btnContainer}>
                            <Button title="CONFIRM" onPress={() => this.confirmCode()} />
                    
                        </View>
                        <View style={styles.btnContainer}>
                         
                            <Button title="RESEND" onPress={() => null} />
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        );
    }
};
export default ConfirmEmail;

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
        fontSize: 10,
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
    }
});

