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
import DatePicker from "react-native-datepicker";

class AddEducationModal extends Component {
  constructor(props) {
    super();
    var currentDate = new Date();
    this.state = {
      startDate: "",
      endDate: "",
      minDate: "1980-01-01",
      maxDate: currentDate.toISOString().substring(0, 10),
      university: "",
    };
  }

  isEmpty(str) {
    return !str || 0 === str.length || !str.trim();
  }

  addNewEducation() {
    if (this.isEmpty(this.state.startDate)) {
      this.setState({ errorText: "start date is required" });
      return;
    }

    if (this.isEmpty(this.state.endDate)) {
      this.setState({ errorText: "end date is required" });
      return;
    }

    if (this.isEmpty(this.state.university)) {
      this.setState({ errorText: "university is required" });
      return;
    }

    if (new Date(this.state.startDate) > new Date(this.state.endDate)) {
      this.setState({ errorText: "end time must be greater" });
      return;
    }

    let newEducation = {
      departure: this.state.endDate + "T14:09:53.162Z",
      entering: this.state.startDate + "T14:09:53.162Z",
      university: this.state.university,
    };
    this.props.addEducation(newEducation);
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
              padding: 20,
              marginLeft: 20,
              marginRight: 20,
            }}
          >
            <DatePicker
              style={{ width: "100%", marginBottom: 10 }}
              date={this.state.startDate}
              mode="date"
              placeholder="start Date"
              format="YYYY-MM-DD"
              minDate={this.state.minDate}
              maxDate={this.state.maxDate}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: "absolute",
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                },
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(date) => {
                this.setState({ startDate: date });
              }}
            />

            <DatePicker
              style={{ width: "100%", marginBottom: 10 }}
              date={this.state.endDate}
              mode="date"
              placeholder="end Date"
              format="YYYY-MM-DD"
              minDate={this.state.minDate}
              maxDate={this.state.maxDate}
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: "absolute",
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                },
                // ... You can check the source to find the other keys.
              }}
              onDateChange={(date) => {
                this.setState({ endDate: date });
              }}
            />

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                underlineColorAndroid="transparent"
                placeholder="university"
                placeholderTextColor="grey"
                multiline={false}
                value={this.state.university}
                onChangeText={(value) => {
                  this.setState({
                    university: value,
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
                style={[styles.buttonContainer, styles.educationButton]}
                onPress={() => {
                  this.addNewEducation();
                }}
                disabled={this.state.loading}
              >
                <Text style={styles.educationText}>Add</Text>
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

export default AddEducationModal;

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
  educationButton: {
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
  educationText: {
    color: "white",
  },
  errorText: {
    color: Color.error,
    fontSize: 16,
    textAlign: "center",
  },
  errorTextContainer: {
    height: 30,
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 10,
  },
  lable: {
    fontSize: 15,
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
});
