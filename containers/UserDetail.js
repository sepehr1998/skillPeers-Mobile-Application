import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
  ImageBackground,
} from "react-native";
import { Picker } from "@react-native-community/picker";
import { Card, ListItem, Button, Icon, Input } from "react-native-elements";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { userLogined, userProfile } from "../redux/actions/index";
import Color from "../constants/color.js";
import Toast, { DURATION } from "react-native-easy-toast";
import DropDownPicker from "react-native-dropdown-picker";
import { Right, Row } from "native-base";
import Timeline from "react-native-timeline-flatlist";
import { Rating, AirbnbRating } from "react-native-elements";
import AddStarModal from "../components/AddStarModal";
import SendMessageModal from "../components/SendMessageModal";

class UserDetail extends Component {
  constructor(props) {
    super();
    this.state = {
      userProfile: undefined,
      loading: true,
    };
  }

  UNSAFE_componentWillMount() {
    this.getUserProfile();
    //console.log("userid",this.props.route.params.userId);
  }

  notifyMessage(msg) {
    this.toast.show(msg);
  }

  getUserProfile() {
    console.log("get profile for:", this.props.route.params.userId);
    fetch(
      "http://44.240.53.177/api/pub/users/" + this.props.route.params.userId,
      {
        method: "GET",
        headers: {
          Authorization: "" + this.props.currentUser.accessToken + "",
        },
      }
    )
      .then((e) => e.json())
      .then((response) => {
        response.experiments.sort(function (a, b) {
          var aEndDate = new Date(a.end);
          var bEndDate = new Date(b.end);
          return aEndDate.getTime() - bEndDate.getTime();
        });
        var experiments = [];
        response.experiments.forEach((element) => {
          //console.log("element",element);
          var experiment = {};
          experiment.time =
            element.start.split("T")[0] + " - " + element.end.split("T")[0];
          experiment.title = element.workplace;
          experiment.id = element.id;
          experiment.description = experiment.time;
          experiments.push(experiment);
        });
        response.experiments = experiments;

        response.educations.sort(function (a, b) {
          var aEndDate = new Date(a.departure);
          var bEndDate = new Date(b.departure);
          return aEndDate.getTime() - bEndDate.getTime();
        });
        var educations = [];
        response.educations.forEach((element) => {
          //console.log(element);
          var education = {};
          education.time =
            element.entering.split("T")[0] +
            " - " +
            element.departure.split("T")[0];
          education.title = element.university;
          education.id = element.id;
          education.description = education.time;
          educations.push(education);
        });
        response.educations = educations;

        this.setState({ userProfile: response });
        this.setState({ loading: false });

        this.getUserRate();
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
      });
  }

  roundNum(num) {
    return Math.round((num + Number.EPSILON) * 10) / 10;
  }

  getUserRate() {
    fetch(
      "http://44.240.53.177/api/idn/rates/" + this.props.route.params.userId,
      {
        method: "GET",
        headers: {
          Authorization: "" + this.props.currentUser.accessToken + "",
        },
      }
    )
      .then((e) => e.json())
      .then((response) => {
        //console.log("rate response", response);
        if (this.state.userProfile == undefined) {
          return;
        }

        var totalReview = 0;
        var timeRateAvg = 0;
        var technicalRateAvg = 0;
        var communicationRateAvg = 0;

        response.forEach((item) => {
          if (item) {
            totalReview = item.count;
            if (item.type === "TECHNICAL") {
              technicalRateAvg = this.roundNum(item.avg / 2);
            } else if (item.type === "TIME") {
              timeRateAvg = this.roundNum(item.avg / 2);
            } else if (item.type === "COMMUNICATION") {
              communicationRateAvg = this.roundNum(item.avg / 2);
            }
          }
        });
        console.log("time response", timeRateAvg);
        console.log("tech response", technicalRateAvg);
        console.log("commu response", communicationRateAvg);

        this.state.userProfile.totalReview = totalReview;
        this.state.userProfile.timeRateAvg = timeRateAvg;
        this.state.userProfile.technicalRateAvg = technicalRateAvg;
        this.state.userProfile.communicationRateAvg = communicationRateAvg;
        this.setState({ userProfile: this.state.userProfile });
      })
      .catch((error) => {
        this.setState({ loading: false });
        console.log(error);
      });
  }

