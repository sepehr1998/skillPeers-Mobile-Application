import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import Color from "../constants/color.js";
import { Modal, Portal, Button, Provider } from "react-native-paper";
import MultiSelect from "react-native-multiple-select";
import { connect } from "react-redux";
import { getUsers } from "../redux/actions/index";
import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import NumericInput from "react-native-numeric-input";

class SendMessageModal extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      errorText: "",
      message: "",
    };
  }

  setSalary(salary) {
    this.setState({ salary: salary });
  }

  sendMessage() {
    if (this.isEmpty(this.state.message)) {
      this.setState({ errorText: "message is empty" });
      return;
    }
    let params = {};
    params.receiverId = this.props.receiverId;
    params.senderId = this.props.senderId;
    params.message = this.state.message;
    this.props.sendMessage(params);
  }

  isEmpty(str) {
    return !str || 0 === str.length || !str.trim();
  }

  render() {
    return (
      <Provider>
        <Portal>
          <Modal
            visible={this.props.visible}
            onDismiss={() => this.props.hideModal()}
            contentContainerStyle={{
              backgroundColor: "white",
              padding: 10,
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                underlineColorAndroid="transparent"
                placeholder="message..."
                placeholderTextColor="grey"
                numberOfLines={4}
                multiline={true}
                value={this.state.message}
                onChangeText={(value) => {
                  this.setState({
                    message: value,
                  });
                }}
              />
            </View>
            {!this.isEmpty(this.state.errorText) && (
              <View style={styles.errorTextContainer}>
                <Text style={styles.errorText}>{this.state.errorText}</Text>
              </View>
            )}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                style={[styles.buttonContainer, styles.sendMessageBtn]}
                onPress={() => {
                  this.sendMessage();
                }}
                disabled={this.state.loading}
              >
                <Text style={styles.btnText}>Send</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.buttonContainer, styles.cancelBtn]}
                onPress={() => {
                  this.props.hideModal();
                }}
                disabled={this.state.loading}
              >
                <Text style={styles.btnText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </Portal>
        {this.state.loading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={Color.primary} />
          </View>
        )}
      </Provider>
    );
  }
}

export default SendMessageModal;

const styles = StyleSheet.create({
  buttonContainer: {
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 120,
    borderRadius: 10,
    marginRight: 10,
    marginLeft: 10,
    backgroundColor: "transparent",
  },
  sendMessageBtn: {
    backgroundColor: "#409eff",
    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,
    elevation: 19,
  },
  cancelBtn: {
    backgroundColor: Color.error,
    shadowColor: "#808080",
    shadowOffset: {
      width: 0,
      height: 9,
    },
    shadowOpacity: 0.5,
    shadowRadius: 12.35,
    elevation: 19,
  },
  btnText: {
    color: "white",
  },
  errorText: {
    color: Color.error,
    fontSize: 16,
    textAlign: "center",
  },
  errorTextContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom:10,
  },
  textAreaContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom:10,
    padding: 5,
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start",
  },
});
