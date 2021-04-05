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
  FlatList
} from "react-native";
import { CheckBox, Icon } from "react-native-elements";
import { userLogined } from "../redux/actions/index";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Toast, { DURATION } from "react-native-easy-toast";
import color from "../constants/color.js";
import { getServerErrorMessage, getHttpErrorMessage } from "../util/Util.js";
import ShowMessageModal from "../components/ShowMessageModal2";


class Outbox extends Component {
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
      "http://44.240.53.177/api/idn/messages?page=1&size=300&senderId=" +
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

  render() {
    const renderItem = ({ item }) => {
      return (
        <TouchableOpacity style={[{ marginTop: 10 }]} onPress={() => {
          this.setState({ selectedMessage: item });
    this.setState({ showMessageModalVisible: true });
        }}>
          <View style={[styles.eachMsg]}>
            <View style={[styles.rightBlock]}>
              <View>
                <Text
                  style={{
                    flex: 4,
                    textAlign: "left",
                    color: "#0645AD",
                  }}
                  onPress={() =>
                    this.props.navigation.navigate("UserDetail", {
                      userId: item.receiver.id,
                    })
                  }
                >
                  {item.receiver.firstName}{" "}
                  {item.receiver.lastName}
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
              <View style={styles.footer}>
                <Text>{this.getDate(item.created)}</Text>
                <View style={{flexDirection:'row'}}>
                  <Icon
                    name="check"
                    type="font-awesome"
                    color={'#53afff'}
                    size={14}
                    onPress={() => {}}
                    style={{ flex: 2, textAlign: "right" }}
                  />
                  {item.read&&
                  (<Icon
                    name="check"
                    type="font-awesome"
                    color={'#53afff'}
                    size={14}
                    onPress={() => {}}
                    style={{ flex: 2, textAlign: "right" }}
                  />)
                  }
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      );
    };

    return (
      <View style={{ flex: 1 }}>
        {!this.state.loading && this.state.messages && (
          <ScrollView contentContainerStyle={styles.container}>
            <View style={{ flex: 1, margin:10,padding:10}}>
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
export default connect(mapStateToProps, matchDispatchToProps)(Outbox);

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
  rightMsg: {
    flexDirection: "row",
    alignItems: "flex-end",
    margin: 5,
    alignSelf: "flex-end",
  },
  rightBlock: {
    width: "100%",
    borderRadius: 5,
    backgroundColor: "#bbdfc8",
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
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    paddingTop: 10,
  },
  rightTxt: {
    fontSize: 15,
    color: "#202020",
    fontWeight: "600",
  },
});

