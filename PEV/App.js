import * as React from 'react';
import { Text, View, StyleSheet, Image, Slider, PanResponder, Animated, Dimension, Button, Alert,TouchableOpacity, ScrollView} from 'react-native';
import { Constants } from 'expo';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Svg,{Line,Polyline,Path} from 'react-native-svg';


class AppScreen extends React.Component {

  constructor(props) {
   super(props);
   this.state = { 
     value: 0,

    //X Coordiantes of both lines
     x1: 0,
     x2: 600,

    //Y Coordiantes of both lines
     y1: 300,
     y2: 300,
    //X and Y coordinates of the proton
     px: 0,
     py: 0,

    //X and Y coordinates of the electron
     ex: 1,
     ey: 0,

    //X Coordinates of the two Arcs
     arch: 210,
     arch2: 210,
    }


   //Pan Handler Set Up for gesture tracking of both the proton and the electron
   this._panResponder = {};
   this._panResponder2 = {};
  
   //Proton pan handler
   this._previousLeftP = 0;
   this._previousTopP = 0;
   this._protonStyles = {};
   this.proton = null;

   //Electron pan handler
   this._previousLeftE = 0;
   this._previousTopE = 0;
   this._electronStyles = {};
   this.electron = null;

  }

  //Initial functions setting up the pan handlers
  componentWillMount() {
    this._panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
      onPanResponderGrant: this._handlePanResponderGrant,
      onPanResponderMove: this._handlePanResponderMove,
      onPanResponderRelease: this._handlePanResponderEnd,
      onPanResponderTerminate: this._handlePanResponderEnd,
    });
    this._panResponder2 = PanResponder.create({
      onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder2,
      onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder2,
      onPanResponderGrant: this._handlePanResponderGrant2,
      onPanResponderMove: this._handlePanResponderMove2,
      onPanResponderRelease: this._handlePanResponderEnd2,
      onPanResponderTerminate: this._handlePanResponderEnd2,
    });
    
    //Proton manipulation
    this._previousLeftP = 0;
    this._previousTopP = 0;
    this._protonStyles = {
      style: {
        left: this._previousLeftP,
        top: this._previousTopP,
        backgroundColor: '#EF7A1A',
      }
    };

    //Electron manipulation
    this._previousLeftE = 0;
    this._previousTopE = 0;
    this._electronStyles = {
      style: {
        left: this._previousLeftE,
        top: this._previousTopE,
        backgroundColor: '#97A2E7',
      }
    }
  } 


  //Resposnsible for tracking the movements of the proton
  _handlePanResponderMove = (e, gestureState) => {
    this._protonStyles.style.left = this._previousLeftP + gestureState.dx;
    this._protonStyles.style.top = this._previousTopP + gestureState.dy;

    this.setState({
      px: this._protonStyles.style.left,
      py: this._protonStyles.style.top,
    })

    //Updates the state with new coordinates
    this._updateState(1);
    this._updateNativeStyles();
  }

  //Resposnsible for tracking the movements of the electron
  _handlePanResponderMove2 = (e, gestureState) => {
    this._electronStyles.style.left = this._previousLeftE + gestureState.dx;
    this._electronStyles.style.top = this._previousTopE + gestureState.dy;

    this.setState({
      ex: this._electronStyles.style.left,
      ey: this._electronStyles.style.top,
    })

    //Updates the state with new coordinates    
    this._updateState(2);
    this._updateNativeStyles2();
  }

  //Unhighlights the current particle
  _handlePanResponderEnd = (e, gestureState) => {
    this._unHighlight();
    this._previousLeftP += gestureState.dx;
    this._previousTopP += gestureState.dy;
  }

  //Unhighlights the current particle
  _handlePanResponderEnd2 = (e, gestureState) => {
    this._unHighlight2();
    this._previousLeftE += gestureState.dx;
    this._previousTopE += gestureState.dy;
  }

  //Updates the state of the coordiantes for the line to be drawn
  _updateState(num){
    if(num==1){
      this.setState({
        x1: this.state.px-10,
        y1: this.state.py+300,
      })
    }
    if (num==2){
      this.setState({
        x2: this.state.ex+310,
        y2: this.state.ey+300, 
      })

    }
  }

  //Creates thhe state into a string that can be used for line creation
  _stateToString(num){
    if(num==1){
      var str = "M"+this.state.x1 +","+this.state.y1+" Q"+this.state.arch+",0 " +this.state.x2+","+this.state.y2 +" Z";
      return str
    }
    if(num==2){
      var str1 = "M"+this.state.x1 +","+this.state.y1+" Q"+this.state.arch2+",600 " +this.state.x2+","+this.state.y2 +" Z";
      return str1
    }
  }

  //Updates the state based on the sliders value
  _sliderChange(value){
    this.setState({
      value: value,
      arch: 100 + (value*30),
      arch2: 100 + (value*30),
    })
    
  }

  render() {
    return (
      
      //Container
      <View style={styles.container}>

        //First Row
        <View style={styles.firstrow}>

          //Middle Column
          <View style={styles.secondcol}>
            <Text style={styles.bigText}>Phsyics Electron Viewer</Text>
          </View>
        </View>

        //Second Row
        <View style={styles.secondrow}>

            //The Proton
            <View style={styles.proton}
              ref={(proton) => {
              this.proton = proton;
              }}
              {...this._panResponder.panHandlers }
            />
            
            //The two field lines between the particles
            <Svg height='600' width='300' xmlns="http://www.w3.org/2000/svg">
              <Path d={this._stateToString(1)} stroke="#FFFC56" strokeWidth='5' fill="#111110" />
              <Path d={this._stateToString(2)} stroke="#FFFC56" strokeWidth='5' fill="#111110"/>
            </Svg>
            
            //The Electron
            <View style={styles.electron}
              ref={(electron) => {
              this.electron = electron;
              }}
              {...this._panResponder2.panHandlers }
            />
        </View>

        //Third Row
        <View style={styles.thirdrow}>

          //First Column
          <View style={styles.firstcol}>
            <Text style={styles.sliderText}>-10</Text>
          </View>
          
          //Second Column
          <View style={styles.secondcol}>

            //Dynamic Slider used to update the arcs
            <Slider 
              style={styles.slider}
              step={1}
              minimumValue={-10}
              maximumValue={10} 
              value={this.state.value} 
              onValueChange={(value) => this._sliderChange(value)}
            />
          </View>

          //Third Column
          <View style={styles.thirdcol}>
            <Text style={styles.sliderText}>10</Text> 
          </View>
        </View>

        //Fourth Row
        <View style={styles.fourthrow}>
          <Text style={styles.selectText}>Please select a charge</Text>
          <Text style={styles.selectText}>Value: {this.state.value}</Text>    
        </View>
      </View>
      
    );
  }


  //Needed functions for pan handlers
  componentDidMount() {
    this._updateNativeStyles();
  }
  //Needed functions for pan handlers
  componentDidMount2() {
    this._updateNativeStyles2();
  }
  //Highlighting the particle gestured
  _highlight = () => {
    this._protonStyles.style.backgroundColor = '#EF7A1A';
    this._updateNativeStyles();
  }
  //Highlighting the particle gestured
  _highlight2 = () => {
    this._electronStyles.style.backgroundColor = '#97A2E7';
    this._updateNativeStyles2();
  }
  //Unhighlighting the particle gestured
  _unHighlight = () => {
    this._protonStyles.style.backgroundColor = '#EF7A1A';
    this._updateNativeStyles();
  }
  //Unhighlighting the particle gestured
  _unHighlight2 = () => {
    this._electronStyles.style.backgroundColor = '#97A2E7';
    this._updateNativeStyles2();
  }
  //Updating the protons style
  _updateNativeStyles() {
    this.proton && this.proton.setNativeProps(this._protonStyles);
  }
  //Updating the electrons style
  _updateNativeStyles2() {
    this.electron && this.electron.setNativeProps(this._electronStyles);
  }
  //Needed functions for pan handlers
  _handleStartShouldSetPanResponder() {
    return true;
  }
  //Needed functions for pan handlers
  _handleStartShouldSetPanResponder2() {
    return true;
  }
  //Needed functions for pan handlers
  _handleMoveShouldSetPanResponder() {
    return true;
  }
  //Needed functions for pan handlers
  _handleMoveShouldSetPanResponder2() {
    return true;
  }
  //Needed functions for pan handlers
  _handlePanResponderGrant = (e, gestureState) => {
    this._highlight();
  }
  //Needed functions for pan handlers
  _handlePanResponderGrant2 = (e, gestureState) => {
    this._highlight2();
  }
  
}

