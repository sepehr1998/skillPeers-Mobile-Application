import React, { Component } from "react";
import {
  View,
  KeyboardAvoidingView,
  TextInput,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  Platform,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { userLogined } from "../redux/actions/index";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Color from "../constants/color.js";
import { getServerErrorMessage, getHttpErrorMessage } from "../util/Util.js";

class ContactUs extends Component {
  constructor(props) {
    super();
    this.state = {
      name: "",
      email: "",
      subject: "",
      message: "",
      loading: false,
    };
    //this.username = this.username.bind(this);
  }
  setName = (name) => {
    this.setState({ name: name });
    this.setState({ successText: undefined });
    this.setState({ errorText: undefined });
  };
  setSubject = (subject) => {
    this.setState({ subject: subject });
    this.setState({ successText: undefined });
    this.setState({ errorText: undefined });
  };
  setEmail = (email) => {
    this.setState({ email: email });
    this.setState({ successText: undefined });
    this.setState({ errorText: undefined });
  };
  setMessage = (message) => {
    this.setState({ message: message });
    this.setState({ successText: undefined });
    this.setState({ errorText: undefined });
  };

  notifyMessage(msg) {
    this.setState({ errorText: msg });
  }

  isEmpty(str) {
    return !str || 0 === str.length || !str.trim();
  }
  validateEmail(email) {
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
  }

  signup() {
    if (this.isEmpty(this.state.name)) {
      this.notifyMessage("name is required");
      return;
    }

    if (this.isEmpty(this.state.subject)) {
      this.notifyMessage("subject is required");
      return;
    }

    if (this.isEmpty(this.state.email)) {
      this.notifyMessage("email is required");
      return;
    }

    if (!this.validateEmail(this.state.email)) {
      this.notifyMessage("email is not valid");
      return;
    }

    if (this.isEmpty(this.state.message)) {
      this.notifyMessage("subject is required");
      return;
    }

    this.setState({ errorText: undefined });
    this.setState({ loading: true });

    fetch("http://44.240.53.177/api/pub/contact", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        senderEmail: "" + this.state.email.trim() + "",
        subject: "" + this.state.subject.trim() + "",
        clientType: "WEB",
        message: "" + this.state.message.trim() + "",
      }),
    })
      .then((json) => {
        this.setState({ loading: false });
        if (json[0] && json[0].error) {
          this.setState({ errorText: getServerErrorMessage(json[0]) });
        } else if (json.error) {
          this.setState({ errorText: getHttpErrorMessage(json) });
        } else {
          this.setState({ successText: "your message sent successfully" });
          this.setState({ name: "" });
          this.setState({ subject: "" });
          this.setState({ email: "" });
          this.setState({ message: "" });
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        this.setState({ errorText: "Connection Error" });
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
            <Text style={styles.header}>Get In Touch</Text>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                defaultValue={this.state.name}
                placeholder="Name"
                onChangeText={(text) => this.setName(text)}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                defaultValue={this.state.subject}
                placeholder="Subject"
                onChangeText={(text) => this.setSubject(text)}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.inputs}
                defaultValue={this.state.email}
                placeholder="Email"
                onChangeText={(text) => this.setEmail(text)}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                underlineColorAndroid="transparent"
                placeholder="Message"
                placeholderTextColor="grey"
                numberOfLines={3}
                multiline={true}
                defaultValue={this.state.message}
                onChangeText={(value) => {
                  this.setMessage(value);
                }}
              />
            </View>

            {this.state.errorText && (
              <View>
                <Text style={styles.errorText}>{this.state.errorText}</Text>
              </View>
            )}

            {this.state.successText && (
              <View>
                <Text style={styles.successText}>{this.state.successText}</Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.buttonContainer, styles.loginButton]}
              onPress={() => this.signup()}
              disabled={this.state.loading}
            >
              <Text style={styles.loginText}>Send</Text>
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>

        {this.state.loading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={Color.primary} />
          </View>
        )}
      </KeyboardAvoidingView>
    );
  }
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({ userLogined: userLogined }, dispatch);
}
export default connect(null, matchDispatchToProps)(ContactUs);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    padding: 24,
    flex: 1,
  },
  header: {
    fontSize: 36,
    marginBottom: 48,
    alignSelf: "center",
    marginTop: 30,
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
  inputIcon: {
    width: 30,
    height: 30,
    marginRight: 15,
    justifyContent: "center",
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
  loginButton: {
    backgroundColor: Color.primaryBackground,
    marginTop: 12,
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
  progressContainer: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
  },
  progressText: {
    fontSize: 8,
    marginBottom: 5,
  },
  errorText: {
    color: Color.error,
    fontSize: 14,
    marginRight: 10,
    marginLeft: 10,
    textAlign: "center",
    marginTop: 10,
  },
  successText: {
    color: Color.success,
    fontSize: 14,
    marginRight: 10,
    marginLeft: 10,
    textAlign: "center",
    marginTop: 10,
  },
  errorTextContainer: {
    flex: 1,
    height: 40,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  textAreaContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#fafafa",
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  textArea: {
    height: 150,
    borderColor: "#eaeaea",
    backgroundColor: "#fafafa",
    borderBottomColor: "#FFFFFF",
    justifyContent: "flex-start",
  },
  loading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
  },
});
