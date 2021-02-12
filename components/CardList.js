import React, { Component } from 'react';
import {
  SafeAreaView, Image, StyleSheet, ImageBackground, FlatList, View, StatusBar,
  Text, List, ActivityIndicator, Dimensions, TouchableNativeFeedback
  , TouchableOpacity, ScrollView
} from 'react-native';
import {
  Card, ListItem, Avatar, Input, Badge, Button, Icon, CheckBox, ButtonGroup,Header,
  SearchBar
} from 'react-native-elements'
import { Rating, AirbnbRating } from 'react-native-ratings';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Actions } from 'react-native-router-flux';
import {
  getRepos,
  getRepoThunk,
  repoSelected,
  getRepoSkillForFilter,
  getRepoSkillsForFilterThunk,
  getRepoCountriesForFilterThunk,
  getRepoCountryForFilter,

} from '../redux/actions/index';
import { RadioButton, TouchableRipple, Colors } from 'react-native-paper';

import RBSheet from "react-native-raw-bottom-sheet";
import BottomSheet from 'react-native-simple-bottom-sheet';
//import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import MultiSelect from 'react-native-multiple-select';
import UserCard from './UserCard';
import  color  from '../constants/color';


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  container1: {
    flex: 1,
    justifyContent: "center"
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10
  },
  myRadio: {
    paddingLeft: 6,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 3,
    backgroundColor: 'white',
    height: 55,
    elevation: 5,
    borderRadius: 4,

    borderColor: '#fe48d1',
    borderWidth: .2
  },
  myRadioPress: {
    paddingLeft: 6,
    alignItems: 'center',
    flexDirection: 'row',
    marginBottom: 3,
    backgroundColor: 'white',
    height: 55,
    elevation: 5,
    borderRadius: 4,
    borderColor: 'white',
    borderWidth: 0
  },


});



const buttons_Price = ['Price Up', 'Price Down']
const buttons_Experience = ['Experience Up', 'Experience Down']

class CardList extends Component {
  UNSAFE_componentWillMount() {
    this.props.getRepoThunk('',0,'priceAvg',
    this.state.selectedItemsSkill,this.state.selectedItemsCountry,
    this.state.currentPage,this.state.pageSize,
    this.props.activeRepo?.accessToken? this.props.activeRepo?.accessToken :'');
    this.props.getRepoSkillsForFilterThunk();
    this.props.getRepoCountriesForFilterThunk();
 
  }

  constructor(props) {
    super()
    this.state =
    {
      value: 'second',
      selectedIndex_Price: 0,
      selectedIndex_Experience: 2,
      checked: false,
      search: '',
      experiseOrPrice:'priceAvg',
      currentPage: 1,
      pageSize: 3,
      pageCount: 10,
    }

    this.changeState = this.changeState.bind(this)
    this.updateIndex_Price = this.updateIndex_Price.bind(this)
    this.updateIndex_Experience = this.updateIndex_Experience.bind(this)
  }
  onSelectedItemsChangeSkill = (selectedItemsSkill) => {
    this.setState({ selectedItemsSkill });
   //@@@@@@@@@@@@
    this.props.getRepoThunk(
      this.state.search,this.state.selectedIndex_Price,
      this.state.experiseOrPrice,selectedItemsSkill,this.state.selectedItemsCountry,
      this.state.currentPage,this.state.pageSize,
      this.props.activeRepo?.accessToken? this.props.activeRepo?.accessToken :'');
  };
  onSelectedItemsChangeCountry = (selectedItemsCountry) => {
    this.setState({ selectedItemsCountry });
    //@@@@@@@@@@@
    this.props.getRepoThunk(
      this.state.search,this.state.selectedIndex_Price,
      this.state.experiseOrPrice,this.state.selectedItemsSkill,selectedItemsCountry,
      this.state.currentPage,this.state.pageSize,
      this.props.activeRepo?.accessToken? this.props.activeRepo?.accessToken :'');

  };
  changeState(value) {

    this.setState({ value: value, })

  }
  updateIndex_Price(selectedIndex_Price) {
    this.setState({ selectedIndex_Price })
    this.state.selectedIndex_Experience=2;
    this.state.experiseOrPrice='priceAvg';
    //@@@@@@@@@@@
    this.props.getRepoThunk(
      this.state.search,selectedIndex_Price,'priceAvg',
      this.state.selectedItemsSkill,this.state.selectedItemsCountry,
      this.state.currentPage,this.state.pageSize,
      this.props.activeRepo?.accessToken? this.props.activeRepo?.accessToken :'');

  }
  updateIndex_Experience(selectedIndex_Experience) {
    this.setState({ selectedIndex_Experience })
    this.state.selectedIndex_Price=2;
    this.state.experiseOrPrice='experimentAvg'
     //@@@@@@@@@@@
    this.props.getRepoThunk(
      this.state.search,selectedIndex_Experience,'experimentAvg',
      this.state.selectedItemsSkill,this.state.selectedItemsCountry,
      this.state.currentPage,this.state.pageSize,
      this.props.activeRepo?.accessToken? this.props.activeRepo?.accessToken :'');
  }
  updateSearch = (search) => {
    this.setState({ search });
    //@@@@@@@@@@@@@@
    this.props.getRepoThunk(
      search,this.state.selectedIndex_Price,this.state.experiseOrPrice,
      this.state.selectedItemsSkill,this.state.selectedItemsCountry,
      this.state.currentPage,this.state.pageSize,
      this.props.activeRepo?.accessToken? this.props.activeRepo?.accessToken :'');
  
  };

  updateSearch = (search) => {
    this.setState({ search });
  };


