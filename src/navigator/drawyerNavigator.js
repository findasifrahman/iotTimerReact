import { createDrawerNavigator } from 'react-navigation-drawer'
import { View,ScrollView, SafeAreaView } from 'react-native'
import { Drawer,Avatar} from 'react-native-paper'
import tabNavigator from './tabNavigator'
import settings from '../screens/settings'
import React from 'react';
const drawyerNavigator = createDrawerNavigator({
   welcome:  {
     screen:tabNavigator
    },
   settings:{
       screen:settings
   }
},
{
    contentComponent: props => (
        <ScrollView style={{backgroundColor: '#5C6BC0',colors:'white', fontSize: 20}}>     
          <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
            <View style={{  justifyContent: 'center',alignItems: 'center', marginTop:30,marginBottom:30}}>
              <Avatar.Text size={100} label="AI"  />
            </View>
            <Drawer.Section >
              <Drawer.Item style={{backgroundColor: '#ffffff', fontSize: 20}}
                label="Settings"
                icon="settings"
                active="true"
                title= "settti"
                onPress={() => props.navigation.navigate("settings")}
              />
             <Drawer.Item style={{backgroundColor: '#ffffff', fontSize: 20}}
              label="Welcome"
              icon="camera"
              active="true"
              onPress={() => props.navigation.navigate("welcome")}
            />
            </Drawer.Section>
          </SafeAreaView>
        </ScrollView>
      )
}
)

drawyerNavigator.navigationOptions = ({ navigation }) => {
  const { routeName } = navigation.state.routes[navigation.state.index];
  //console.log("in my drawjxj,nj  bar nav")
  //console.log(navigation.state.routes[navigation.state.index])
  //console.log(navigation.state.routes[navigation.state.index].routeName)
  //console.log(navigation.state.routes[navigation.state.index].index)

  let title = undefined
  if(navigation.state.routes[navigation.state.index].index != undefined){
    const tabNavName = navigation.state.routes[navigation.state.index].routes[navigation.state.routes[navigation.state.index].index].routeName
    title = tabNavName;
  }

  const headerTitle = routeName;

  return {
    headerTitle,
    title
  };
};

export default drawyerNavigator;