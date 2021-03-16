import Color from "../constants/color.js";
import React, { Component } from "react";
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Text,
  Platform,
  TouchableWithoutFeedback,
  Button,
  Image,
  Keyboard,
  Linking,
  TouchableOpacity,
} from "react-native";
import { CheckBox, Icon } from "react-native-elements";
import { userLogined } from "../redux/actions/index";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Toast, { DURATION } from "react-native-easy-toast";
import color from "../constants/color.js";
import { getServerErrorMessage, getHttpErrorMessage } from "../util/Util.js";

class Login extends Component {
  constructor(props) {
    super();
    this.state = {
      checked: false,
      username: "",
      password: "",
      errorText: "",
    };
  }

  UNSAFE_componentWillMount() {
    this.getRememberedUser();
  }

  setUsername = (username) => {
    this.setState({ username: username });
  };
  setPassword = (password) => {
    this.setState({ password: password });
  };

  rememberUser = async () => {
    try {
      await AsyncStorage.setItem("USER-NAME", this.state.username);
    } catch (error) {
      // Error saving data
    }
  };
  getRememberedUser = async () => {
    try {
      const username = await AsyncStorage.getItem("USER-NAME");
      if (username !== null) {
        this.setState({ username: username });
        this.setState({ checked: true });
        return username;
      }
    } catch (error) {
      // Error retrieving data
    }
  };
  forgetUser = async () => {
    try {
      await AsyncStorage.removeItem("USER-NAME");
    } catch (error) {
      // Error removing
    }
  };

  notifyMessage(msg) {
    //this.toast.show(msg);
    this.setState({ errorText: msg });
  }
  isEmpty(str) {
    return !str || 0 === str.length || !str.trim();
  }

  signin() {
    this.notifyMessage("");
    if (this.isEmpty(this.state.username)) {
      this.notifyMessage("username is required");
      return;
    }

    if (this.isEmpty(this.state.password)) {
      this.notifyMessage("password is required");
      return;
    }

    fetch("http://44.240.53.177/api/pub/account/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "" + this.state.username + "",
        password: "" + this.state.password + "",
        uniqueId: "admin",
        clientType: "WEB",
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        //alert(json[0]?.error?json[0].error:'success');
        //alert(json.accessToken?json.accessToken:'no user');
        if (json[0] && json[0].error) {
          //alert(json[0].error);
          //console.log(json[0]);
          this.setState({ errorText: getServerErrorMessage(json[0]) });
        } else if (json.error) {
          this.setState({ errorText: getHttpErrorMessage(json) });
        } else {
          this.props.userLogined(json);

          if (this.state.checked) {
            this.rememberUser();
          } else {
            this.forgetUser();
          }

          this.props.navigation.replace("Home", { initialState: "Home" });
        }
      })
      .catch((error) => {
        this.setState({ errorText: "Connection Error" });
      });
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
            <Text style={styles.header}>LOG IN</Text>

            <View style={styles.inputContainer}>
              <TextInput
                defaultValue={this.state.username}
                style={styles.inputs}
                placeholder="Email or Username"
                onChangeText={(text) => this.setUsername(text)}
                underlineColorAndroid="transparent"
              />
              <Image
                style={styles.inputIcon}
                source={{
                  uri: "https://img.icons8.com/nolan/40/000000/email.png",
                }}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                defaultValue={this.state.password}
                style={styles.inputs}
                placeholder="Password"
                underlineColorAndroid="transparent"
                secureTextEntry={true}
                onChangeText={(text) => this.setPassword(text)}
              />
              <Image
                style={styles.inputIcon}
                source={{
                  uri: "https://img.icons8.com/nolan/40/000000/key.png",
                }}
              />
            </View>

            <View style={{ flex: 1, flexDirection: "column" }}>
              <CheckBox
                defaultValue={this.state.checked}
                center
                style={styles.checkbox}
                title="Remember Me"
                iconLeft
                containerStyle={{
                  backgroundColor: "transparent",
                  borderColor: "transparent",
                }}
                iconType="material-community"
                checkedIcon="checkbox-marked-outline"
                uncheckedIcon="checkbox-blank-outline"
                checkedColor={Color.primary}
                checked={this.state.checked}
                onPress={() => this.setState({ checked: !this.state.checked })}
              />

              <Text
                style={{ marginTop: 20, color: "blue", alignSelf: "center" }}
                onPress={() =>
                  Linking.openURL(
                    "http://44.240.53.177/?#/registration/forgot-password"
                  )
                }
              >
                Forgot your password?
              </Text>
            </View>

            <View style={styles.errorTextContainer}>
              <Text style={styles.errorText}>{this.state.errorText}</Text>
            </View>
            <TouchableOpacity
              style={[styles.buttonContainer, styles.loginButton]}
              onPress={() => this.signin()}
            >
              <Text style={styles.loginText}>Login</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
        <Toast
          ref={(toast) => (this.toast = toast)}
          style={{ backgroundColor: Color.primaryBackground }}
          position="center"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1200}
          opacity={0.9}
        />
      </KeyboardAvoidingView>
    );
  }
}
function matchDispatchToProps(dispatch) {
  return bindActionCreators({ userLogined: userLogined }, dispatch);
}
export default connect(null, matchDispatchToProps)(Login);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#DCDCDC",
  },
  inner: {
    padding: 24,
    flex: 1,
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
    alignSelf: "center",
    marginTop: 20,
  },
  textInput: {
    height: 43,
    fontSize: 14,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    paddingLeft: 10,
    marginLeft: 15,
    marginRight: 15,
    marginTop: 5,
    marginBottom: 5,
    elevation: 5,
  },
  btnContainer: {
    backgroundColor: "white",
    margin: 22,
    elevation: 20,
  },
  inputContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#FFFFFF",
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 300,
    height: 45,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    flex: 1,
  },

  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 300,
    borderRadius: 30,
    backgroundColor: "transparent",
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
    justifyContent: "center",
  },
  loginButton: {
    backgroundColor: Color.primaryBackground,

    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,

    elevation: 19,
  },
  loginText: {
    color: "white",
  },
  errorText: {
    color: color.error,
    fontSize: 16,
    textAlign: "center",
  },
  errorTextContainer: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
});