  render() {

    const dimensions = Dimensions.get('window');
    const AvatarWidth = dimensions.width / 2;
    const { selectedIndex_Price } = this.state
    const { selectedIndex_Experience } = this.state
    const { search } = this.state;
    const { selectedItemsSkill } = this.state;
    const { selectedItemsCountry } = this.state;


    const renderItem = ({ item }) => (
      // <Item title={item.firstName} />
      <UserCard user={item} />

    );


    if (this.props.repos.length === 0) {
      return (
        <View style={[styles.container1, styles.horizontal]}>

          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }
    else if (this.props.repos.length !== 0) {

      return (

        <SafeAreaView style={styles.container}>
          <View style={{ flex: 1, backgroundColor: 'white' }}>
          {/* <Header
statusBarProps={{ barStyle: 'light-content' }}
  centerComponent={{ text: 'Proslinks', style: { color: '#fff' } }}
  containerStyle={{
    backgroundColor: color.primaryBackground,
    justifyContent: 'space-around',
    height:50,
    paddingTop:0
  }}
/> */}

            <View style={{ 
              flexDirection: 'row',
               borderBottomColor: '#535050',
               paddingBottom:0,
               marginBottom:0,
                borderBottomWidth: 0.2 }}>


              <SearchBar
                placeholder="skill, name, family"
                onChangeText={this.updateSearch}
                value={search}
                platform="android"
                containerStyle={{ margin: 3, width: '75%' }}
              />

              <Button
                iconLeft
                title="Filter"
                containerStyle={{ marginTop: 20,right:0,width:'20%',padding:0 }}
                type='outline'
                style={{padding:0}}
                onPress={() => this.Scrollable.open()}
                icon={
                  <Icon
                    type='material-community'
                    name="filter"
                    size={15}
                    color="#0464d2"
                  />
                }
              />

            </View>
            <View style={{ flex: 3,marginTop:0,paddingTop:0, }}>
              <FlatList
                data={this.props.repos}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
              />
            </View>
            <RBSheet
              ref={ref => {
                this.Scrollable = ref;
              }}
              closeOnDragDown
              customStyles={{
                container: {
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10
                }
              }}
              openDuration={500}
              closeDuration={400}
              closeOnDragDown={true}
              closeOnPressMask={true}

            >
              <ScrollView >

              <MultiSelect
                  items={this.props.skillsForFilter}
                  uniqueKey="skillId"
                  ref={(component) => { this.multiSelect = component }}
                  onSelectedItemsChange={this.onSelectedItemsChangeSkill}
                  selectedItems={selectedItemsSkill}
                  selectText="  Skills"
                  searchInputPlaceholderText="Skill Name"
                  // onChangeInput={(text) => console.log(text)}
                  altFontFamily="ProximaNova-Light"
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#CCC"
                  selectedItemTextColor="#CCC"
                  selectedItemIconColor="#CCC"
                  itemTextColor="#000"
                  displayKey="name"
                  searchInputStyle={{ color: '#CCC' }}
                  submitButtonColor="#CCC"
                  submitButtonText="Submit"
                 
                  hideSubmitButton={true}
                  styleDropdownMenuSubsection={{ borderWidth: 1, }}
                  
                />
{/* Price Button Filter */}
                <View style={{ marginBottom: 20 }}>
                  <ButtonGroup
                    onPress={this.updateIndex_Price}
                    selectedIndex={selectedIndex_Price}
                    buttons={buttons_Price}
                    containerStyle={{ height: 40, }}
                  />
                  <ButtonGroup
                    onPress={this.updateIndex_Experience}
                    selectedIndex={selectedIndex_Experience}
                    buttons={buttons_Experience}
                    containerStyle={{ height: 40 }}
                    containerStyle={{}}
                  />
                </View>
                <View style={{ marginBottom: 20 }}>
                  <MultiSelect
                    items={this.props.countriesForFilter}
                    uniqueKey="id"
                    ref={(component) => { this.multiSelect = component }}
                    onSelectedItemsChange={this.onSelectedItemsChangeCountry}
                    selectedItems={selectedItemsCountry}
                    selectText="  Countries"
                    searchInputPlaceholderText="Country Name"
                    // onChangeInput={(text) => console.log(text)}
                    altFontFamily="ProximaNova-Light"
                    tagRemoveIconColor="#CCC"
                    tagBorderColor="#CCC"
                    tagTextColor="#CCC"
                    selectedItemTextColor="#CCC"
                    selectedItemIconColor="#CCC"
                    itemTextColor="#000"
                    displayKey="name"
                    searchInputStyle={{ color: '#CCC' }}
                    submitButtonColor="#CCC"
                    submitButtonText="Submit"
                    hideDropdown={true}
                    hideSubmitButton={true}
                    styleDropdownMenuSubsection={{ borderWidth: 1, borderWidth: 1, }}
                 
                  />
                </View>
              </ScrollView>
            </RBSheet>

          </View>

        </SafeAreaView>
      );
    }
  }
}

//bind state variables to variables
function mapStateToProps(state) {
  return {
    repos: state.repos,
    skillsForFilter: state.skillsForFilter,
    countriesForFilter: state.countriesForFilter,
    activeRepo : state.activeRepo
  };
}

//bind actions to props actions
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getRepos: getRepos,
      getRepoThunk: getRepoThunk,
      repoSelected: repoSelected,
      getRepoSkillsForFilterThunk: getRepoSkillsForFilterThunk,
      getRepoSkillForFilter: getRepoSkillForFilter,
      getRepoCountryForFilter: getRepoCountryForFilter,
      getRepoCountriesForFilterThunk: getRepoCountriesForFilterThunk,
  
    }, dispatch)
}



export default connect(mapStateToProps, matchDispatchToProps)(CardList);