import React from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Dimensions,
  
} from 'react-native';
import AppIntroSlider from 'react-native-app-intro-slider';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Actions } from 'react-native-router-flux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Color from '../constants/color.js'

const data = [
  {
    title: 'We are here for help',
    text: 'What skills are you looking for?',
    image: require('../assets/b.png'),
    bg: '#5f4def',
  },
  {
    title: 'Build Your Profile Competitive',
    text: "Whatever you do, it doesn't matter how skilled you are. It's all about what those skills can satisfy the client",
    image: require('../assets/a.png'),
    bg: '#5f4def',
  },
  {
    title: 'Get In Touch',
    text: 'we are here to help and answer any question you might have',
    image: require('../assets/c.png'),
    bg: '#5f4def',
  },
 
];

type Item = typeof data[0];

const styles = StyleSheet.create({
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'blue',
  },
  image: {
    width: 320,
    height: 320,
    marginVertical: 32,
  },
  text: {
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    color: 'white',
    textAlign: 'center',
    fontWeight:'bold',
    fontFamily:'roboto'
  },
  paginationContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
  },
  paginationDots: {
    height: 16,
    margin: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginHorizontal: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginHorizontal: 24,
  },
  button: {
    flex: 1,
    paddingVertical: 7,
    marginHorizontal: 4,
    borderRadius: 4,
    backgroundColor: '#1cb278',
  },
  buttonText: {
    color: '#5f4def',
    fontWeight: '700',
    textAlign: 'center',
  },
  buttonCircle: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, .2)',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
interface Props {
  navigation: any
}
export default class ProslinkSlider extends React.Component {

 
  constructor(props) {
    super(props);
    
    this.state = {
      showRealApp: false
    }
   
  }
   storeData = async (value) => {
    try {
      await AsyncStorage.setItem('@storage_Key', value)
    } catch (e) {
      // saving error
    }
  }
   getData = async () => {
     //TODO,varse
    // try {
    //   const value = await AsyncStorage.getItem('@storage_Key')
    //   if(value !== null) {
    //     // value previously stored
    //     //alert(value)
    //     //if(value == 'erfan')
    //     //this.setState({ showRealApp: true });
    //   }
    // } catch(e) {
    //   // error reading value
    // }
  }
  slider: AppIntroSlider | undefined;
  
  
  _renderItem = ({ item }: { item: Item }) => {
    var {width} = Dimensions.get('window');
    return (
      <View
        style={[
          styles.slide,
          {
            backgroundColor: item.bg,
          },
        ]}>
        <Text style={styles.title}>{item.title}</Text>
        <Image source={item.image} style={{width:width/1.5,height:width/1.5}} />
        {/* style={styles.image} */}
        <Text style={styles.text}>{item.text}</Text>
      </View>
    );
  };

  _keyExtractor = (item: Item) => item.title;

  _renderPagination = (activeIndex: number) => {
   
    return (

      <View style={styles.paginationContainer}>
    
        <SafeAreaView>
          <View style={styles.paginationDots}>
            {data.length > 1 &&
              data.map((_, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.dot,
                    i === activeIndex
                      ? { backgroundColor: 'white' }
                      : { backgroundColor: 'rgba(0, 0, 0, .2)' },
                  ]}
                  onPress={() => this.slider?.goToSlide(i, true)}
                />
              ))}
          </View>
          <View style={styles.buttonContainer}>
            {/* <TouchableOpacity
              style={[styles.button, { backgroundColor: '#f3f7fd' }]}  onPress={() => {  this.state = { initRoute: 'Login' };this.props.navigation.navigate('Authentication',{initRoute:'Login'})}} >
              <Text style={styles.buttonText}>Log in</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button,{ backgroundColor: '#f3f7fd' }]}  onPress={() => {this.state = { initRoute: 'Register' };this.props.navigation.navigate('Authentication',{initRoute:'Register'})}} >
              <Text style={styles.buttonText}>Sign up</Text>
            </TouchableOpacity> */}
    
            <TouchableOpacity style={[styles.button, { backgroundColor: '#f3f7fd' }]}  onPress={() =>this.Done() }>
            
              <Text style={styles.buttonText}>Skip</Text>
            </TouchableOpacity> 

           
          </View>
        </SafeAreaView>
      </View>
       
    );
  };

  Done ()  {
   this.storeData('erfan');
   this.props.navigation.navigate('Home')//Home
  }

  render() {
    this.getData();
    if(this.state.showRealApp){
       this.props.navigation.navigate('Home')//Home
    }
    return (
        //  <StatusBar translucent backgroundColor="transparent" />
        <AppIntroSlider
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          renderPagination={this._renderPagination}
          data={data}
          ref={(ref) => (this.slider = ref!)}
        /> 
    );
  }
}
