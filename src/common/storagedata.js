import AsyncStorage from '@react-native-community/async-storage';
import {PermissionsAndroid, 
  Alert,BackHandler, ToastAndroid } from 'react-native';

  const Toast = (props) => {
    if (props.visible) {
      ToastAndroid.showWithGravityAndOffset(
        props.message,
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50,
      );
      return null;
    }
    return null;
  };

export async function checkSavedPreference(){
    try {
      let conpref = await AsyncStorage.getItem('@savedPreference')
      if(conpref.startsWith("router") || conpref.startsWith("Router")){
        conpref = "router"
      }
      if(conpref !== null) {
        return conpref;
      }
      else{
        return null
      }
    } catch(e) {console.log("cant get data")
        return null
    }
}

export async function setSavedPreference(setdata){
  try {
    if(setdata.startsWith("router") || setdata.startsWith("Router")){
      setdata = "router"
    }
    AsyncStorage.setItem('@savedPreference', setdata)
    return setdata

  } catch(e) {console.log("cant get data")
      return null
  }
}
export async function setSSIDPassData(ssid,pass){
  try {
    await AsyncStorage.setItem('@ssid', ssid)
    await AsyncStorage.setItem('@password', pass)
  } catch (e) {
  }
}
export async function getSSID(){
  try {
    return(await AsyncStorage.getItem('@ssid'))
  } catch (e) {
    return null
  }
}
export async function getPASS(){
  try {
    return(await AsyncStorage.getItem('@password'))
  } catch (e) {
    return null
  }
}
checkSSID = async () =>{
  try {
    let conpref = await AsyncStorage.getItem('@ssid')
    if(conpref !== null) {
      return conpref;
    }
    else{
      return null
    }
  } catch(e) {console.log("cant get data")
      return null
  }
}

export async function  dateTimeSend(){
    var h = new Date().getHours().toString()
    var m = new Date().getMinutes().toString()
    var s = new Date().getSeconds().toString()
    if(h.length < 2){h = "0" + h.toString()}
    if(m.length < 2){m = "0" + m.toString()}
    if(s.length <2){s = "0" + s.toString()}    
    console.log("initial-", h+ ":" + m + "?" + s)
    return ("initial-" + h+ ":" + m + "?" + s)
}
export async function  mobTimeSend(){
  var h = new Date().getHours().toString()
  var m = new Date().getMinutes().toString()
  var s = new Date().getSeconds().toString()
  if(h.length < 2){h = "0" + h.toString()}
  if(m.length < 2){m = "0" + m.toString()}
  if(s.length <2){s = "0" + s.toString()}    
  console.log("MOBTIME-", h+ ":" + m + "?" + s)
  return ("MOBTIME-" + h+ ":" + m + "?" + s)
}

export function getBroadcast(ip,cb){
  let dot = 0; 
  let broad_ip = [];
  for (var i = 0; i < ip.length; i++) { 
    if(ip.charAt(i) == '.'){
      dot = dot + 1;
    }
    if(dot == 3){
      let temp_ip = broad_ip.join("")
      temp_ip = temp_ip + '.255';
      console.log("broadcast ip -- ",temp_ip)
      return cb(temp_ip);
      break;
    }
    broad_ip[i] = ip.charAt(i);
  }
}

export async function  checkPermissionWifiState(){
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Wifi networks',
        'message': 'We need your permission in order to find device'
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {       
      return true
    }
    else{
      console.log("Need To provide permission to access WIFI iot device :)");
      Alert.alert(
        'Hello',
        'Need To provide permission to access WIFI iot device',
        [
          {text: 'Ok', onPress: () =>  BackHandler.exitApp()},
        ],
        {cancelable: false},
      );
    }
  }
  catch (err) {return false;   }
}