import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  SafeAreaView,
} from "react-native";
import MultiSelect from "react-native-multiple-select";
import { Card, Icon } from "react-native-elements";
import { getServerErrorMessage, getHttpErrorMessage } from "../util/Util.js";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { userLogined, userProfile } from "../redux/actions/index";
import Color from "../constants/color.js";
import Toast from "react-native-easy-toast";
import DropDownPicker from "react-native-dropdown-picker";
import { ProgressBar } from "react-native-paper";
import { Modal, Portal, Button, Provider } from "react-native-paper";
import AddSkillModal from "../components/AddSkillModal";
import AddHourlyRateModal from "../components/AddHourlyRateModal";
import AddExperienceModal from "../components/AddExperienceModal";
import AddEducationModal from "../components/AddEducationModal";
import * as ImagePicker from "expo-image-picker";
//import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
//import ImagePicker from 'react-native-image-crop-picker';
import { Avatar, Badge, withBadge } from "react-native-elements";
import { decode as atob, encode as btoa } from "base-64";

class Profile extends Component {
  constructor(props) {
    super();
    this.state = {
      editedProfile: undefined,
      unreadMessageCount: -1,
      countries: [],
      cities: [],
      countryId: [],
      country: undefined,
      cityId: [],
      city: undefined,
      loading: true,
      image: null,
      images: null,
    };
  }

  UNSAFE_componentWillMount() {
    this.resetData();
    this.getCountries();
  }

  notifyMessage(msg) {
    this.toast.show(msg);
  }

  resetData() {
    if (this.props.profile != null && this.props.profile.user != null) {
      this.setState({ editedProfile: this.props.profile });
    }

    if (this.props.profile != null && this.props.profile.user != null) {
      this.getUnreadMessages();
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (
      prevProps.currentUser !== this.props.currentUser &&
      this.props.currentUser
    ) {
      this.getProfile();
    }
  }

  getProfile() {
    this.setState({ loading: true });
    fetch("http://44.240.53.177/api/idn/account/profile", {
      method: "GET",
      headers: {
        Authorization: "" + this.props.currentUser.accessToken + "",
      },
    })
      .then((e) => e.json())
      .then((response) => {
        response.experiments.sort(function (a, b) {
          var aEndDate = new Date(a.end);
          var bEndDate = new Date(b.end);
          return aEndDate.getTime() - bEndDate.getTime();
        });

        response.educations.sort(function (a, b) {
          var aEndDate = new Date(a.departure);
          var bEndDate = new Date(b.departure);
          return aEndDate.getTime() - bEndDate.getTime();
        });

        this.props.userProfile(response);
        this.setState({ loading: false });
        this.resetData();
      })
      .catch((error) => {
        this.setState({ loading: false });
        //console.log("profile error",error);
      });
  }

  getUnreadMessages() {
    fetch(
      "http://44.240.53.177/api/idn/messages/count?read=false&receiverId=" +
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
        console.log("unread count", response);
        this.setState({ unreadMessageCount: response });
      })
      .catch((error) => {
        console.warn("error get message count", error);
        this.setState({ loading: false });
      });
  }