  hideStarModal = () => {
    this.setState({ starModalVisible: false });
  };

  addStar = (newStar) => {
    this.setState({ starModalVisible: false });
    this.setState({ loading: true });
    fetch("http://44.240.53.177/api/idn/rates", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "" + this.props.currentUser.accessToken + "",
      },
      body: JSON.stringify(newStar.TIME),
    })
      .then((response) => {
        fetch("http://44.240.53.177/api/idn/rates", {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: "" + this.props.currentUser.accessToken + "",
          },
          body: JSON.stringify(newStar.COMMUNICATION),
        })
          .then((response) => {
            fetch("http://44.240.53.177/api/idn/rates", {
              method: "PUT",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "" + this.props.currentUser.accessToken + "",
              },
              body: JSON.stringify(newStar.TECHNICAL),
            })
              .then((response) => {
                this.setState({ loading: false });
                this.getUserRate();
              })
              .catch((error) => {
                this.setState({ loading: false });
              });
          })
          .catch((error) => {
            this.setState({ loading: false });
          });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
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
        console.log("error", error);
        this.setState({ loading: false });
      });
  };

  render() {
    if (this.state.userProfile == undefined && this.state.loading) {
      return (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={Color.primary} />
        </View>
      );
    } else if (this.state.userProfile == undefined) {
      return (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              marginLeft: 20,
              marginRight: 20,
              fontSize: 15,
              textAlign: "center",
            }}
          >
            Failed to get User Profile
          </Text>
          <TouchableOpacity
            style={styles.messagesButton}
            onPress={() => {
              this.props.navigation.pop();
            }}
          >
            <Text style={styles.messageText}>back</Text>
          </TouchableOpacity>
        </View>
      );
    } else
      return (
        <View style={{ marginBottom: 40 }}>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
              <ImageBackground
                source={
                  this.state.userProfile.profile.background != null
                    ? {
                        uri:
                          "http://44.240.53.177/files/" +
                          this.state.userProfile.profile.background,
                      }
                    : { uri: "http://44.240.53.177/gradiants/0.png" }
                }
                style={{ height: 150, width: null, flex: 2 }}
              ></ImageBackground>
              <View style={styles.headerContent}>
                <Image
                  style={styles.avatar}
                  source={
                    this.state.userProfile.profile &&
                    this.state.userProfile.profile.image !== null
                      ? {
                          uri:
                            "http://44.240.53.177/files/" +
                            this.state.userProfile.profile.image,
                        }
                      : {
                          uri:
                            "data:image/png;base64,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",
                        }
                  }
                  key={this.state.userProfile.user.id}
                />

                <Text style={styles.name}>
                  {this.state.userProfile.user.firstName}{" "}
                  {this.state.userProfile.user.lastName}
                </Text>
                <Text style={styles.userInfo}>
                  {this.state.userProfile.user.email}
                </Text>
                {this.state.userProfile.profile.city &&
                  this.state.userProfile.profile.country && (
                    <Text style={styles.userInfo}>
                      {this.state.userProfile.profile.city.name} ,{" "}
                      {this.state.userProfile.profile.country.name}
                    </Text>
                  )}

                <TouchableOpacity
                  style={styles.messagesButton}
                  disabled={
                    this.state.userProfile.user.id ==
                    this.props.currentUser.account.id
                  }
                  onPress={() => {
                    this.setState({ messageModalVisible: true });
                  }}
                >
                  <Text style={styles.messageText}>Text Me</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.body}>
              <View style={styles.cardContainer}>
                <Card>
                  <View>
                    <Text style={{ textAlign: "center", marginBottom: 10 }}>
                      About
                    </Text>
                  </View>
                  <Card.Divider />
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
                    {this.state.userProfile.profile &&
                    this.state.userProfile.profile.bio &&
                    this.state.userProfile.profile.bio.length > 0
                      ? this.state.userProfile.profile.bio
                      : " Sorry There is no info about me."}
                  </Text>
                </Card>
              </View>

              <View style={styles.cardContainer}>
                <Card
                  titleStyle={{ textAlign: "left" }}
                  title={
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <Text>Review</Text>
                      <View style={{ flexGrow: 1 }} />
                      <Icon
                        name="add"
                        disabled={
                          this.state.userProfile.user.id ==
                          this.props.currentUser.account.id
                        }
                        onPress={() =>
                          this.setState({ starModalVisible: true })
                        }
                        color="#67c23a"
                      />
                    </View>
                  }
                >
                  <Card.Divider />
                  <View style={{ flex: 1, flexDirection: "column" }}>
                    <View
                      style={{
                        flex: 4,
                        flexDirection: "row",
                        marginTop: 20,
                        justifyContent: "center",
                        marginBottom: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          flex: 2,
                          textAlign: "center",
                        }}
                      >
                        Total Review{" "}
                      </Text>
                      <Text
                        style={{
                          fontWeight: "bold",
                          flex: 2,
                          textAlign: "center",
                        }}
                      >
                        ({this.state.userProfile.totalReview})
                      </Text>
                    </View>

                    <View
                      style={{
                        flex: 4,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      <Text style={{ flex: 2, textAlign: "center" }}>
                        Technical Skill
                      </Text>
                      <Rating
                        fractions="{1}"
                        startingValue={this.state.userProfile.technicalRateAvg}
                        imageSize={22}
                        style={{ textAlign: "center", flex: 2 }}
                      />
                    </View>

                    <View
                      style={{
                        flex: 4,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      <Text style={{ flex: 2, textAlign: "center" }}>
                        On Time
                      </Text>
                      <Rating
                        fractions="{1}"
                        startingValue={this.state.userProfile.timeRateAvg}
                        imageSize={22}
                        style={{ textAlign: "center", flex: 2 }}
                      />
                    </View>

                    <View
                      style={{
                        flex: 4,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 5,
                      }}
                    >
                      <Text style={{ flex: 2, textAlign: "center" }}>
                        Communication Skill
                      </Text>
                      <Rating
                        fractions="{1}"
                        startingValue={
                          this.state.userProfile.communicationRateAvg
                        }
                        imageSize={22}
                        style={{ textAlign: "center", flex: 2 }}
                      />
                    </View>
                  </View>
                </Card>
              </View>

              <View style={styles.cardContainer}>
                <Card>
                  <View>
                    <Text style={{ textAlign: "center", marginBottom: 10 }}>
                      My Experiences
                    </Text>
                  </View>
                  <Card.Divider />

                  {this.state.userProfile.experiments.length == 0 && (
                    <Text
                      style={[
                        {
                          flexWrap: "wrap",
                          lineHeight: 18,
                          textAlign: "left",
                        },
                      ]}
                    >
                      Sorry There is no experiments available
                    </Text>
                  )}

                  {this.state.userProfile.experiments.length > 0 && (
                    <Timeline
                      data={this.state.userProfile.experiments}
                      circleSize={0}
                      circleColor="rgb(45,156,219)"
                      lineColor="rgb(45,156,219)"
                      timeContainerStyle={{ width: 0, marginTop: 0 }}
                      timeStyle={{
                        textAlign: "center",
                        backgroundColor: "#ff9797",
                        color: "white",
                        padding: 0,
                        borderRadius: 0,
                        width: 0,
                      }}
                      descriptionStyle={{ color: "gray" }}
                      options={{
                        style: { paddingTop: 5 },
                      }}
                    />
                  )}
                </Card>
              </View>

              <View style={styles.cardContainer}>
                <Card>
                  <View>
                    <Text style={{ textAlign: "center", marginBottom: 10 }}>
                      My Education
                    </Text>
                  </View>
                  <Card.Divider />

                  {this.state.userProfile.educations.length == 0 && (
                    <Text
                      style={[
                        {
                          flexWrap: "wrap",
                          lineHeight: 18,
                          textAlign: "left",
                        },
                      ]}
                    >
                      Sorry There is no educations available
                    </Text>
                  )}
                  {this.state.userProfile.educations.length > 0 && (
                    <Timeline
                      data={this.state.userProfile.educations}
                      circleSize={0}
                      circleColor="rgb(45,156,219)"
                      lineColor="rgb(45,156,219)"
                      timeContainerStyle={{ width: 0, marginTop: 0 }}
                      timeStyle={{
                        textAlign: "center",
                        backgroundColor: "#ff9797",
                        color: "white",
                        padding: 0,
                        borderRadius: 0,
                        width: 0,
                      }}
                      descriptionStyle={{ color: "gray" }}
                      options={{
                        style: { paddingTop: 5 },
                      }}
                    />
                  )}
                </Card>
              </View>

              <View style={styles.cardContainer}>
                <Card>
                  <View>
                    <Text style={{ textAlign: "center", marginBottom: 10 }}>
                      Skills
                    </Text>
                  </View>
                  <Card.Divider />

                  {this.state.userProfile.skills.length == 0 && (
                    <Text
                      style={[
                        {
                          flexWrap: "wrap",
                          lineHeight: 18,
                          textAlign: "left",
                        },
                      ]}
                    >
                      Sorry There is no skills available
                    </Text>
                  )}

                  <View style={{ flexDirection: "row" }}>
                    {this.state.userProfile.skills.length > 0 &&
                      this.state.userProfile.skills.map((skill, index) => (
                        <View
                          style={{
                            flex: 2,
                            flexDirection: "row",
                            flexWrap: "wrap",
                            justifyContent: "center",
                          }}
                        >
                          <ListItem
                            key={index}
                            containerStyle={{ margin: 0, padding: 3 }}
                          >
                            <Button
                              style={{ padding: 0, height: 35 }}
                              title={
                                skill.name + "(" + skill.percent + " years)"
                              }
                              type="solid"
                              titleStyle={{
                                fontSize: 12,
                              }}
                              disabled={true}
                            />
                          </ListItem>
                        </View>
                      ))}
                  </View>
                </Card>
              </View>

              <View style={styles.cardContainer}>
                <Card>
                  <View>
                    <Text style={{ textAlign: "center", marginBottom: 10 }}>
                      Hourly Rate
                    </Text>
                  </View>
                  <Card.Divider />

                  {this.state.userProfile.hourRates.length == 0 && (
                    <Text
                      style={[
                        {
                          flexWrap: "wrap",
                          lineHeight: 18,
                          textAlign: "left",
                        },
                      ]}
                    >
                      Sorry There is no Hourly Rate available
                    </Text>
                  )}

                  {this.state.userProfile.hourRates.length > 0 && (
                    <View style={{ flex: 5, flexDirection: "row" }}>
                      <Text style={{ flex: 3, textAlign: "left" }}>
                        {this.state.userProfile.hourRates[0].amount}{" "}
                        {this.state.userProfile.hourRates[0].currency}
                      </Text>
                      {/* <Icon
                        name="shopping-cart"
                        type="font-awesome"
                        color={Color.primaryBackground}
                        onPress={() => this.notifyMessage("Under Construction")}
                        style={{ flex: 2, textAlign: "right" }}
                      /> */}
                    </View>
                  )}
                </Card>
              </View>

              <View style={styles.cardContainer}>
                <Card>
                  <View>
                    <Text style={{ textAlign: "center", marginBottom: 10 }}>
                      Contact Info
                    </Text>
                  </View>
                  <Card.Divider />

                  {this.state.userProfile.user.mobile && (
                    <View
                      style={{
                        flex: 5,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 10,
                      }}
                    >
                      <Icon
                        name="phone"
                        type="font-awesome"
                        color={Color.primaryBackground}
                        style={{ flex: 1, textAlign: "center" }}
                      />
                      <Text
                        style={{ flex: 4, textAlign: "left", marginLeft: 10 }}
                      >
                        {this.state.userProfile.user.mobile}
                      </Text>
                    </View>
                  )}

                  {this.state.userProfile.user.email && (
                    <View
                      style={{
                        flex: 5,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 10,
                      }}
                    >
                      <Icon
                        name="envelope"
                        type="font-awesome"
                        color={Color.primaryBackground}
                        style={{ flex: 1, textAlign: "center" }}
                      />
                      <Text
                        style={{ flex: 4, textAlign: "left", marginLeft: 10 }}
                      >
                        {this.state.userProfile.user.email}
                      </Text>
                    </View>
                  )}

                  {this.state.userProfile.profile.linkedin && (
                    <View
                      style={{
                        flex: 5,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 10,
                      }}
                    >
                      <Icon
                        name="linkedin"
                        type="font-awesome"
                        color={Color.primaryBackground}
                        style={{ flex: 1, textAlign: "center" }}
                      />
                      <Text
                        style={{
                          flex: 4,
                          textAlign: "left",
                          marginLeft: 10,
                          color: "#0645AD",
                        }}
                        onPress={() =>
                          Linking.openURL(
                            this.state.userProfile.profile.linkedin
                          )
                        }
                      >
                        {this.state.userProfile.profile.linkedin}
                      </Text>
                    </View>
                  )}

                  {this.state.userProfile.profile.webSite && (
                    <View
                      style={{
                        flex: 5,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 10,
                      }}
                    >
                      <Icon
                        name="globe"
                        type="font-awesome"
                        color={Color.primaryBackground}
                        style={{ flex: 1, textAlign: "center" }}
                      />
                      <Text
                        style={{
                          flex: 4,
                          textAlign: "left",
                          marginLeft: 10,
                          color: "#0645AD",
                        }}
                        onPress={() =>
                          Linking.openURL(
                            this.state.userProfile.profile.webSite
                          )
                        }
                      >
                        {this.state.userProfile.profile.webSite}
                      </Text>
                    </View>
                  )}
                </Card>
              </View>
              <TouchableOpacity
                style={styles.messagesButton}
                onPress={() => {
                  this.props.navigation.pop();
                }}
              >
                <Text style={styles.messageText}>back</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          <AddStarModal
            visible={this.state.starModalVisible}
            userId={this.props.route.params.userId}
            hideModal={this.hideStarModal}
            addStar={this.addStar}
          />
          <SendMessageModal
            visible={this.state.messageModalVisible}
            senderId={this.props.currentUser.account.id}
            receiverId={this.props.route.params.userId}
            hideModal={this.hideMessageModal}
            sendMessage={this.sendMessage}
          />
          {this.state.loading && (
            <View style={styles.loading}>
              <ActivityIndicator size="large" color={Color.primary} />
            </View>
          )}
          <Toast
            ref={(toast) => (this.toast = toast)}
            style={{ backgroundColor: Color.primaryBackground }}
            position="center"
            positionValue={200}
            fadeInDuration={750}
            fadeOutDuration={1200}
            opacity={0.9}
          />
        </View>
      );
  }
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: Color.pageBackground,
  },
  headerContent: {
    paddingBottom: 15,
    alignItems: "center",
  },
  avatar: {
    width: 130,
    height: 130,
    marginTop: -65,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    // color: "#FFF",
    fontWeight: "600",
  },
  userInfo: {
    fontSize: 16,
    // color: "#FFF",
    fontWeight: "600",
  },
  body: {
    backgroundColor: Color.pageBackground,
    height: "100%",
    width: "100%",
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 40,
    alignItems: "center",
  },
  cardContainer: {
    width: "100%",
  },
  item: {
    flexDirection: "row",
  },
  infoContent: {
    flex: 1,
    alignItems: "flex-start",
    paddingLeft: 5,
  },
  iconContent: {
    flex: 1,
    alignItems: "flex-end",
    paddingRight: 5,
  },
  icon: {
    width: 30,
    height: 30,
    marginTop: 20,
  },
  info: {
    fontSize: 18,
    marginTop: 20,
    color: "#FFFFFF",
  },
  buttonContainer: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signinSignout: {
    marginTop: 30,
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 200,
    borderRadius: 30,
    backgroundColor: Color.primaryBackground,
  },
  saveButton: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    marginRight: 20,
    borderRadius: 30,
    backgroundColor: "#67c23a",
  },
  cancelButton: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 30,
    backgroundColor: "#f56c6c",
  },
  success: {
    color: "white",
  },
  danger: {
    color: "white",
  },
  lable: {
    fontSize: 15,
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
  messagesButton: {
    height: 35,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 30,
    backgroundColor: "#409eff",
  },
  messageText: {
    color: "#FFF",
  },
});

//bind state variables to variables
function mapStateToProps(state) {
  return {
    currentUser: state.currentUser,
    profile: state.profile,
  };
}

//bind actions to props actions
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      userLogined: userLogined,
      userProfile: userProfile,
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(UserDetail);
