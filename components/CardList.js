import React, { Component } from "react";
import {
  SafeAreaView,
  Image,
  StyleSheet,
  ImageBackground,
  FlatList,
  View,
  StatusBar,
  Text,
  List,
  ActivityIndicator,
  Dimensions,
  TouchableNativeFeedback,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  Card,
  ListItem,
  Avatar,
  Input,
  Badge,
  Button,
  Icon,
  CheckBox,
  ButtonGroup,
  Header,
  SearchBar,
} from "react-native-elements";
import { Rating, AirbnbRating } from "react-native-ratings";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Actions } from "react-native-router-flux";
import {
  getUsers,
  userLogined,
  getRepoSkillForFilter,
  getRepoSkillsForFilterThunk,
  getRepoCountriesForFilterThunk,
  getRepoCountryForFilter,
} from "../redux/actions/index";
import { RadioButton, TouchableRipple, Colors } from "react-native-paper";
import RBSheet from "react-native-raw-bottom-sheet";
import BottomSheet from "react-native-simple-bottom-sheet";
//import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import MultiSelect from "react-native-multiple-select";
import UserCard from "./UserCard";
import color from "../constants/color";

const buttons_Price = ["Price Up", "Price Down"];
const buttons_Experience = ["Experience Up", "Experience Down"];

