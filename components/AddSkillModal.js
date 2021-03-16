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

class AddSkillModal extends Component {
  constructor(props) {
    super();
    this.state = {
      loading: false,
      skills: [],
      selectedItemsSkill: [],
      errorText: "",
      newSkillTitle: "",
      percent:1
    };
  }


  setPercent(percent){
    this.setState({percent:percent});
  }

  onSelectedItemsChangeSkill = (selectedItemsSkill) => {
    this.setState({ newSkillTitle: "" });
    this.setState({ errorText: "" });
    this.setState({ selectedItemsSkill: selectedItemsSkill });
  };

  setNewSkillTitle = (searchText) => {
    this.setState({ errorText: "" });
    this.setState({ selectedItemsSkill: "" });
    this.setState({ newSkillTitle: searchText });
  };

  addNewSkill = () => {
    this.setState({loading:true});
    if (
      this.isEmpty(this.state.newSkillTitle) &&
      (!this.state.selectedItemsSkill ||
      !this.state.selectedItemsSkill.length)
    ) {
      this.setState({ errorText: "skill is required" });
      this.setState({loading:false});
      return;
    }

    if (
      !this.state.selectedItemsSkill ||
      !this.state.selectedItemsSkill.length
    ) {
      fetch("http://44.240.53.177/api/pub/skills", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "" + this.props.currentUser.accessToken + "",
        },
        body: JSON.stringify({
          name: "" + this.state.newSkillTitle + "",
          uniqueId: "admin",
          clientType: "WEB",
        }),
      })
        .then((response) => response.json())
        .then((json) => {
          this.setState({loading:false});
          if (json[0] && json[0].error) {
            //alert(json[0].error);
            //console.log(json[0]);
            this.setState({ errorText: getServerErrorMessage(json[0]) });
          } else if (json.error) {
            this.setState({ errorText: getHttpErrorMessage(json) });
          } else {
            this.addSkillToProfile(json["skillId"]);
          }
        })
        .catch((error) => {
          this.setState({loading:false});
          this.setState({ errorText: "Server Problem" });
        });
      return;
    }else{
      this.setState({loading:false});
      this.addSkillToProfile(this.state.selectedItemsSkill[0]);
    }
  };

  addSkillToProfile(skillId){
    var skill = {};
    skill.skillId = skillId;
    skill.percent = this.state.percent;
    this.props.addSkill(skill);
    this.setState({selectedItemsSkill:[]});
    this.setState({errorText:''});
    this.setState({newSkillTitle:''});
    this.setState({percent:1});
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
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",}}>
                <Text>Years:</Text>
                <NumericInput 
                  value={this.state.value} 
                  onChange={value => this.setPercent(value)} 
                  onLimitReached={(isMax,msg) => console.log(isMax,msg)}
                  totalWidth={200} 
                  totalHeight={35} 
                  iconSize={10}
                  step={1}
                  minValue={1}
                  maxValue={30}
                  initValue={this.state.percent}
                  valueType='integer'
                  rounded 
                  containerStyle={{marginBottom:10}}
                  textColor='#B0228C' 
                  iconStyle={{ color: 'white' }} 
                  rightButtonBackgroundColor='#EA3788' 
                  leftButtonBackgroundColor='#E56B70'/>
        </View>

          

            <MultiSelect
              items={this.props.skillsForFilter}
              uniqueKey="skillId"
              ref={(component) => {
                this.multiSelect = component;
              }}
              onSelectedItemsChange={this.onSelectedItemsChangeSkill}
              selectedItems={this.state.selectedItemsSkill}
              selectText="  Skills"
              searchInputPlaceholderText="Skill Name"
              onChangeInput={(text) => this.setNewSkillTitle(text)}
              tagRemoveIconColor="#CCC"
              tagBorderColor="#CCC"
              tagTextColor="#CCC"
              selectedItemTextColor="#CCC"
              selectedItemIconColor="#CCC"
              itemTextColor="#000"
              displayKey="name"
              searchInputStyle={{ color: "#CCC" }}
              submitButtonColor={Color.primaryBackground}
              submitButtonText="Add Skill"
              hideSubmitButton={true}
              single={true}
              styleItemsContainer={{ height: 250 }}
              styleDropdownMenuSubsection={{ borderWidth: 1 }}
            />

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
                style={[styles.buttonContainer, styles.skillButton]}
                onPress={() => {
                  this.addNewSkill();
                }}
                disabled={this.state.loading}
              >
                <Text style={styles.skillText}>Add</Text>
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

//bind state variables to variables
function mapStateToProps(state) {
  return {
    skillsForFilter: state.skillsForFilter,
    currentUser: state.currentUser,
    profile: state.profile,
  };
}

//bind actions to props actions
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUsers: getUsers,
    },
    dispatch
  );
}

export default connect(mapStateToProps, matchDispatchToProps)(AddSkillModal);

const styles = StyleSheet.create({
  buttonContainer: {
    height: 45,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    width: 200,
    borderRadius: 30,
    backgroundColor: "transparent",
  },
  skillButton: {
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
  skillText: {
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
