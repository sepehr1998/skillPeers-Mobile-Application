import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import Color from "../constants/color.js";
import { Modal, Portal, Button, Provider } from "react-native-paper";
import MultiSelect from "react-native-multiple-select";
import { connect } from "react-redux";
import { getUsers } from "../redux/actions/index";
import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import NumericInput from "react-native-numeric-input";

class ShowMessageModal extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      errorText: "",
      message: "",
    };
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

  getDate = (inputDate) => {
    var date = new Date(inputDate);
    var dateString =
      date.getDate() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getFullYear() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds();
  
    return dateString;
  };

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
            <View>
              <Text
                style={{
                  textAlign: "left",
                  color: "#0645AD",
                }}
              >
                {this.props.message.sender.firstName}{" "}
                {this.props.message.sender.lastName}
              </Text>
              <View
                style={{
                  borderBottomColor: "#bbbbbb",
                  borderBottomWidth: 1,
                  marginTop: 5,
                  marginBottom: 5,
                }}
              />
            </View>
            <View style={{ minHeight: 100 }}>
              <Text
                style={[
                  styles.fonts_12_light_slate,
                  {
                    flexWrap: "wrap",
                    lineHeight: 18,
                    textAlign: "left",
                  },
                ]}
              >
                {this.props.message.message}
              </Text>
            </View>
            <Text style={styles.timeText}>{this.getDate(this.props.message.created)}</Text>
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
                  this.props.replyMessage();
                }}
                disabled={this.state.loading}
              >
                <Text style={styles.btnText}>Reply</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.buttonContainer, styles.cancelBtn]}
                onPress={() => {
                  this.props.hideModal();
                }}
                disabled={this.state.loading}
              >
                <Text style={styles.btnText}>Close</Text>
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

export default ShowMessageModal;

const styles = StyleSheet.create({
  buttonContainer: {
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
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
    marginBottom: 10,
  },
  textAreaContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    padding: 5,
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start",
  },
  timeText: {
    textAlign:"right",
    paddingTop: 10,
    marginBottom:10
  },
});