  getCountries() {
    this.setState({ loading: true });
    fetch("http://44.240.53.177/api/pub/countries?page=1&size=300", {
      method: "GET",
    })
      .then((e) => e.json())
      .then((response) => {
        this.setState({ countries: response });
        this.setState({ loading: false });
        if (
          this.props.profile.profile != null &&
          this.props.profile.profile.countryId
        ) {
          console.log("get countries");
          let selectedCountry = [];
          selectedCountry.push(this.props.profile.profile.countryId);

          this.setState({
            countryId: selectedCountry,
          });
          this.setState({ country: this.props.profile.profile.country });
          this.getCities(
            this.props.profile.profile.countryId,
            this.props.profile.profile.cityId
          );
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  }

  getCities(countId, defaultValue = null) {
    console.log("get cities");
    this.setState({ loading: true });
    fetch(
      "http://44.240.53.177/api/pub/cities?page=1&size=300&countryId=" +
        countId,
      {
        method: "GET",
      }
    )
      .then((e) => e.json())
      .then((response) => {
        this.setState({ cities: response });

        console.log("default value", defaultValue);

        var city =
          defaultValue != null ? this.props.profile.profile.city : response[0];
        this.setState({ city: city });
        console.log("default value", defaultValue);
        var cityIdd =
          defaultValue != null ? Number(defaultValue) : response[0].id;

        let selectedCity = [];
        selectedCity.push(cityIdd);

        this.setState({
          cityId: selectedCity,
        });
        this.setState({ loading: false });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  }

  getItemPercentage(itm) {
    let val = parseInt(itm.percent);
    return val / 30;
  }

  selectImage = async () => {
    //this.notifyMessage("under construction");
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
      base64: false,
    });
    console.log("selected image1", pickerResult);
    if (pickerResult.cancelled === true) {
      return;
    }

    let localUri = pickerResult.uri;
    let filename = localUri.split("/").pop();
    console.log("file name", filename);

    // Infer the type of the image
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;
    console.log("file type", type);

    // Upload the image using the fetch and FormData APIs
    let formData = new FormData();
    // Assume "files" is the name of the form field the server expects
    var photo = {
      uri: localUri,
      type: type,
      name: filename,
    };
    console.log("photo", photo);
    formData.append("files", photo);

    //var file = this.dataURLtoBlob(pickerResult.uri);
    //console.log("file",file);

    this.notifyMessage("under construction");

    //this.uploadImage(formData);
  };

  uploadImage(formData) {
    this.setState({ loading: true });
    // console.log("image for upload", image);
    // let formData = new FormData();
    // formData.append("files", image);
    this.setState({ loading: true });
    fetch("http://44.240.53.177/api/pub/files/temp", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: "" + this.props.currentUser.accessToken + "",
      },
      body: formData,
    })
      .then((response) => {
        console.log("response");
        console.log(response);
        return response.json();
      })
      .then((json) => {
        this.setState({ loading: false });
        console.log("varse");
        console.log(json[0]);
      })
      .catch((error) => {
        console.log("error image upload", error);
        this.setState({ loading: false });
        alert("fail");
        //this.notifyMessage("Server Problem");
      });
  }

  addSkill = (skill) => {
    this.setState({ skillModalVisible: false });

    var profile = {};
    profile.profile = JSON.parse(JSON.stringify(this.props.profile.profile));
    profile.skills = JSON.parse(
      JSON.stringify(this.state.editedProfile.skills)
    );
    profile.skills.push(skill);
    profile.user = JSON.parse(JSON.stringify(this.props.profile.user));
    profile.educations = JSON.parse(
      JSON.stringify(this.props.profile.educations)
    );
    profile.experiments = JSON.parse(
      JSON.stringify(this.props.profile.experiments)
    );
    profile.hourRates = JSON.parse(
      JSON.stringify(this.props.profile.hourRates)
    );

    const skillUpdater = (result) => {
      var update = JSON.parse(JSON.stringify(this.state.editedProfile));
      update.skills = result.skills;
      this.setState({ editedProfile: update });
    };

    this.updateProfile(
      profile.profile,
      profile.skills,
      profile.user,
      profile.educations,
      profile.experiments,
      profile.hourRates,
      skillUpdater
    );
  };

  logout = () => {
    this.props.userProfile(null);
    this.props.userLogined(null);
    this.setState({ editedProfile: null });
  };

  deleteSkill = (inputSkill) => {
    var profile = {};
    profile.profile = JSON.parse(JSON.stringify(this.props.profile.profile));
    profile.skills = JSON.parse(JSON.stringify(this.props.profile.skills));
    var index = -1;

    profile.skills.forEach((skill, i) => {
      if (skill.skillId == inputSkill.skillId) {
        index = i;
        return;
      }
    });
    if (index > -1) {
      profile.skills.splice(index, 1);
    } else {
      return;
    }
    profile.user = JSON.parse(JSON.stringify(this.props.profile.user));
    profile.educations = JSON.parse(
      JSON.stringify(this.props.profile.educations)
    );
    profile.experiments = JSON.parse(
      JSON.stringify(this.props.profile.experiments)
    );
    profile.hourRates = JSON.parse(
      JSON.stringify(this.props.profile.hourRates)
    );

    const skillUpdater = (result) => {
      var update = JSON.parse(JSON.stringify(this.state.editedProfile));
      update.skills = result.skills;
      this.setState({ editedProfile: update });
    };

    this.updateProfile(
      profile.profile,
      profile.skills,
      profile.user,
      profile.educations,
      profile.experiments,
      profile.hourRates,
      skillUpdater
    );
  };

  hideSkillModal = () => {
    this.setState({ skillModalVisible: false });
  };

  addHourly = (hourly) => {
    this.setState({ hourlyModalVisible: false });

    var profile = {};
    profile.profile = JSON.parse(JSON.stringify(this.props.profile.profile));
    profile.skills = JSON.parse(JSON.stringify(this.props.profile.skills));
    profile.user = JSON.parse(JSON.stringify(this.props.profile.user));
    profile.educations = JSON.parse(
      JSON.stringify(this.props.profile.educations)
    );
    profile.experiments = JSON.parse(
      JSON.stringify(this.props.profile.experiments)
    );
    var hourRates = [];
    hourRates.push(hourly);
    profile.hourRates = hourRates;

    const hourlyUpdater = (result) => {
      var update = JSON.parse(JSON.stringify(this.state.editedProfile));
      update.hourRates = result.hourRates;
      this.setState({ editedProfile: update });
    };

    this.updateProfile(
      profile.profile,
      profile.skills,
      profile.user,
      profile.educations,
      profile.experiments,
      profile.hourRates,
      hourlyUpdater
    );
  };

  deleteHourly = (hourly) => {
    this.setState({ hourlyModalVisible: false });

    var profile = {};
    profile.profile = JSON.parse(JSON.stringify(this.props.profile.profile));
    profile.skills = JSON.parse(
      JSON.stringify(this.state.editedProfile.skills)
    );
    profile.user = JSON.parse(JSON.stringify(this.props.profile.user));
    profile.educations = JSON.parse(
      JSON.stringify(this.props.profile.educations)
    );
    profile.experiments = JSON.parse(
      JSON.stringify(this.props.profile.experiments)
    );
    var hourRates = [];
    profile.hourRates = hourRates;

    const hourlyUpdater = (result) => {
      var update = JSON.parse(JSON.stringify(this.state.editedProfile));
      update.hourRates = result.hourRates;
      this.setState({ editedProfile: update });
    };

    this.updateProfile(
      profile.profile,
      profile.skills,
      profile.user,
      profile.educations,
      profile.experiments,
      profile.hourRates,
      hourlyUpdater
    );
  };

  hideHourlyModal = () => {
    this.setState({ hourlyModalVisible: false });
  };

  addExperience = (experience) => {
    this.setState({ experienceModalVisible: false });

    var profile = {};
    profile.profile = JSON.parse(JSON.stringify(this.props.profile.profile));
    profile.skills = JSON.parse(JSON.stringify(this.props.profile.skills));
    profile.user = JSON.parse(JSON.stringify(this.props.profile.user));
    profile.educations = JSON.parse(
      JSON.stringify(this.props.profile.educations)
    );
    profile.experiments = JSON.parse(
      JSON.stringify(this.state.editedProfile.experiments)
    );
    profile.experiments.push(experience);
    profile.hourRates = JSON.parse(
      JSON.stringify(this.props.profile.hourRates)
    );

    const skillUpdater = (result) => {
      var update = JSON.parse(JSON.stringify(this.state.editedProfile));
      update.experiments = result.experiments;
      this.setState({ editedProfile: update });
    };

    this.updateProfile(
      profile.profile,
      profile.skills,
      profile.user,
      profile.educations,
      profile.experiments,
      profile.hourRates,
      skillUpdater
    );
  };

  deleteExperience = (inputExperience) => {
    var profile = {};
    profile.profile = JSON.parse(JSON.stringify(this.props.profile.profile));
    profile.skills = JSON.parse(JSON.stringify(this.props.profile.skills));
    profile.experiments = JSON.parse(
      JSON.stringify(this.props.profile.experiments)
    );
    var index = -1;
    profile.experiments.forEach((experiment, i) => {
      if (experiment.id == inputExperience.id) {
        index = i;
        return;
      }
    });
    if (index > -1) {
      profile.experiments.splice(index, 1);
    } else {
      return;
    }
    profile.user = JSON.parse(JSON.stringify(this.props.profile.user));
    profile.educations = JSON.parse(
      JSON.stringify(this.props.profile.educations)
    );
    profile.hourRates = JSON.parse(
      JSON.stringify(this.props.profile.hourRates)
    );

    const skillUpdater = (result) => {
      var update = JSON.parse(JSON.stringify(this.state.editedProfile));
      update.experiments = result.experiments;
      this.setState({ editedProfile: update });
    };

    this.updateProfile(
      profile.profile,
      profile.skills,
      profile.user,
      profile.educations,
      profile.experiments,
      profile.hourRates,
      skillUpdater
    );
  };

  addEducation = (education) => {
    this.setState({ educationModalVisible: false });

    var profile = {};
    profile.profile = JSON.parse(JSON.stringify(this.props.profile.profile));
    profile.skills = JSON.parse(JSON.stringify(this.props.profile.skills));
    profile.user = JSON.parse(JSON.stringify(this.props.profile.user));
    profile.educations = JSON.parse(
      JSON.stringify(this.state.editedProfile.educations)
    );
    profile.educations.push(education);
    profile.experiments = JSON.parse(
      JSON.stringify(this.props.profile.experiments)
    );
    profile.hourRates = JSON.parse(
      JSON.stringify(this.props.profile.hourRates)
    );

    const skillUpdater = (result) => {
      var update = JSON.parse(JSON.stringify(this.state.editedProfile));
      update.educations = result.educations;
      this.setState({ editedProfile: update });
    };

    this.updateProfile(
      profile.profile,
      profile.skills,
      profile.user,
      profile.educations,
      profile.experiments,
      profile.hourRates,
      skillUpdater
    );
  };

  hideEducationModal = () => {
    this.setState({ educationModalVisible: false });
  };

  deleteEducation = (inputEducation) => {
    var profile = {};
    profile.profile = JSON.parse(JSON.stringify(this.props.profile.profile));
    profile.skills = JSON.parse(JSON.stringify(this.props.profile.skills));
    profile.experiments = JSON.parse(
      JSON.stringify(this.props.profile.experiments)
    );
    profile.educations = JSON.parse(
      JSON.stringify(this.props.profile.educations)
    );
    var index = -1;
    profile.educations.forEach((education, i) => {
      if (education.id == inputEducation.id) {
        index = i;
        return;
      }
    });
    if (index > -1) {
      profile.educations.splice(index, 1);
    } else {
      return;
    }
    profile.user = JSON.parse(JSON.stringify(this.props.profile.user));
    profile.hourRates = JSON.parse(
      JSON.stringify(this.props.profile.hourRates)
    );

    const skillUpdater = (result) => {
      var update = JSON.parse(JSON.stringify(this.state.editedProfile));
      update.educations = result.educations;
      this.setState({ editedProfile: update });
    };

    this.updateProfile(
      profile.profile,
      profile.skills,
      profile.user,
      profile.educations,
      profile.experiments,
      profile.hourRates,
      skillUpdater
    );
  };

  hideExperienceModal = () => {
    this.setState({ experienceModalVisible: false });
  };

  isEmpty(str) {
    return !str || 0 === str.length || !str.trim();
  }

  saveChanges() {
    if (this.isEmpty(this.state.editedProfile.user.firstName)) {
      this.notifyMessage("first name is required");
      return;
    }

    if (this.isEmpty(this.state.editedProfile.user.lastName)) {
      this.notifyMessage("last name is required");
      return;
    }

    if (
      this.state.countryId == null ||
      this.isEmpty("" + this.state.countryId[0])
    ) {
      this.notifyMessage("country is required");
      return;
    }

    if (this.state.cityId == null || this.isEmpty("" + this.state.cityId[0])) {
      this.notifyMessage("city is required");
      return;
    }

    let userInfo = {};

    userInfo.firstName = this.state.editedProfile.user.firstName;
    userInfo.lastName = this.state.editedProfile.user.lastName;
    userInfo.birthDate = this.state.birthDate
      ? this.model.birthDate + "T00:00:00.000"
      : null;

    userInfo.address = null;
    userInfo.zipCode = this.state.editedProfile.profile.zipCode;
    userInfo.bio = this.state.editedProfile.profile.bio;
    userInfo.language = this.state.editedProfile.profile.language;
    userInfo.mobile = this.state.editedProfile.user.mobile;
    userInfo.webSite = this.state.editedProfile.profile.webSite;
    userInfo.linkedin = this.state.editedProfile.profile.linkedin;

    if (
      this.state.countryId != null &&
      !this.isEmpty("" + this.state.countryId[0])
    ) {
      userInfo.countryId = this.state.countryId[0];
      for (let itm of this.state.countries) {
        if (itm.id == userInfo.countryId) {
          userInfo.country = itm;
          break;
        }
      }
    } else {
      userInfo.countryId = null;
      userInfo.country = null;
    }

    if (this.state.cityId != null && !this.isEmpty("" + this.state.cityId[0])) {
      userInfo.cityId = this.state.cityId[0];
      for (let itm of this.state.cities) {
        if (itm.id == userInfo.cityId) {
          userInfo.city = itm;
          break;
        }
      }
    } else {
      userInfo.cityId = null;
      userInfo.city = null;
    }

    let profile = JSON.parse(JSON.stringify(this.props.profile.profile));
    let user = JSON.parse(JSON.stringify(this.props.profile.user));
    let skills = JSON.parse(JSON.stringify(this.props.profile.skills));
    let educations = JSON.parse(JSON.stringify(this.props.profile.educations));
    let experiments = JSON.parse(
      JSON.stringify(this.props.profile.experiments)
    );
    let hourRates = JSON.parse(JSON.stringify(this.props.profile.hourRates));

    user.firstName = userInfo.firstName;
    user.mobile = userInfo.mobile;
    user.lastName = userInfo.lastName;

    profile.language = userInfo.language;
    profile.birthDate = userInfo.birthDate;
    profile.address = userInfo.address;
    profile.countryId = userInfo.countryId;
    profile.country = userInfo.country;
    profile.cityId = userInfo.cityId;
    profile.city = userInfo.city;
    profile.zipCode = userInfo.zipCode;
    profile.linkedin = userInfo.linkedin;
    profile.webSite = userInfo.webSite;
    profile.bio = userInfo.bio;

    //profile section
    profile.image = this.state.editedProfile.profile.image;
    profile.background = this.state.editedProfile.profile.background;

    const skillUpdater = (result) => {
      this.setState({ editedProfile: result });
    };

    this.updateProfile(
      profile,
      skills,
      user,
      educations,
      experiments,
      hourRates,
      skillUpdater
    );
  }

  updateProfile(
    profile,
    skills,
    user,
    educations,
    experiments,
    hourRates,
    resultUpdater
  ) {
    this.setState({ loading: true });
    fetch("http://44.240.53.177/api/idn/account/profile", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: "" + this.props.currentUser.accessToken + "",
      },
      body: JSON.stringify({
        profile: profile,
        skills,
        skills,
        user,
        user,
        educations,
        educations,
        experiments,
        experiments,
        hourRates,
        hourRates,
        uniqueId: "admin",
        clientType: "WEB",
      }),
    })
      .then((response) => response.json())
      .then((json) => {
        this.setState({ loading: false });
        if (json[0] && json[0].error) {
          this.notifyMessage(getServerErrorMessage(json[0]));
        } else if (json.error) {
          this.notifyMessage(getHttpErrorMessage(json));
        } else {
          this.notifyMessage("profile updated");
          this.props.userProfile(json);
          resultUpdater(json);
        }
      })
      .catch((error) => {
        console.log("error profile udpate", error);
        this.setState({ loading: false });
        this.notifyMessage("Server Problem");
      });
  }

  render() {
    if (!this.props.currentUser || !this.props.currentUser.accessToken) {
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
            You are not logged in. Please log in and try again
          </Text>
          <TouchableOpacity
            style={styles.signinSignout}
            onPress={() => this.props.navigation.navigate("SignInContainer")}
          >
            <Text style={styles.success}>Signin / Signup</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (
      this.props.currentUser &&
      this.props.currentUser.accessToken &&
      (!this.state.editedProfile || !this.state.editedProfile.user)
    ) {
      return (
        <View style={[styles.container1, styles.horizontal]}>
          <ActivityIndicator size="large" color={Color.primary} />
        </View>
      );
    } else if (
      this.state.editedProfile &&
      this.state.editedProfile.user &&
      !this.state.editedProfile.user.emailConfirmed
    ) {
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
            You are not confirmed your email, please confirm your email and try
            again
          </Text>
          <TouchableOpacity
            style={styles.signinSignout}
            onPress={() => this.props.navigation.replace("ConfirmEmail")}
          >
            <Text style={styles.success}>Confirm Email</Text>
          </TouchableOpacity>
        </View>
      );
    } else {
      return (
        <View>
          <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.header}>
              <View style={styles.headerContent}>
                <TouchableOpacity
                  onPress={() => {
                    this.selectImage();
                  }}
                >
                  <Image
                    style={styles.avatar}
                    source={
                      this.state.editedProfile.profile &&
                      this.state.editedProfile.profile.image !== null
                        ? {
                            uri:
                              "http://44.240.53.177/files/" +
                              this.state.editedProfile.profile.image,
                          }
                        : {
                            uri:
                              "https://bootdey.com/img/Content/avatar/avatar6.png",
                          }
                    }
                    key={this.state.editedProfile.user.id}
                  />
                </TouchableOpacity>

                <Text style={styles.name}>
                  {this.state.editedProfile.user.firstName}{" "}
                  {this.state.editedProfile.user.lastName}
                </Text>
                <Text style={styles.userInfo}>
                  {this.state.editedProfile.user.email}
                </Text>
                {this.state.editedProfile.profile.city && (
                  <Text style={styles.userInfo}>
                    {this.state.editedProfile.profile.city.name}
                  </Text>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <TouchableOpacity
                    style={styles.messagesButton}
                    onPress={() =>
                      this.props.navigation.navigate("MessageContainer")
                    }
                  >
                    <Text style={styles.messageText}>Messages</Text>
                    {this.state.unreadMessageCount > 0 && (
                      <Badge
                        status="error"
                        value={this.state.unreadMessageCount}
                        containerStyle={{
                          position: "absolute",
                          top: -4,
                          right: -4,
                        }}
                      />
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.logoutButton}
                    onPress={() => this.logout()}
                  >
                    <Text style={styles.danger}>Logout</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={styles.body}>
              <View style={styles.cardContainer}>
                <Card>
                  <View>
                    <Text style={{ textAlign: "center", marginBottom: 10 }}>
                      USER INFORMATION
                    </Text>
                  </View>
                  <Card.Divider />

                  <Text style={styles.lable}>First Name*</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      underlineColorAndroid="transparent"
                      placeholder="First Name"
                      placeholderTextColor="grey"
                      multiline={false}
                      value={this.state.editedProfile.user.firstName}
                      onChangeText={(value) => {
                        this.state.editedProfile.user.firstName = value;
                        this.setState({
                          editedProfile: this.state.editedProfile,
                        });
                      }}
                    />
                  </View>

                  <Text style={styles.lable}>Last Name*</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      underlineColorAndroid="transparent"
                      placeholder="Last Name"
                      placeholderTextColor="grey"
                      multiline={false}
                      value={this.state.editedProfile.user.lastName}
                      onChangeText={(value) => {
                        this.state.editedProfile.user.lastName = value;
                        this.setState({
                          editedProfile: this.state.editedProfile,
                        });
                      }}
                    />
                  </View>

                  <Text style={styles.lable}>Language</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      underlineColorAndroid="transparent"
                      placeholder="English,Spanish'"
                      placeholderTextColor="grey"
                      multiline={false}
                      value={this.state.editedProfile.profile.language}
                      onChangeText={(value) => {
                        this.state.editedProfile.profile.language = value;
                        this.setState({
                          editedProfile: this.state.editedProfile,
                        });
                      }}
                    />
                  </View>
                </Card>
              </View>

              <View style={styles.cardContainer}>
                <Card>
                  <View>
                    <Text style={{ textAlign: "center", marginBottom: 10 }}>
                      ADDRESS
                    </Text>
                  </View>
                  <Card.Divider />

                  {
                    <View style={{ zIndex: 999 }}>
                      <Text style={(styles.lable, { marginBottom: 10 })}>
                        Country*
                      </Text>
                      <MultiSelect
                        items={this.state.countries}
                        uniqueKey="id"
                        ref={(component) => {
                          this.multiSelect = component;
                        }}
                        onSelectedItemsChange={(value) => {
                          console.log("value", value);
                          this.setState({ countryId: value });
                          this.setState({ cityId: [] });
                          this.getCities(value[0]);
                        }}
                        selectedItems={this.state.countryId}
                        selectText="  Countries"
                        searchInputPlaceholderText="Country Name"
                        onChangeInput={(text) => console.log(text)}
                        tagRemoveIconColor="#CCC"
                        tagBorderColor="#CCC"
                        tagTextColor="#CCC"
                        selectedItemTextColor="#CCC"
                        selectedItemIconColor="#CCC"
                        itemTextColor="#000"
                        displayKey="name"
                        searchInputStyle={{ color: "#CCC" }}
                        submitButtonColor={Color.primaryBackground}
                        submitButtonText="Select Country"
                        hideSubmitButton={true}
                        single={true}
                        styleItemsContainer={{ height: 250 }}
                        styleDropdownMenuSubsection={{ borderWidth: 1 }}
                      />
                    </View>
                  }

                  {this.state.cityId != undefined && (
                    <View style={{ zIndex: 10, marginBottom: 10 }}>
                      <Text
                        style={
                          (styles.lable, { marginTop: 10, marginBottom: 10 })
                        }
                      >
                        City*
                      </Text>
                      <MultiSelect
                        items={this.state.cities}
                        uniqueKey="id"
                        ref={(component) => {
                          this.multiSelect = component;
                        }}
                        onSelectedItemsChange={(value) => {
                          console.log("value", value);
                          this.setState({ cityId: value });
                        }}
                        selectedItems={this.state.cityId}
                        selectText="  Cities"
                        searchInputPlaceholderText="City Name"
                        onChangeInput={(text) => console.log(text)}
                        tagRemoveIconColor="#CCC"
                        tagBorderColor="#CCC"
                        tagTextColor="#CCC"
                        selectedItemTextColor="#CCC"
                        selectedItemIconColor="#CCC"
                        itemTextColor="#000"
                        displayKey="name"
                        searchInputStyle={{ color: "#CCC" }}
                        submitButtonColor={Color.primaryBackground}
                        submitButtonText="Select City"
                        hideSubmitButton={true}
                        single={true}
                        styleItemsContainer={{ height: 250 }}
                        styleDropdownMenuSubsection={{ borderWidth: 1 }}
                      />
                    </View>
                  )}

                  <Text style={styles.lable}>Zip Code</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      underlineColorAndroid="transparent"
                      placeholder="Zip Code"
                      placeholderTextColor="grey"
                      multiline={false}
                      value={this.state.editedProfile.profile.zipCode}
                      onChangeText={(value) => {
                        this.state.editedProfile.profile.zipCode = value;
                        this.setState({
                          editedProfile: this.state.editedProfile,
                        });
                      }}
                    />
                  </View>
                </Card>
              </View>

              <View style={styles.cardContainer}>
                <Card>
                  <View>
                    <Text style={{ textAlign: "center", marginBottom: 10 }}>
                      CONTACT INFORMATION
                    </Text>
                  </View>
                  <Card.Divider />

                  <Text style={styles.lable}>Email Address</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      underlineColorAndroid="transparent"
                      placeholder="Email Address"
                      placeholderTextColor="grey"
                      multiline={false}
                      editable={false}
                      value={this.state.editedProfile.user.email}
                      onChangeText={(value) => {
                        this.state.editedProfile.user.email = value;
                        this.setState({
                          editedProfile: this.state.editedProfile,
                        });
                      }}
                    />
                  </View>

                  <Text style={styles.lable}>Tel(including country code)</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      underlineColorAndroid="transparent"
                      placeholder="e.g. +1-541-754-3010"
                      placeholderTextColor="grey"
                      multiline={false}
                      value={this.state.editedProfile.user.mobile}
                      onChangeText={(value) => {
                        this.state.editedProfile.user.mobile = value.replace(
                          /[^0-9]/g,
                          ""
                        );
                        this.setState({
                          editedProfile: this.state.editedProfile,
                        });
                      }}
                    />
                  </View>

                  <Text style={styles.lable}>Linkedin</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      underlineColorAndroid="transparent"
                      placeholder="Linkedin"
                      placeholderTextColor="grey"
                      multiline={false}
                      value={this.state.editedProfile.profile.linkedin}
                      onChangeText={(value) => {
                        this.state.editedProfile.profile.linkedin = value;
                        this.setState({
                          editedProfile: this.state.editedProfile,
                        });
                      }}
                    />
                  </View>

                  <Text style={styles.lable}>Website</Text>
                  <View style={styles.inputContainer}>
                    <TextInput
                      style={styles.input}
                      underlineColorAndroid="transparent"
                      placeholder="Website"
                      placeholderTextColor="grey"
                      multiline={false}
                      value={this.state.editedProfile.profile.webSite}
                      onChangeText={(value) => {
                        this.state.editedProfile.profile.webSite = value;
                        this.setState({
                          editedProfile: this.state.editedProfile,
                        });
                      }}
                    />
                  </View>
                </Card>
              </View>

              <View style={styles.cardContainer}>
                <Card
                  titleStyle={{ textAlign: "left" }}
                  title={
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <Text>SKILLS</Text>
                      <View style={{ flexGrow: 1 }} />
                      <Icon
                        name="add"
                        disabled={this.state.editedProfile.skills.length > 4}
                        onPress={() =>
                          this.setState({ skillModalVisible: true })
                        }
                        color="#67c23a"
                      />
                    </View>
                  }
                >
                  <Card.Divider />
                  {this.state.editedProfile.skills.length > 0 &&
                    this.state.editedProfile.skills.map((skill, index) => (
                      <View
                        key={index}
                        style={{
                          flexDirection: "row",
                          justifyContent: "center",
                          marginBottom: 10,
                        }}
                      >
                        <View style={{ width: "80%" }}>
                          <Text
                            style={{
                              textAlign: "center",
                              marginBottom: 4,
                              fontSize: 14,
                            }}
                          >
                            {skill.name}({skill.percent} years)
                          </Text>
                          <ProgressBar
                            progress={this.getItemPercentage(skill)}
                            color="#f5365c"
                          />
                        </View>
                        <View style={{ marginLeft: "auto", marginTop: 9 }}>
                          <Icon
                            name="trash"
                            type="font-awesome"
                            style={{ right: 0 }}
                            size={24}
                            onPress={() => this.deleteSkill(skill)}
                            color="#f56c6c"
                          />
                        </View>
                      </View>
                    ))}
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
                        disabled={this.state.editedProfile.hourRates.length > 0}
                        onPress={() =>
                          this.setState({ hourlyModalVisible: true })
                        }
                        color="#67c23a"
                      />
                    </View>
                  }
                >
                  <Card.Divider />
                  {this.state.editedProfile.hourRates.length > 0 && (
                    <View style={{ flex: 5, flexDirection: "row" }}>
                      <Text
                        style={{ flex: 3, textAlign: "left", marginTop: 5 }}
                      >
                        {this.state.editedProfile.hourRates[0].amount}{" "}
                        {this.state.editedProfile.hourRates[0].currency}
                      </Text>
                      <View style={{ marginLeft: "auto" }}>
                        <Icon
                          name="trash"
                          type="font-awesome"
                          style={{ right: 0 }}
                          size={24}
                          onPress={() => this.deleteHourly()}
                          color="#f56c6c"
                        />
                      </View>
                    </View>
                  )}
                </Card>
              </View>

              <View style={styles.cardContainer}>
                <Card
                  titleStyle={{ textAlign: "left" }}
                  title={
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <Text>Experience</Text>
                      <View style={{ flexGrow: 1 }} />
                      <Icon
                        name="add"
                        onPress={() =>
                          this.setState({ experienceModalVisible: true })
                        }
                        color="#67c23a"
                      />
                    </View>
                  }
                >
                  <Card.Divider />
                  {this.state.editedProfile.experiments.length > 0 &&
                    this.state.editedProfile.experiments.map(
                      (experiment, index) => (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            marginBottom: 13,
                          }}
                        >
                          <View style={{ width: "80%" }}>
                            <Text
                              style={{
                                textAlign: "left",
                                marginBottom: 4,
                                fontSize: 14,
                              }}
                            >
                              {experiment.start.split("T")[0] +
                                " - " +
                                experiment.end.split("T")[0]}
                            </Text>
                            <Text
                              style={{
                                textAlign: "left",
                                marginBottom: 4,
                                fontSize: 14,
                              }}
                            >
                              {experiment.workplace}
                            </Text>
                          </View>
                          <View style={{ marginLeft: "auto", marginTop: 5 }}>
                            <Icon
                              name="trash"
                              type="font-awesome"
                              style={{ right: 0 }}
                              size={24}
                              onPress={() => this.deleteExperience(experiment)}
                              color="#f56c6c"
                            />
                          </View>
                        </View>
                      )
                    )}
                </Card>
              </View>

              <View style={styles.cardContainer}>
                <Card
                  titleStyle={{ textAlign: "left" }}
                  title={
                    <View style={{ display: "flex", flexDirection: "row" }}>
                      <Text>Educations</Text>
                      <View style={{ flexGrow: 1 }} />
                      <Icon
                        name="add"
                        onPress={() =>
                          this.setState({ educationModalVisible: true })
                        }
                        color="#67c23a"
                      />
                    </View>
                  }
                >
                  <Card.Divider />
                  {this.state.editedProfile.educations.length > 0 &&
                    this.state.editedProfile.educations.map(
                      (education, index) => (
                        <View
                          key={index}
                          style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            marginBottom: 13,
                          }}
                        >
                          <View style={{ width: "80%" }}>
                            <Text
                              style={{
                                textAlign: "left",
                                marginBottom: 4,
                                fontSize: 14,
                              }}
                            >
                              {education.entering.split("T")[0] +
                                " - " +
                                education.departure.split("T")[0]}
                            </Text>
                            <Text
                              style={{
                                textAlign: "left",
                                marginBottom: 4,
                                fontSize: 14,
                              }}
                            >
                              {education.university}
                            </Text>
                          </View>
                          <View style={{ marginLeft: "auto", marginTop: 5 }}>
                            <Icon
                              name="trash"
                              type="font-awesome"
                              style={{ right: 0 }}
                              size={24}
                              onPress={() => this.deleteEducation(education)}
                              color="#f56c6c"
                            />
                          </View>
                        </View>
                      )
                    )}
                </Card>
              </View>

              <View style={styles.cardContainer}>
                <Card>
                  <View>
                    <Text style={{ textAlign: "center", marginBottom: 10 }}>
                      ABOUT ME
                    </Text>
                  </View>
                  <Card.Divider />

                  <View style={styles.textAreaContainer}>
                    <TextInput
                      style={styles.textArea}
                      underlineColorAndroid="transparent"
                      placeholder="A few lines about me"
                      placeholderTextColor="grey"
                      numberOfLines={4}
                      multiline={true}
                      value={this.state.editedProfile.profile.bio}
                      onChangeText={(value) => {
                        this.state.editedProfile.profile.bio = value;
                        this.setState({
                          editedProfile: this.state.editedProfile,
                        });
                      }}
                    />
                  </View>
                </Card>

                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => {
                      this.saveChanges();
                    }}
                  >
                    <Text style={styles.success}>Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => {
                      this.getProfile();
                      this.getCountries();
                    }}
                  >
                    <Text style={styles.danger}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </ScrollView>
          <AddSkillModal
            visible={this.state.skillModalVisible}
            hideModal={this.hideSkillModal}
            addSkill={this.addSkill}
          />
          <AddHourlyRateModal
            visible={this.state.hourlyModalVisible}
            hideModal={this.hideHourlyModal}
            addHourly={this.addHourly}
          />
          <AddExperienceModal
            visible={this.state.experienceModalVisible}
            hideModal={this.hideExperienceModal}
            addExperience={this.addExperience}
          />
          <AddEducationModal
            visible={this.state.educationModalVisible}
            hideModal={this.hideEducationModal}
            addEducation={this.addEducation}
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
        </View>
      );
    }
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
    paddingBottom: 20,
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
  logoutButton: {
    height: 35,
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 30,
    backgroundColor: "#f56c6c",
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
    backgroundColor: "#11cdef",
  },
  success: {
    color: "white",
  },
  danger: {
    color: "white",
  },
  messageText: {
    color: "black",
  },
  lable: {
    fontSize: 15,
  },
  textAreaContainer: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 5,
  },
  textArea: {
    height: 150,
    justifyContent: "flex-start",
  },
  inputContainer: {
    marginTop: 10,
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingLeft: 5,
    borderBottomWidth: 1,
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
  input: {
    justifyContent: "flex-start",
    borderBottomColor: "#FFFFFF",
    flex: 1,
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

export default connect(mapStateToProps, matchDispatchToProps)(Profile);
