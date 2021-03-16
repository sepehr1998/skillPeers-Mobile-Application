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
import NumericInput from 'react-native-numeric-input';

class AddHourlyRateModal extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      errorText: "",
      salary:1
    };
  }
  
  setSalary(salary){
    this.setState({salary:salary});
  }

  addNewhourly(){
    let newHourRate = {
      amount: this.state.salary,
      currency: "$",
      fromHour: 1,
      toHour: 1,
  };
  this.props.addHourly(newHourRate);
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
            padding: 20,
            marginLeft: 20,
            marginRight: 20,
          }}
        >

      <View style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",}}>
              <Text style={{marginBottom:20,fontSize:15}}>Hourly Rate in ($)</Text>
              <NumericInput 
                value={this.state.value} 
                onChange={value => this.setSalary(value)} 
                onLimitReached={(isMax,msg) => console.log(isMax,msg)}
                
                totalHeight={35} 
                iconSize={10}
                step={1}
                minValue={1}
                maxValue={10000}
                initValue={this.state.salary}
                valueType='integer'
                rounded 
                containerStyle={{marginBottom:10}}
                textColor='#B0228C' 
                iconStyle={{ color: 'white' }} 
                rightButtonBackgroundColor='#EA3788' 
                leftButtonBackgroundColor='#E56B70'/>
      </View>

        

          

          <View style={styles.errorTextContainer}>
            <Text style={styles.errorText}>{this.state.errorText}</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TouchableOpacity
              style={[styles.buttonContainer, styles.hourlyButton]}
              onPress={() => {
                this.addNewhourly();
              }}
              disabled={this.state.loading}
            >
              <Text style={styles.hourlyText}>Add</Text>
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

export default AddHourlyRateModal;

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
  hourlyButton: {
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
  hourlyText: {
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
