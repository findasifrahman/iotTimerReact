import { createAppContainer,createSwitchNavigator } from 'react-navigation';
import {  DrawerActions } from 'react-navigation-drawer'
import { createStackNavigator } from 'react-navigation-stack';
import React from 'react';
import {
  Image
} from 'react-native';
import login from '../screens/login';
import blueVersion from '../styles/colors';
const headerBackground = require('../../assets/images/background.png');
import { Button,Appbar, Text, withTheme } from 'react-native-paper';
import drawyerNavigator from './drawyerNavigator'

const StackNav =  createStackNavigator({
    drawnav:{
        screen: drawyerNavigator,

    }
},
{   
    headerMode: 'float',
    defaultNavigationOptions: ({ navigation }) =>({
      header: ({ scene, previous, navigation }) => {
        console.log('...................')
        console.log(scene.descriptor.options.headerTitle)
        console.log(scene.descriptor.options.title)
        //const tabTitle = scene.descriptor.options.title; 
        const { options } = scene.descriptor;
        const title =
          options.headerTitle !== undefined
            ? options.headerTitle
            : options.title !== undefined
            ? options.title
            : scene.route.routeName;
         const tt = "IntricateDevice"//options.title !== undefined ? options.title : ""
        return (
          <Appbar.Header dark={true} >
              <Appbar.Action icon="menu" onPress={() => {navigation.dispatch(DrawerActions.toggleDrawer()) }} />
              <Appbar.Content title={scene.descriptor.options.headerTitle}></Appbar.Content>
              <Appbar.Content title={tt}></Appbar.Content>
          </Appbar.Header>
        )
      },
      headerBackground: (
        <Image
          style={{ flex: 1 }}
          source={headerBackground}
          resizeMode="cover"
        />
      ),
    })
},
{
  initialRouteName: "drawnav",
}
) 
const switchNav = createSwitchNavigator({
  login:{
    screen: login,
    navigationOptions:{
      header:null
    }
  },
  stacknav: StackNav
},{
  initialRouteName: "login",
}
)
//export default createAppContainer(switchNav);
export default createAppContainer(StackNav);