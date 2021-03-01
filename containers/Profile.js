import React, { Component } from 'react';
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
} from 'react-native';
import { Card,
      Icon,
    } from 'react-native-elements';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
  userLogined,
  userProfile,
} from '../redux/actions/index';
import Color from '../constants/color.js';
import Toast from 'react-native-easy-toast';
import DropDownPicker from 'react-native-dropdown-picker';
import { ProgressBar } from 'react-native-paper';
import ImagePicker from 'react-native-image-crop-picker';

class Profile extends Component {
  

    constructor(props) {
        super();
        this.state={
          editedProfile:undefined,
          countries:[],
          cities:[],
          countryId:undefined,
          country:undefined,
          cityId:undefined,
          city:undefined,
          loading:true,
        }
      }

      UNSAFE_componentWillMount() {
        this.resetData();
        this.getCountries();
      }

      notifyMessage(msg){ 
        this.toast.show(msg);
      }

      resetData(){
        if(this.props.profile!=null){
            this.setState({editedProfile:this.props.profile});
        }
      }
    
    
      componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.currentUser !== this.props.currentUser) {
          this.getProfile();
        }
    }

    getProfile(){
      this.setState({loading: true});
      fetch('http://44.240.53.177/api/idn/account/profile',
        {
          method: 'GET',
          headers: {
            'Authorization': ""+this.props.currentUser.accessToken+""
          }
        })
        .then(e => e.json())
        .then( (response) =>{
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
          this.setState({loading: false});
          this.resetData();
        }).catch((error) => {
          this.setState({loading: false});
          //console.log("profile error",error);
        }); 
    }



    getCountries(){
      this.setState({loading: true});
      fetch('http://44.240.53.177/api/pub/countries?page=1&size=300',
        {
          method: 'GET',
        })
        .then(e => e.json())
        .then((response)=> {
          //console.log(response);
          var tempCountries=[];
          response.forEach(country => {
            var newObject = {};
            newObject.label = country.name;
            newObject.value = ''+country.id;
            tempCountries.push(newObject);
          });
          this.setState({countries:tempCountries});
          this.setState({loading: false});
            if(this.props.profile.profile!=null && this.props.profile.profile.countryId){
                this.setState({countryId:''+this.props.profile.profile.countryId});
                this.setState({country:''+this.props.profile.profile.country});
                this.getCities(this.props.profile.profile.countryId,''+this.props.profile.profile.cityId);
            }
        }).catch((error) => {
          this.setState({loading: false});
        });
    }


    getCities(countId,defaultValue=null){
      this.setState({loading: true});
      fetch('http://44.240.53.177/api/pub/cities?page=1&size=300&countryId='+countId,
        {
          method: 'GET',
        })
        .then(e => e.json())
        .then((response)=> {
          var tempCities=[];
          response.forEach(city => {
            var newObject = {};
            newObject.label = city.name;
            newObject.value =''+ city.id;
            if(city.name!=undefined)
                tempCities.push(newObject);
          });
          //alert(tempCities[0].label);
          this.setState({cities:tempCities});
          var city = (defaultValue!=null)?this.props.profile.profile.city:tempCities[0]; 
          this.setState({city:city});
          var cityIdd = (defaultValue!=null)?defaultValue:tempCities[0].value;          
          this.setState({cityId:cityIdd});
          this.setState({loading: false});
        }).catch((error) => {
          this.setState({loading: false});
        });
    }

    getItemPercentage(itm) {
      let val = parseInt(itm.percent);
      return val/30;
  }

  uploadNewImage(){
      // ImagePicker.openPicker({
      //   width: 300,
      //   height: 400,
      //   cropping: true
      // }).then(image => {
      //   this.notifyMessage("image selected");
      // });

      
  }


  render() {
    if(!this.props.currentUser){
      return (
        <View style={{
          flex: 1, 
          alignItems: 'center',
          justifyContent: 'center',
      }}>
          <Text style={{marginLeft:20,marginRight:20,fontSize:15,textAlign:'center'}}>
          You are not logged in. Please log in and try again
          </Text>
          <TouchableOpacity style={styles.signinSignout} onPress={()=>this.props.navigation.navigate('SignInContainer')}>
                <Text style={styles.success}>Signin / Signup</Text>  
          </TouchableOpacity>
      </View>
      );
    }else if(this.props.currentUser && !this.state.editedProfile){
      return (
        <View style={[styles.container1, styles.horizontal]}>
          <ActivityIndicator size="large" color={Color.primary} />
        </View>
      );
    }else if(this.state.editedProfile
      && this.state.editedProfile.user
      && !this.state.editedProfile.user.emailConfirmed){
      return (
        <View style={{
          flex: 1, 
          alignItems: 'center',
          justifyContent: 'center',
      }}>
          <Text style={{marginLeft:20,marginRight:20,fontSize:15,textAlign:'center'}}>
          You are not confirmed your email,
           please confirm your email and try again
          </Text>
          <TouchableOpacity style={styles.signinSignout} onPress={()=>this.props.navigation.replace('ConfirmEmail')}>
                <Text style={styles.success}>Confirm Email</Text>  
          </TouchableOpacity>
      </View>
      );
    } else{
    return (
      <View>
      <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
            <TouchableOpacity onPress={()=>this.uploadNewImage()}>
              <Image style={styles.avatar}
                  source={(this.state.editedProfile.profile  &&  this.state.editedProfile.profile.image!==null)?
              { uri: 'http://44.240.53.177/files/' + this.state.editedProfile.profile.image } :
              { uri: 'https://bootdey.com/img/Content/avatar/avatar6.png' }}
               key={this.state.editedProfile.user.id}
              />
              </TouchableOpacity>

                <Text style={styles.name}>
                  {this.state.editedProfile.user.firstName} {this.state.editedProfile.user.lastName}
                </Text>
                <Text style={styles.userInfo}>{this.state.editedProfile.user.email}</Text>
                {this.state.editedProfile.profile.city&&
                  <Text style={styles.userInfo}>{this.state.editedProfile.profile.city.name}</Text>}
            </View>
          </View>

          <View style={styles.body}>

            
            <View style={styles.cardContainer}>
            <Card >
                <View>
                 <Text style={{textAlign:'center',marginBottom:10}}>USER INFORMATION</Text>
                </View>
                <Card.Divider/>

                <Text style={styles.lable}>First Name*</Text>
                <View style={styles.inputContainer} >
                  <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="First Name"
                    placeholderTextColor="grey"
                    multiline={false}
                    value={this.state.editedProfile.user.firstName}
                    onChangeText={value =>{
                    this.state.editedProfile.user.firstName=value;
                    this.setState({ editedProfile: this.state.editedProfile })}}
                  />
                </View>
                

                <Text style={styles.lable}>Last Name*</Text>
                <View style={styles.inputContainer} >
                  <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="Last Name"
                    placeholderTextColor="grey"
                    multiline={false}
                    value={this.state.editedProfile.user.lastName}
                    onChangeText={value =>{
                    this.state.editedProfile.user.lastName=value;
                    this.setState({ editedProfile: this.state.editedProfile })}}
                  />
                </View>               

                <Text style={styles.lable}>Language</Text>
                <View style={styles.inputContainer} >
                  <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="English,Spanish'"
                    placeholderTextColor="grey"
                    multiline={false}
                    value={this.state.editedProfile.user.language}
                    onChangeText={value =>{
                    this.state.editedProfile.user.language=value;
                    this.setState({ editedProfile: this.state.editedProfile })}}
                  />
                </View>
            </Card>
            </View>

            <View style={styles.cardContainer}>
            <Card >
                <View>
                 <Text style={{textAlign:'center',marginBottom:10}}>ADDRESS</Text>
                </View>
                <Card.Divider/>
              
                {this.state.countryId !=undefined&&
                  <View style={{zIndex:999}}>
                <Text style={styles.lable}>Country*</Text>
                <DropDownPicker
                  items={this.state.countries}
                  defaultValue={this.state.countryId}
                  containerStyle={{height: 40,marginLeft:10,marginTop:10,marginRight:10,zIndex:10000}}
                  style={{backgroundColor: '#fafafa',zIndex:10000}}
                  dropDownStyle={{backgroundColor: '#fafafa',zIndex:10000}}
                  onChangeItem={item => {
                    //console.log(item);
                    var id = item.value;
                    this.setState({cityId:undefined});
                    this.getCities(id);
                  }}
              />
              </View>
              }

              {this.state.cityId!=undefined &&
              <View style={{zIndex:10,marginBottom:10}}>
              <Text style={styles.lable,{marginTop:10}}>City*</Text>
                <DropDownPicker
                  items={this.state.cities}
                  defaultValue={this.state.cityId}
                  containerStyle={{height: 40,marginLeft:10,marginTop:10,marginRight:10,zIndex:10}}
                  style={{backgroundColor: '#fafafa',zIndex:10}}
                  dropDownStyle={{backgroundColor: '#fafafa',zIndex:10}}
                  onChangeItem={item => {
                    var id = item.value;
                    //this.setState({cityId:id});
                    console.log("city id",id);
                  }}
              />
              </View>
              }

               

              <Text style={styles.lable}>Zip Code</Text>
                <View style={styles.inputContainer} >
                  <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="Zip Code"
                    placeholderTextColor="grey"
                    multiline={false}
                    value={this.state.editedProfile.profile.zipCode}
                    onChangeText={value =>{
                    this.state.editedProfile.profile.zipCode=value;
                    this.setState({ editedProfile: this.state.editedProfile })}}
                  />
                </View>
            </Card>
            </View>



            <View style={styles.cardContainer}>
            <Card >
                <View>
                 <Text style={{textAlign:'center',marginBottom:10}}>CONTACT INFORMATION</Text>
                </View>
                <Card.Divider/>

                <Text style={styles.lable}>Email Address</Text>
                <View style={styles.inputContainer} >
                  <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="Email Address"
                    placeholderTextColor="grey"
                    multiline={false}
                    editable={false}
                    value={this.state.editedProfile.user.email}
                    onChangeText={value =>{
                    this.state.editedProfile.user.email=value;
                    this.setState({ editedProfile: this.state.editedProfile })}}
                  />
                </View>
               

                <Text style={styles.lable}>Tel(including country code)</Text>
                <View style={styles.inputContainer} >
                  <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="e.g. +1-541-754-3010"
                    placeholderTextColor="grey"
                    multiline={false}
                    value={this.state.editedProfile.user.mobile}
                  onChangeText={value =>{
                    this.state.editedProfile.user.mobile=value.replace(/[^0-9]/g, '');
                    this.setState({ editedProfile: this.state.editedProfile })}}
                  />
                </View>
                

                <Text style={styles.lable}>Linkedin</Text>
                <View style={styles.inputContainer} >
                  <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="Linkedin"
                    placeholderTextColor="grey"
                    multiline={false}
                    value={this.state.editedProfile.profile.linkedin}
                    onChangeText={value =>{
                    this.state.editedProfile.profile.linkedin=value;
                    this.setState({ editedProfile: this.state.editedProfile })}}
                  />
                </View>
                

                <Text style={styles.lable}>Website</Text>
                <View style={styles.inputContainer} >
                  <TextInput
                    style={styles.input}
                    underlineColorAndroid="transparent"
                    placeholder="Website"
                    placeholderTextColor="grey"
                    multiline={false}
                    value={this.state.editedProfile.profile.webSite}
                  onChangeText={value =>{
                    this.state.editedProfile.profile.webSite=value;
                    this.setState({ editedProfile: this.state.editedProfile })}}
                  />
                </View>
            </Card>
            </View>
          

            <View style={styles.cardContainer}> 
                <Card  titleStyle={{textAlign: 'left'}} title={
                    <View style={{display: "flex",flexDirection: "row"}}>
                        <Text>SKILLS</Text>
                        <View style={{flexGrow: 1}} />
                        <Icon 
                        name="add" 
                        onPress={()=>this.notifyMessage("Under Construction")}
                        color="#67c23a"/> 
                    </View>
                    }>
                    <Card.Divider/>
                    { this.state.editedProfile.skills.length>0&&
                      this.state.editedProfile.skills.map((skill, index) => (
                      <View key={index}
                      style={{flexDirection:'row',justifyContent: 'center',marginBottom:10}}>
                       <View style={{width:'80%'}}>
                          <Text style={{textAlign:'center',marginBottom:4,fontSize:14}}>
                          {skill.name}({skill.percent} years)
                          </Text>
                          <ProgressBar
                          progress={ this.getItemPercentage(skill) } 
                          color='#f5365c' />
                       </View>
                       <View style={{marginLeft:'auto',marginTop:9}}>
                         <Icon 
                          name="trash" 
                          type='font-awesome'
                          style={{ right: 0 }}
                          size={24} 
                          onPress={()=>this.notifyMessage("Under Construction")}
                          color="#f56c6c"/> 
                        </View>
                    </View>
                  ))
                  }
                    
                </Card>
            </View>

            <View style={styles.cardContainer}> 
                <Card  titleStyle={{textAlign: 'left'}} title={
                    <View style={{display: "flex",flexDirection: "row"}}>
                        <Text>Hourly Rate</Text>
                        <View style={{flexGrow: 1}} />
                        <Icon 
                        name="add" 
                        onPress={()=>this.notifyMessage("Under Construction")}
                        color="#67c23a"/> 
                    </View>
                    }>
                    <Card.Divider/>
                  {
                      this.state.editedProfile.hourRates.length>0&&
                      <View style={{flex:5,flexDirection:'row'}}>
                        <Text style={{flex:3,textAlign:'left',marginTop:5}}>
                          {this.state.editedProfile.hourRates[0].amount} {this.state.editedProfile.hourRates[0].currency}
                        </Text>
                        <View style={{marginLeft:'auto'}}>
                         <Icon 
                          name="trash" 
                          type='font-awesome'
                          style={{ right: 0 }}
                          size={24} 
                          onPress={()=>this.notifyMessage("Under Construction")}
                          color="#f56c6c"/> 
                        </View>
                      </View>
                  }
                </Card>
            </View>

            <View style={styles.cardContainer}> 
                <Card  titleStyle={{textAlign: 'left'}} title={
                    <View style={{display: "flex",flexDirection: "row"}}>
                        <Text>Experience</Text>
                        <View style={{flexGrow: 1}} />
                        <Icon 
                        name="add" 
                        onPress={()=>this.notifyMessage("Under Construction")}
                        color="#67c23a"/> 
                    </View>
                    }>
                    <Card.Divider/>
                    { this.state.editedProfile.experiments.length>0&&
                      this.state.editedProfile.experiments.map((experiment, index) => (
                      <View key={index}
                      style={{flexDirection:'row',justifyContent: 'center',marginBottom:13}}>
                       <View style={{width:'80%'}}>
                          <Text style={{textAlign:'left',marginBottom:4,fontSize:14}}>
                          {experiment.start.split('T')[0] +" - "+experiment.end.split('T')[0]}
                          </Text>
                          <Text style={{textAlign:'left',marginBottom:4,fontSize:14}}>
                          {experiment.workplace}
                          </Text>
                       </View>
                       <View style={{marginLeft:'auto',marginTop:5}}>
                         <Icon 
                          name="trash" 
                          type='font-awesome'
                          style={{ right: 0 }}
                          size={24} 
                          onPress={()=>this.notifyMessage("Under Construction")}
                          color="#f56c6c"/> 
                        </View>
                    </View>
                  ))
                  }
                </Card>
            </View>

            <View style={styles.cardContainer}> 
                <Card  titleStyle={{textAlign: 'left'}} title={
                    <View style={{display: "flex",flexDirection: "row"}}>
                        <Text>Educations</Text>
                        <View style={{flexGrow: 1}} />
                        <Icon 
                        name="add" 
                        onPress={()=>this.notifyMessage("Under Construction")}
                        color="#67c23a"/> 
                    </View>
                    }>
                    <Card.Divider/>
                    { this.state.editedProfile.educations.length>0&&
                      this.state.editedProfile.educations.map((education, index) => (
                      <View key={index}
                      style={{flexDirection:'row',justifyContent: 'center',marginBottom:13}}>
                       <View style={{width:'80%'}}>
                          <Text style={{textAlign:'left',marginBottom:4,fontSize:14}}>
                          {education.entering.split('T')[0] +" - "+education.departure.split('T')[0]}
                          </Text>
                          <Text style={{textAlign:'left',marginBottom:4,fontSize:14}}>
                          {education.university}
                          </Text>
                       </View>
                       <View style={{marginLeft:'auto',marginTop:5}}>
                         <Icon 
                          name="trash" 
                          type='font-awesome'
                          style={{ right: 0 }}
                          size={24} 
                          onPress={()=>this.notifyMessage("Under Construction")}
                          color="#f56c6c"/> 
                        </View>
                    </View>
                  ))
                  }
                </Card>
            </View>


            <View style={styles.cardContainer}>
            <Card >
                <View>
                 <Text style={{textAlign:'center',marginBottom:10}}>ABOUT ME</Text>
                </View>
                <Card.Divider/>
                   
                <View style={styles.textAreaContainer} >
                  <TextInput
                    style={styles.textArea}
                    underlineColorAndroid="transparent"
                    placeholder="A few lines about me"
                    placeholderTextColor="grey"
                    numberOfLines={4}
                    multiline={true}
                    value={this.state.editedProfile.profile.bio}
                    onChangeText={value =>{
                    this.state.editedProfile.profile.bio=value;
                    this.setState({ editedProfile: this.state.editedProfile })}}
                  />
                </View>
            </Card>

              <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.saveButton}>
                    <Text style={styles.success}>Save</Text>  
                  </TouchableOpacity> 
                  <TouchableOpacity style={styles.cancelButton}>
                    <Text style={styles.danger}>Cancel</Text> 
                  </TouchableOpacity>
               </View>

            </View>
          </View>
          
      </ScrollView>
      <Toast
                    ref={(toast) => this.toast = toast}
                    style={{backgroundColor:Color.primaryBackground}}
                    position='center'
                    positionValue={200}
                    fadeInDuration={750}
                    fadeOutDuration={1200}
                    opacity={0.9}
            />
      {this.state.loading &&
              <View style={styles.loading}>
              <ActivityIndicator size="large" color={Color.primary} />
              </View>
           }
       </View>
    );
    }
  }
}