class SplashScreen extends React.Component{
  render(){
    return(
      <View style={styles.containerSplash}>
        //Image splash screen
        <Image style={{height: 500, width: 500, marginBottom: 100}} source={require('./assets/img/splash2.png')}/> 
      </View>
    );
  }
}

const TabNavigator = createBottomTabNavigator(
  //Two Screens, Home and the PEV
  {
  Home: SplashScreen,
  PEV: AppScreen,
  },
  {
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = `ios-home${focused ? '' : '-outline'}`;
        } else if (routeName === 'PEV') {
          iconName = `ios-beaker${focused ? '' : '-outline'}`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={horizontal ? 20 : 25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#97A2E7',
      inactiveTintColor: '#EF7A1A',
      style: {
        backgroundColor: '#111110',
      },
    },
  }
  );




export default createAppContainer(TabNavigator);


//Multiple styles used throughout
const styles = StyleSheet.create({
  container: {
    backgroundColor: '#111110',
    flex: 1,
  },

  containerSplash: {
    backgroundColor: '#111110',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bigText: {
    marginTop: 60,
    fontSize: 25,
    color: '#fff',
    fontFamily: 'Chalkduster',
  
  },

  sliderText: {
    fontSize: 15,
    color: '#fff',
    fontFamily: 'Chalkduster',
    textAlign: 'center',
    padding: 20,
  },

  selectText: {
    fontSize: 20,
    color: '#fff',
    fontFamily: 'Chalkduster',
    textAlign: 'center',
  },

 
  firstrow: {
    flex: .5,
  },

  secondrow: {
    flex: 2.2,
    flexDirection: 'row',
    alignItems: "center",

  },

  thirdrow: {
    flex: .3,
    flexDirection: 'row',
    alignItems: "center",
  },

  fourthrow: {
    flex: .5,
    alignItems: "center",
  },

  firstcol:{
    flex: 1,
    alignItems: 'flex-start',
  },

  secondcol: {
    flex: 1,
    alignItems: 'center',
  },

  thirdcol: {
    flex: 1,
    alignItems: 'flex-end',
  },

  slider: {
    width: 250,
    justifyContent: 'center',
  },

  electron: {
    width: 35,
    height: 35,
    borderRadius: 100/2,
    backgroundColor: '#97A2E7',
  },
  proton: {
    width: 35,
    height: 35,
    borderRadius: 100/2,
    backgroundColor: '#EF7A1A',
  },

  
});
