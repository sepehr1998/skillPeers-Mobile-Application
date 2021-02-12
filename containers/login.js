

import React, { Component } from 'react';
import { View, KeyboardAvoidingView, TextInput, StyleSheet, Text, Platform, TouchableWithoutFeedback, Button, Keyboard, Linking } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements'
import { Actions } from 'react-native-router-flux';
import {repoSelected} from '../redux/actions/index';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

 class Login extends Component {


  constructor(props) {
    super()
    this.state =
    {
      checked: false,
      username: '',
      password: '',
    }
  }

  setUsername = (username) => {
    this.setState({ username:username });
  };
  setPassword = (password) => {
    this.setState({ password: password });
};



 signin() {

  fetch(
      'http://44.240.53.177/api/pub/account/login', {
      method: 'POST',
      headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: ""+this.state.username+"",
        password: ""+this.state.password+"",
        uniqueId: "admin",
        clientType: "WEB"
      })
  })
      .then((response) => response.json())
      .then((json) => {
          //alert(json[0]?.error?json[0].error:'success');
          //alert(json.accessToken?json.accessToken:'no user');
          console.log(json);
         this.props.repoSelected(json);
      })
      .catch((error) => {
          alert(error);
      }); 
      this.props.navigation.navigate('CardList');
}

  render() {
    // const { username } = this.state;
    // const { password } = this.state;
   
    



    return (
      <KeyboardAvoidingView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
            <Text style={styles.header}>Login</Text>
            <TextInput placeholder="Email or Username" style={styles.textInput}  onChangeText={text => this.setUsername(text)} />
            <TextInput placeholder="Password" style={styles.textInput} secureTextEntry={true} onChangeText={text => this.setPassword(text)} />
            <View style={{ flex: 1, flexDirection: 'column' }}>


              <CheckBox
                center
                title='Remember Me'
                iconLeft
                iconType='material-community'
                checkedIcon='checkbox-marked-outline'
                uncheckedIcon='checkbox-blank-outline'
                checkedColor='green'
                checked={this.state.checked}

                onPress={() => this.setState({ checked: !this.state.checked })}
              />



              <Text style={{ marginTop: 20, color: 'blue', alignSelf: 'center' }}
                onPress={() => Linking.openURL('http://44.240.53.177/?#/registration/forgot-password')}>
                Forgot your password?
            </Text>


            </View>
            <View style={styles.btnContainer}>




              <Button title="Login" onPress={() => this.signin()} />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    );
  }
};
function matchDispatchToProps(dispatch){
  return bindActionCreators({ repoSelected: repoSelected}, dispatch)
}
export default connect(null,matchDispatchToProps)(Login);

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