const styles = StyleSheet.create({
  header:{
    backgroundColor: Color.primaryBackground,
  },
  headerContent:{
    paddingTop:40,
    paddingBottom:15,
    alignItems: 'center',
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: "white",
    marginBottom:10,
  },
  name:{
    fontSize:22,
    color:"#FFF",
    fontWeight:'600',
  },
  userInfo:{
    fontSize:16,
    color:"#FFF",
    fontWeight:'600',
  },
  body:{
    backgroundColor: Color.pageBackground,
    height:'100%',
    width:'100%',
    paddingLeft:15,
    paddingRight:15,
    paddingBottom:20,
    alignItems:'center',
  },
  cardContainer:{
     width:'100%'
  },
  item:{
    flexDirection : 'row',
  },
  infoContent:{
    flex:1,
    alignItems:'flex-start',
    paddingLeft:5
  },
  iconContent:{
    flex:1,
    alignItems:'flex-end',
    paddingRight:5,
  },
  icon:{
    width:30,
    height:30,
    marginTop:20,
  },
  info:{
    fontSize:18,
    marginTop:20,
    color: "#FFFFFF",
  },
  buttonContainer: {
    marginTop:10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signinSignout: {
    marginTop:30,
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:20,
    width:200,
    borderRadius:30,
    backgroundColor: Color.primaryBackground,
  },
    saveButton: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:100,
    marginRight:20,
    borderRadius:30,
    backgroundColor: "#67c23a",
  },
  cancelButton: {
    height:45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:100,
    borderRadius:30,
    backgroundColor: "#f56c6c",
  },
  success:{
     color:'white'
  },
    danger:{
     color:'white'
    },
    lable:{
     fontSize:15
    },
    textAreaContainer: {
      borderColor: '#ccc',
      borderWidth: 1,
      padding: 5
    },
    textArea: {
      height: 150,
      justifyContent: "flex-start"
    },
    inputContainer: {
    marginTop:10,
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius:15,
    paddingLeft:5,
    borderBottomWidth: 1,
    height:45,
    marginBottom:20,
    flexDirection: 'row',
    alignItems:'center',

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
      borderBottomColor: '#FFFFFF',
      flex:1,
    },
    loading: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    }
});


//bind state variables to variables
function mapStateToProps(state) {
    return {
      currentUser : state.currentUser,
      profile:state.profile,
    };
  }
  
  //bind actions to props actions
  function matchDispatchToProps(dispatch) {
    return bindActionCreators(
      {
        userLogined: userLogined,
        userProfile:userProfile,
      }, dispatch)
  }

  export default connect(mapStateToProps, matchDispatchToProps)(Profile);
