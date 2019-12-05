import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import React from 'react';
import {View} from 'react-native'
import welcome from '../screens/welcome';
import contact from '../screens/contact';

import Icon from 'react-native-vector-icons/Ionicons'; 
import blueVersion from '../styles/colors';
const tabNavigator = createMaterialBottomTabNavigator({
    welcome:{
        screen: welcome,
        navigationOptions:{
            tabBarLabel:'Welcome',  
            tabBarIcon: ({ tintColor }) => (  
                <View>  
                    <Icon style={[{color: tintColor}]} size={25} name={'ios-home'}/>  
                </View>),  
        }
    },
    contact: {
        screen: contact,
        navigationOptions: {
            tabBarIcon: ({ tintColor }) => (  
                <View>  
                    <Icon style={[{color: tintColor}]} size={25} name={'ios-person'}/>  
                </View>),  
            activeColor: '#f60c0d',  
            inactiveColor: '#f65a22',  
            barStyle: { backgroundColor: "#ffffff" },  
        }
    }
},
    {  
        initialRouteName: "welcome",  
        activeColor: blueVersion.primary,//'#0D47A1',  
        inactiveColor: '#0D47A1',  
        barStyle: { backgroundColor:  "#ffffff" },  
    },
) 

tabNavigator.navigationOptions = ({ navigation }) => {
    const { routeName } = navigation.state.routes[navigation.state.index];

    const headerTitle = navigation.state.routes[navigation.state.index].routeName;
    const title = "IntricateDev"//navigation.state.routes[navigation.state.index].routeName;
    return {
      headerTitle,
      title
    };
  };

  export default tabNavigator;