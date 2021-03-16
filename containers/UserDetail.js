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
        console.log("varse1 added");
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
            console.log("varse2 added");
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
                console.log("varse3 added");
                this.setState({ loading: false });
                this.getUserRate();
              })
              .catch((error) => {
                console.log("varse10", error);
                this.setState({ loading: false });
              });
          })
          .catch((error) => {
            console.log("varse20", error);
            this.setState({ loading: false });
          });
      })
      .catch((error) => {
        console.log("varse30", error);
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
        </View>
      );
    } else
      return (
        <View>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
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
                            "https://bootdey.com/img/Content/avatar/avatar6.png",
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
                      <Text>Hourly Rate</Text>
                      <View style={{ flexGrow: 1 }} />
                      <Icon
                        name="add"
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
                      <Text style={{ fontWeight: "bold",flex:2,textAlign:'center' }}>
                        Total Review{" "}
                      </Text>
                      <Text style={{ fontWeight: "bold",flex:2,textAlign:'center' }}>
                        ({this.state.userProfile.totalReview})
                      </Text>
                    </View>

                    <View
                      style={{
                        flex: 4,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems:'center',
                        marginTop:5
                      }}
                    >
                      <Text style={{flex:2,textAlign:'center'}}>Technical Skill</Text>
                      <Rating 
                       fractions="{1}"
                       startingValue={this.state.userProfile.technicalRateAvg}
                        imageSize={22}
                        style={{textAlign:'center',flex:2}}
                        />
                    </View>

                    <View
                      style={{
                        flex: 4,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems:'center',
                        marginTop:5
                      }}
                    >
                      <Text style={{flex:2,textAlign:'center'}}>On Time</Text>
                      <Rating 
                       fractions="{1}"
                       startingValue={this.state.userProfile.timeRateAvg}
                        imageSize={22}
                        style={{textAlign:'center',flex:2}}
                        />
                    </View>

                    <View
                      style={{
                        flex: 4,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems:'center',
                        marginTop:5
                      }}
                    >
                      <Text style={{flex:2,textAlign:'center'}}>Communication Skill</Text>
                      <Rating 
                       fractions="{1}"
                       startingValue={this.state.userProfile.communicationRateAvg}
                        imageSize={22}
                        style={{textAlign:'center',flex:2}}
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
                        <View style={{ flex: 2, flexDirection: 'row',flexWrap:'wrap',justifyContent:'center'}} >
                        <ListItem
                          key={index}
                          containerStyle={{ margin: 0, padding: 3 }}
                        >
                          <Button
                            style={{ padding: 0, height: 35 }}
                            title={skill.name + "(" + skill.percent + " years)"}
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
                      <Icon
                        name="shopping-cart"
                        type="font-awesome"
                        color={Color.primaryBackground}
                        onPress={() => this.notifyMessage("Under Construction")}
                        style={{ flex: 2, textAlign: "right" }}
                      />
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
            </View>
          </ScrollView>
          <AddStarModal
            visible={this.state.starModalVisible}
            userId={this.props.route.params.userId}
            hideModal={this.hideStarModal}
            addStar={this.addStar}
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
    backgroundColor: Color.primaryBackground,
  },
  headerContent: {
    paddingTop: 40,
    paddingBottom: 15,
    alignItems: "center",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    color: "#FFF",
    fontWeight: "600",
  },
  userInfo: {
    fontSize: 16,
    color: "#FFF",
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
