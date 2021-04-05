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
  ScrollView,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { CheckBox, Icon } from "react-native-elements";
import { userLogined } from "../redux/actions/index";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Toast, { DURATION } from "react-native-easy-toast";
import color from "../constants/color.js";
import { getServerErrorMessage, getHttpErrorMessage } from "../util/Util.js";
import SendMessageModal from "../components/SendMessageModal";
import ShowMessageModal from "../components/ShowMessageModal";

class Inbox extends Component {
  constructor(props) {
    super();
    this.state = {
      errorText: "",
      loading: true,
      messages: null,
      selectedMessage: {
        receiver: {},
        sender: {},
      },
    };
  }

  UNSAFE_componentWillMount() {
    this.getMessages();
  }

  getMessages() {
    this.setState({ loading: true });
    fetch(
      "http://44.240.53.177/api/idn/messages?page=1&size=300&receiverId=" +
        this.props.profile.user.id,
      {
        method: "GET",
        headers: {
          Authorization: "" + this.props.currentUser.accessToken + "",
        },
      }
    )
      .then((e) => e.json())
      .then((response) => {
        console.log(response);
        this.setState({ loading: false });
        this.setState({ messages: response });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log("inbox error", error);
      });
  }

  notifyMessage(msg) {
    this.toast.show(msg);
    //this.setState({ errorText: msg });
  }
  isEmpty(str) {
    return !str || 0 === str.length || !str.trim();
  }

  hideMessageDetailModal = () => {
    this.setState({ showMessageModalVisible: false });
  };

  replyMessage = () => {
    this.setState({ showMessageModalVisible: false });
    this.setState({ messageModalVisible: true });
  };

  hideMessageModal = () => {
    this.setState({ messageModalVisible: false });
  };

  sendMessage = (message) => {
    this.setState({ messageModalVisible: false });
    this.setState({ loading: true });
    fetch("http://44.240.53.177/api/idn/messages", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "" + this.props.currentUser.accessToken + "",
      },
      body: JSON.stringify(message),
    })
      .then((response) => {
        this.setState({ loading: false });
        this.notifyMessage("message sent successfully");
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

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

  getMessage = (message) => {
    if (message && message.length < 50) {
      return message;
    }
    return message.substring(1, 50) + "...";
  };

  showMessageDetail(message) {
    console.log("get message for",message.id);
    this.setState({ selectedMessage: message });
    this.setState({ showMessageModalVisible: true });
    fetch("http://44.240.53.177/api/idn/messages/" + message.id, {
      method: "GET",
      headers: {
        Authorization: "" + this.props.currentUser.accessToken + "",
      },
    })
    .then((e) => e.json())
      .then((response) => {
        console.log(response);
        message.read = true;
      })
      .catch((error) => {
        console.log("get message error", error);
      });
  }

  render() {
    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity
          style={[{ marginTop: 10 }]}
          onPress={() => {
            this.showMessageDetail(item);
          }}
        >
          <View style={[styles.eachMsg, item.read ? {} : styles.unread]}>
            <View style={[styles.msgBlock, item.read ? {} : styles.unread]}>
              <View>
                <Text
                  style={{
                    flex: 4,
                    textAlign: "left",
                    color: "#0645AD",
                  }}
                  onPress={() =>
                    this.props.navigation.navigate("UserDetail", {
                      userId: item.sender.id,
                    })
                  }
                >
                  {item.sender.firstName} {item.sender.lastName}
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
              <Text style={styles.msgTxt}>{this.getMessage(item.message)}</Text>
              <Text style={styles.timeText}>{this.getDate(item.created)}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <View style={{ flex: 1 }}>
        {!this.state.loading && this.state.messages && (
          <ScrollView contentContainerStyle={styles.container}>
            <View style={{ flex: 1, margin: 10, padding: 10 }}>
              <FlatList
                data={this.state.messages}
                renderItem={renderItem}
                onEndThreshold={0}
                onEndReached={() => (this.callOnScrollEnd = true)}
                onMomentumScrollEnd={() => {
                  this.callOnScrollEnd && this.getMessages();
                  this.callOnScrollEnd = false;
                }}
                keyExtractor={(item, index) => index}
              />
            </View>
          </ScrollView>
        )}
        <ShowMessageModal
          visible={this.state.showMessageModalVisible}
          message={this.state.selectedMessage}
          hideModal={this.hideMessageDetailModal}
          replyMessage={this.replyMessage}
        />
        <SendMessageModal
          visible={this.state.messageModalVisible}
          senderId={this.state.selectedMessage.receiver.id}
          receiverId={this.state.selectedMessage.sender.id}
          hideModal={this.hideMessageModal}
          sendMessage={this.sendMessage}
        />
        <Toast
          ref={(toast) => (this.toast = toast)}
          style={{ backgroundColor: Color.primaryBackground }}
          position="center"
          positionValue={200}
          fadeInDuration={750}
          fadeOutDuration={1200}
          opacity={0.9}
        />
        {this.state.loading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={Color.primary} />
          </View>
        )}
        {!this.state.loading && !this.state.messages && (
          <View style={styles.loading}>
            <Text style={{ textAlign: "center" }}>No Message Found</Text>
          </View>
        )}
      </View>
    );
  }
}

//bind state variables to variables
function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    profile: state.profile,
  };
}

function matchDispatchToProps(dispatch) {
  return bindActionCreators({ userLogined: userLogined }, dispatch);
}
export default connect(mapStateToProps, matchDispatchToProps)(Inbox);

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  eachMsg: {
    flexDirection: "row",
    margin: 5,
  },
  unread: {
    backgroundColor: "#dddddd",
  },
  msgBlock: {
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#ffffff",
    padding: 10,
    shadowColor: "#3d3d3d",
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
  },
  msgTxt: {
    fontSize: 15,
    marginBottom: 20,
    paddingBottom: 20,
    color: "#555",
    fontWeight: "600",
  },
  timeText: {
    position: "absolute",
    bottom: 10,
    left: 10,
    paddingTop: 10,
  },
});
