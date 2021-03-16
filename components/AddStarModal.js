import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Color from "../constants/color.js";
import { Modal, Portal, Button, Provider } from "react-native-paper";
import MultiSelect from "react-native-multiple-select";
import { connect } from "react-redux";
import { getUsers } from "../redux/actions/index";
import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import NumericInput from "react-native-numeric-input";
import { Rating, AirbnbRating } from "react-native-elements";

class AddStarModal extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      errorText: "",
      technicalRating: 3,
      timeRating: 3,
      communicationRating: 3,
    };
  }

  

  setTechnicalRating(value) {
    this.setState({ technicalRating: value });
  }

  setTimeRating(value) {
    this.setState({ timeRating: value });
  }

  setCommunicationRating(value) {
    this.setState({ communicationRating: value });
  }

  isEmpty(str) {
    return !str || 0 === str.length || !str.trim();
  }

  addNewStar() {
    let technicalParams = {};
    technicalParams.userId = this.props.userId;
    technicalParams.rateType = "TECHNICAL";
    technicalParams.rate = this.state.technicalRating * 2;

    let timeParams = {};
    timeParams.userId = this.props.userId;
    timeParams.rateType = "TIME";
    timeParams.rate = this.state.timeRating * 2;

    let communicationParams = {};
    communicationParams.userId = this.props.userId;
    communicationParams.rateType = "COMMUNICATION";
    communicationParams.rate = this.state.communicationRating * 2;

    let newRate={};
    newRate.TECHNICAL = technicalParams;
    newRate.TIME = timeParams;
    newRate.COMMUNICATION = communicationParams;

    this.props.addStar(newRate);
    this.setState({technicalRating:3});
    this.setState({timeRating:3});
    this.setState({communicationRating:3});
  }

  render() {
    // const [text, setText] = useState('');
    return (
      <Provider>
        <Portal>
          <Modal
            visible={this.props.visible}
            onDismiss={() => this.props.hideModal()}
            contentContainerStyle={{
              backgroundColor: "white",
              padding: 20,
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <Text style={{ fontSize: 16, marginBottom: 5 }}>
              Technical Skills:
            </Text>
            <AirbnbRating
              onFinishRating={(value) => this.setTechnicalRating(value)}
              showRating={false}
            />

            <Text style={{ fontSize: 16, marginBottom: 5, marginTop: 10 }}>
              On Time:
            </Text>
            <AirbnbRating
              onFinishRating={(value) => this.setTimeRating(value)}
              showRating={false}
            />

            <Text style={{ fontSize: 16, marginBottom: 5, marginTop: 10 }}>
              Communication Skill:
            </Text>
            <AirbnbRating
              onFinishRating={(value) => this.setCommunicationRating(value)}
              showRating={false}
            />

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
                marginTop: 10,
              }}
            >
              <TouchableOpacity
                style={[styles.buttonContainer, styles.starButton]}
                onPress={() => {
                  this.addNewStar();
                }}
                disabled={this.state.loading}
              >
                <Text style={styles.starText}>Add</Text>
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

export default AddStarModal;

const styles = StyleSheet.create({
  buttonContainer: {
    height: 40,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 200,
    borderRadius: 30,
    backgroundColor: "transparent",
  },
  starButton: {
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
  starText: {
    color: "white",
  },
  errorText: {
    color: Color.error,
    fontSize: 16,
    textAlign: "center",
  },
  errorTextContainer: {
    height: 40,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
});