class CardList extends Component {
  UNSAFE_componentWillMount() {
    this.getUsersThunk();
    this.props.getRepoSkillsForFilterThunk();
    this.props.getRepoCountriesForFilterThunk();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.currentUser !== this.props.currentUser) {
      this.setState({ search: "" });
      this.state.search = "";
      this.resetPaginationParams();
      //if(this.props.currentUser){
      this.getUsersThunk();
      //}
    }
  }

  constructor(props) {
    super();
    this.state = {
      value: "second",
      selectedIndex_Price: 0,
      selectedIndex_Experience: 2,
      search: "",
      experiseOrPrice: "priceAvg",
      currentPage: 1,
      pageSize: 3,
      pageCount: 10,
      users: [],
      loading: true,
    };

    this.changeState = this.changeState.bind(this);
    this.updateIndex_Price = this.updateIndex_Price.bind(this);
    this.updateIndex_Experience = this.updateIndex_Experience.bind(this);
  }

  resetPaginationParams() {
    this.setState({ currentPage: 1 });
    this.state.currentPage = 1;
    this.setState({ pageSize: 3 });
    this.state.pageSize = 3;
    this.setState({ pageCount: 10 });
    this.state.pageCount = 10;
    this.setState({ users: [] });
    this.state.users = [];
  }

  convertPramstoUrlString(params) {
    return Object.keys(params)
      .map(function (key) {
        return key + "=" + params[key];
      })
      .join("&");
  }

  getUsersThunk() {
    this.setState({ loading: true });

    let sortType = "ASCENDING";

    if (
      this.state.selectedIndex_Experience == 1 ||
      this.state.selectedIndex_Price == 1
    ) {
      sortType = "DESCENDING";
    }

    var params = {};
    if (this.state.currentPage) params.page = this.state.currentPage;
    if (this.state.pageSize) params.size = this.state.pageSize;
    if (this.state.selectedItemsSkill && this.state.selectedItemsSkill > 0)
      params.skillIds = this.state.selectedItemsSkill;
    if (this.state.selectedItemsCountry && this.state.selectedItemsCountry > 0)
      params.countryIds = this.state.selectedItemsCountry;
    if (this.state.experiseOrPrice)
      params["sort[0].column"] = this.state.experiseOrPrice;
    if (sortType) params["sort[0].type"] = sortType;
    params.term = this.state.search;

    console.log("search params", params);

    //console.log("params",this.convertPramstoUrlString(params));
    var token = this.props.currentUser?.accessToken
      ? this.props.currentUser?.accessToken
      : "";

    fetch(
      "http://44.240.53.177/api/pub/users/search?" +
        this.convertPramstoUrlString(params),
      {
        method: "GET",
        headers: {
          Authorization: "" + token + "",
        },
      }
    )
      .then((e) => e.json())
      .then((response) => {
        this.setState({ users: this.state.users.concat(response) });
        this.setState({ loading: false });
        this.calculatePageCount(params);
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  }

  calculatePageCount(params) {
    var countparams = JSON.stringify(params);
    countparams = JSON.parse(countparams);
    delete countparams.page;
    delete countparams.size;

    //console.log("count params",this.convertPramstoUrlString(countparams));

    var token = this.props.currentUser?.accessToken
      ? this.props.currentUser?.accessToken
      : "";
    //console.log("token",token);

    fetch(
      "http://44.240.53.177/api/pub/users/search/count?" +
        this.convertPramstoUrlString(countparams),
      {
        method: "GET",
        headers: {
          Authorization: "" + token + "",
        },
      }
    )
      .then((e) => e.json())
      .then((res) => {
        var pageCount = Math.floor(
          (res + this.state.pageSize - 1) / this.state.pageSize
        );
        this.setState({ pageCount: pageCount });
      })
      .catch((error) => {
        //console.log("error",error);
        this.setState({ pageCount: 1 });
      });
  }

  loadMore() {
    if (this.state.currentPage >= this.state.pageCount) {
      console.log("reach end");
      return;
    }

    var pageNumUpdater = new Promise((resolve, reject) => {
      var newPageNum = this.state.currentPage + 1;
      //console.log("update page num",newPageNum);
      this.setState({ currentPage: newPageNum });
      resolve();
    });
    pageNumUpdater
      .then((result) => {
        //console.log("load more called",this.state.currentPage);
        this.getUsersThunk();
      })
      .catch((error) => {
        //console.log("error",error);
      });
  }

  onSelectedItemsChangeSkill = (selectedItemsSkill) => {
    this.state.selectedItemsSkill = selectedItemsSkill;
    //@@@@@@@@@@@@
    this.resetPaginationParams();
    this.Scrollable.close();
    this.getUsersThunk();
  };
  onSelectedItemsChangeCountry = (selectedItemsCountry) => {
    this.state.selectedItemsCountry = selectedItemsCountry;
    //@@@@@@@@@@@
    this.resetPaginationParams();
    this.Scrollable.close();
    this.getUsersThunk();
  };
  changeState(value) {
    this.setState({ value: value });
  }
  updateIndex_Price(selectedIndex_Price) {
    this.state.selectedIndex_Price = selectedIndex_Price;
    this.state.selectedIndex_Experience = 2;
    this.state.experiseOrPrice = "priceAvg";
    this.resetPaginationParams();
    //@@@@@@@@@@@
    this.Scrollable.close();
    this.getUsersThunk();
  }
  updateIndex_Experience(selectedIndex_Experience) {
    console.log("selected experience", selectedIndex_Experience);
    this.state.selectedIndex_Experience = selectedIndex_Experience;
    this.state.selectedIndex_Price = 2;
    this.state.experiseOrPrice = "experimentAvg";
    this.resetPaginationParams();
    //@@@@@@@@@@@
    this.Scrollable.close();
    this.getUsersThunk();
  }

  applySearch = () => {
    this.resetPaginationParams();
    //@@@@@@@@@@@@@@
    this.Scrollable.close();
    this.getUsersThunk();
  };

  isEmpty(str) {
    return !str || 0 === str.length || !str.trim();
  }

  render() {
    const dimensions = Dimensions.get("window");
    const AvatarWidth = dimensions.width / 2;
    const { selectedIndex_Price } = this.state;
    const { selectedIndex_Experience } = this.state;
    const { search } = this.state;
    const { selectedItemsSkill } = this.state;
    const { selectedItemsCountry } = this.state;

    const renderItem = ({ item }) => (
      // <Item title={item.firstName} />
      <UserCard
        user={item}
        currentUser={this.props.currentUser}
        navigation={this.props.navigation}
      />
    );

    // if (!this.state.loading && this.state.users.length == 0) {
    //   return (
    //     <View
    //       style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    //     >
    //       <Text>No Users Found</Text>
    //       {this.state.loading && (
    //         <View style={styles.loading}>
    //           <ActivityIndicator size="large" color={color.primary} />
    //         </View>
    //       )}
    //     </View>
    //   );
    // } else {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <View
            style={{
              flexDirection: "row",
              borderBottomColor: "#535050",
              paddingBottom: 0,
              marginBottom: 0,
              borderBottomWidth: 0.2,
            }}
          >
            <SearchBar
              placeholder="skill, name, family"
              onChangeText={(text) => {
                this.setState({ search: text });
                this.state.search = "";
                if (this.isEmpty(text)) {
                  console.log("search param", this.state.search);
                  this.applySearch();
                }
              }}
              value={search}
              disabled={this.state.loading}
              platform="android"
              containerStyle={{ margin: 3, width: "55%" }}
            />

            <Button
              iconLeft
              title="Filter"
              containerStyle={{
                marginTop: 20,
                right: 0,
                marginRight: 10,
                width: "18%",
                padding: 0,
              }}
              type="outline"
              style={{ padding: 0 }}
              onPress={() => this.Scrollable.open()}
              icon={
                <Icon
                  type="material-community"
                  name="filter"
                  size={15}
                  color="#0464d2"
                />
              }
            />

            <Button
              iconLeft
              title="Apply"
              containerStyle={{
                marginTop: 20,
                right: 0,
                width: "18%",
                padding: 0,
              }}
              type="outline"
              style={{ padding: 0 }}
              onPress={() => this.applySearch()}
              icon={
                <Icon
                  type="material-community"
                  name="gesture-tap"
                  size={15}
                  color="#0464d2"
                />
              }
            />
          </View>
          <View style={{ flex: 3, marginTop: 0, paddingTop: 0 }}>
            <FlatList
              data={this.state.users}
              renderItem={renderItem}
              //onEndReached={this.loadMore()}
              onEndThreshold={0}
              onEndReached={() => (this.callOnScrollEnd = true)}
              onMomentumScrollEnd={() => {
                this.callOnScrollEnd && this.loadMore();
                this.callOnScrollEnd = false;
              }}
              keyExtractor={(item, index) => index}
            />
          </View>
          <View></View>
          <RBSheet
            ref={(ref) => {
              this.Scrollable = ref;
            }}
            closeOnDragDown
            customStyles={{
              container: {
                borderTopLeftRadius: 10,
                borderTopRightRadius: 10,
              },
            }}
            openDuration={500}
            closeDuration={400}
            closeOnDragDown={true}
            closeOnPressMask={true}
          >
            <ScrollView>
              <MultiSelect
                items={this.props.skillsForFilter}
                uniqueKey="skillId"
                ref={(component) => {
                  this.multiSelect = component;
                }}
                onSelectedItemsChange={this.onSelectedItemsChangeSkill}
                selectedItems={selectedItemsSkill}
                selectText="  Skills"
                searchInputPlaceholderText="Skill Name"
                // onChangeInput={(text) => console.log(text)}
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#CCC"
                selectedItemIconColor="#CCC"
                itemTextColor="#000"
                displayKey="name"
                searchInputStyle={{ color: "#CCC" }}
                submitButtonColor="#CCC"
                submitButtonText="Submit"
                hideSubmitButton={true}
                styleDropdownMenuSubsection={{ borderWidth: 1 }}
              />
              {/* Price Button Filter */}
              <View style={{ marginBottom: 20 }}>
                <MultiSelect
                  items={this.props.countriesForFilter}
                  uniqueKey="id"
                  ref={(component) => {
                    this.multiSelect = component;
                  }}
                  onSelectedItemsChange={this.onSelectedItemsChangeCountry}
                  selectedItems={selectedItemsCountry}
                  selectText="  Countries"
                  searchInputPlaceholderText="Country Name"
                  // onChangeInput={(text) => console.log(text)}
                  tagRemoveIconColor="#CCC"
                  tagBorderColor="#CCC"
                  tagTextColor="#CCC"
                  selectedItemTextColor="#CCC"
                  selectedItemIconColor="#CCC"
                  itemTextColor="#000"
                  displayKey="name"
                  searchInputStyle={{ color: "#CCC" }}
                  submitButtonColor="#CCC"
                  submitButtonText="Submit"
                  hideDropdown={true}
                  hideSubmitButton={true}
                  styleDropdownMenuSubsection={{
                    borderWidth: 1,
                    borderWidth: 1,
                  }}
                />
              </View>
              <View style={{ marginBottom: 20, paddingBottom: 20 }}>
                <ButtonGroup
                  onPress={this.updateIndex_Price}
                  selectedIndex={selectedIndex_Price}
                  buttons={buttons_Price}
                  containerStyle={{ height: 40 }}
                />
                <ButtonGroup
                  onPress={this.updateIndex_Experience}
                  selectedIndex={selectedIndex_Experience}
                  buttons={buttons_Experience}
                  containerStyle={{ height: 40 }}
                  containerStyle={{}}
                />
              </View>
            </ScrollView>
          </RBSheet>
        </View>
        {this.state.loading && (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color={color.primary} />
          </View>
        )}
      </SafeAreaView>
    );
    // }
  }
}

//bind state variables to variables
function mapStateToProps(state) {
  return {
    users: state.users,
    skillsForFilter: state.skillsForFilter,
    countriesForFilter: state.countriesForFilter,
    currentUser: state.currentUser,
  };
}

//bind actions to props actions
function matchDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      getUsers: getUsers,
      userLogined: userLogined,
      getRepoSkillsForFilterThunk: getRepoSkillsForFilterThunk,
      getRepoSkillForFilter: getRepoSkillForFilter,
      getRepoCountryForFilter: getRepoCountryForFilter,
      getRepoCountriesForFilterThunk: getRepoCountriesForFilterThunk,
    },
    dispatch
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: StatusBar.currentHeight || 0,
  },
  container1: {
    flex: 1,
    justifyContent: "center",
  },
  horizontal: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
  myRadio: {
    paddingLeft: 6,
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 3,
    backgroundColor: "white",
    height: 55,
    elevation: 5,
    borderRadius: 4,

    borderColor: "#fe48d1",
    borderWidth: 0.2,
  },
  myRadioPress: {
    paddingLeft: 6,
    alignItems: "center",
    flexDirection: "row",
    marginBottom: 3,
    backgroundColor: "white",
    height: 55,
    elevation: 5,
    borderRadius: 4,
    borderColor: "white",
    borderWidth: 0,
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

export default connect(mapStateToProps, matchDispatchToProps)(CardList);
