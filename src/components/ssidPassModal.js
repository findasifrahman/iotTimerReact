import React,{Component} from 'react'
import { View,BackHandler,PermissionsAndroid, StyleSheet,Modal,alert,Picker, Item,Alert, ToastAndroid, } from 'react-native';
import blueVersion from '../styles/colors';
import {connect} from 'react-redux';
import {ssidModalAction} from '../redux/actions/ssidModalAction';
import {ssidPassAction} from '../redux/actions/ssidPassAction'
import { Avatar, Button, Card, Title, Paragraph,TextInput,TextInputMask, withTheme,Portal,Dialog } from 'react-native-paper';
import AsyncStorage from '@react-native-community/async-storage';
import dgram from 'react-native-udp';
import wifi from 'react-native-android-wifi';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { NetworkInfo } from "react-native-network-info";
import { savedprefAction } from '../redux/actions/savedpreferenceaction'
import { returnmessegeAction } from '../redux/actions/returnmessegeAction'
import { dateTimeSend,setSavedPreference,getBroadcast,checkPermissionWifiState,
  setSSIDPassData,getSSID,getPASS } from '../common/storagedata'

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
class SSidPassModal extends Component{
  constructor(props){
    super(props)
    //this.closeActivityIndicator()
    this.state = {
      toastvisible: false,
    };        
    }
    state = {
        savedSSID: '',
        passwordtext: '',
        savedpreference: '',
        returnMessege: '',
        visible: false,
        dialogVisible: false,
        setTime: '',
        
        returnMessege: '',
        toastvisible: false,
    }
    async connectWifiDirectSSID(){
          let wistate = checkPermissionWifiState()
          if(wistate){
                wifi.getSSID((ssid) => {
                  console.log(ssid)
                  if(ssid == "IntricateDev"){
                      console.log("Direct Connection from settings");
                      //this.setState({connectionStatusText: "Connected Directly"})
                      return true
                    } else {
                      console.log("In order To set Router Config in device You need to connect to device directly. Press Settings to go to settings and connect to device . If you are sure you are connected then press try again ");
                      this.setReturnMes("Cant Connect.");
                      Alert.alert(
                        'Alert',
                        'In order To set Router Config in device You need to connect to device directly. Go to  settings and connect to device named "IntricateDev" . If you are sure you are connected then press try again',
                        [
                          {text: 'Try Again', onPress: () =>  this.connectWifiDirectSSID()},
                          //{text: 'Settings', onPress: () => { AndroidOpenSettings.wifiSettings();BackHandler.exitApp()}}
                        ],
                        {cancelable: true},
                      );
                      return false;
                    }
                });

          } 
    }
    async setReturnMes(str){
      this.props.returnmessegeAdd(str)
    }
    async sendData(sentData){
      try{
        console.log("sending Data")
          let socket;
          socket = dgram.createSocket('udp4')
          socket.bind(9999)//8888)
          const remotePort = 9999//8888;
          let remoteHost = "192.168.4.1";
          socket.once('listening', function() {
            var obj = sentData;
            var uint = new Uint8Array(sentData.length);
            for (var i = 0, l = sentData.length; i < l; i++){
                uint[i] = obj.charCodeAt(i);
            }
            var buf = new Uint8Array(uint);      
            socket.send(buf, 0, buf.length, remotePort, remoteHost, function(err) {
              if (err) throw err    
              console.log('Data sent')
              
            })
            socket.on('message',async function(msg, rinfo) {
              var str = String.fromCharCode.apply(null, new Uint8Array(msg));
              console.log('messege -- ' + str + ' -' + JSON.stringify(rinfo));
              console.log('message ws received', msg);
              await this.setReturnMes(str)
              if(str == "SSID Set Ok"){
                return true;
              }
              socket.close()
              return false;
            }.bind(this))
        }.bind(this))
      } catch(e){
        console.log(e)
        Alert.alert(
          'Problem',
          'Something went wrong cant send data to device. Either the device is occupied or disconnected',
          [
            {text: 'Ok', onPress: () =>  BackHandler.exitApp()},
          ],
          {cancelable: false},
        );
        return false
      }

    }
    hideToast = () => {
      this.setState({
        toastvisible: false,
      });
    };
    checktimevalueproper(txt){
      console.log(txt)
      if(txt == undefined){
        return
      }
      if(txt.length != 5 || !(txt.indexOf(':') > -1)){
        this.setState({toastMessege: "wrong lenghth or format", toastvisible: true},
        () => {
          this.hideToast();
        },)
        return false
      }
      if(isNaN(txt.substring(0, 2)) || isNaN(txt.substring(3, 5))){
        this.setState({toastMessege: "format hour problem", toastvisible: true},
        () => {
          this.hideToast();
          
        },)
        return false
      }
      var hh = parseInt(txt.substring(0, 2))
      var mm = parseInt(txt.substring(3, 5))
      console.log(hh)
      console.log(mm)
      if(!(hh >= 0 && hh <24) || !(mm >= 0 && mm <60)){
        this.setState({toastMessege: "Hour Minute value not proper", toastvisible: true},
        () => {
          this.hideToast();
        },)
        return false
      }
      else{
        return true
      }
      
    }
    getTimePressed = async() =>{
      if(await this.connectWifiDirectSSID() == false){
        return
      }
      if(await this.sendData("getTime")){
      }      
      //console.log("getting pref --", this.state.savedPreference)
      this.props.addVisible(false)
    }
    setPreference = async() =>{

      //this.setState({savedPreference: ""})  
      await setSavedPreference("direct");
      this.props.savedpreferenceAdd("direct");
      console.log("getting pref --", this.props.savedpreference)
      /*if(ssidPassObj.savedPreference == "direct"){
        Alert.alert(
          'Ok',
          'Your Settings is Done Please restart app',
          [
            {text: 'Ok', onPress: () =>  BackHandler.exitApp()},
          ],
          {cancelable: false},
        );
      }*/
      this.props.addVisible(false)
    }
    setTimePressed = async() =>{
      console.log("st time is-", this.state.setTime)
      if(!this.state.setTime){
        return
      }
      if(!this.checktimevalueproper(this.state.setTime)){
        return
      }
      if(await this.connectWifiDirectSSID() == false){
        return
      }
      if(await this.sendData("SETTIME-" + this.state.setTime)){
      }      
      this.props.addVisible(false)
    }
    submit = async () =>{
        if(await this.connectWifiDirectSSID() == false){
          return
        }
        await setSavedPreference("router");
        await setSSIDPassData(this.state.savedSSID,this.state.passwordtext)
        this.props.savedpreferenceAdd("router");

        console.log(this.state.savedSSID)
        const sentData = "joinAP:" + this.state.savedSSID + "?" + this.state.passwordtext;
        await this.sendData(sentData)
        this.props.returnmessegeAdd("Wait for Reply....")
        setTimeout(function(){
          if(this.props.returnMessege == "Wait for Reply...."){
            this.props.returnmessegeAdd("No Reply")
          }
        }.bind(this),17000)
        /*if(await this.sendData(sentData)){
          Alert.alert(
            'Congratulation',
            'We did able to save config in device messege successfully',
            [
              {text: 'Ok', onPress: () =>  BackHandler.exitApp()},
            ],
            {cancelable: false},
          );
        }*/
        this.props.addVisible(false)
    }
    async componentDidMount(){
      await this.props.savedpreference;
      this.setState({
        savedSSID: await getSSID(),
        passwordtext: await getPASS(),
      })
    }

    render(){
        return(
            <Modal
                animationType="slide"
                transparent={true}
                visible={this.props.visible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <View style={styles.container2}>
                    <Toast visible={this.state.toastvisible} message={this.state.toastMessege} />
                    <Card style={styles.cardWidth}>
                        <Card.Title title="SSID,Time,State Change" subtitle="Intricate Lab" left={(props) => <Avatar.Icon {...props} icon="folder" />} />
                        <Card.Content>
                                <TextInput
                                    label='SSID'
                                    value={this.state.savedSSID}
                                    onChangeText={savedSSID => this.setState({ savedSSID })}
                                    style={{fontSize:hp('2%'),height:hp('5%'),fontColor:'#000000'}}
                                    mode='outlined'
                                />
                                <TextInput
                                    label='Password'
                                    value={this.state.passwordtext}
                                    style={{fontSize:hp('2%'),height:hp('5%')}}
                                    onChangeText={passwordtext=> this.setState({ passwordtext })}
                                    mode='outlined'
                                />
                        </Card.Content>
                        <Card.Actions style={{flexDirection:'row',paddingLeft:15,paddingRight:15}}>                        
                            <Button mode="contained" style={{backgroundColor:'#555555',fontSize:hp('4%'),height:hp('5%'), flex:3, marginRight:10  }} compact="true" onPress={this.submit}>Change SSID</Button>
                            <Button mode="contained" style={{ backgroundColor: '#555555',fontSize:hp('4%'),height:hp('5%'), flex:1  }} compact="true" onPress={()=> {this.props.addVisible(false)}} dark="true">Cancel</Button>
                        </Card.Actions>
                        <View style={{flexDirection:'row',paddingLeft:15,paddingRight:15}}>
                          <TextInput style={{backgroundColor:'transparent',fontColor:'white' ,fontSize:hp('2%'),height:hp('5%'),flex:2,marginRight: 10,paddingTop:0 }} placeholder='Set Time' value={this.state.setTime} onChangeText={setTime => this.setState({ setTime })} mode='outlined'/>
                          <Button mode="contained" style={{backgroundColor:'#555555', flex:1, fontSize:hp('2%'),height:hp('5%'),marginTop:5 }} compact="true" onPress={this.setTimePressed}>Set Time</Button>
                        </View>
                    <Card.Actions>
                        <View style={{flexDirection:'row'}}>
                          <Picker
                            mode="dialog"
                            selectedValue={this.state.savedPreference}
                            style={{ flex:2,paddingLeft:20,fontSize:hp('4%') }}
                            itemStyle={{  fontFamily:"Ebrima", fontSize:25 }}
                            onValueChange={(itemValue, itemIndex) =>
                              this.setState({savedPreference: itemValue})
                            }>
                            <Picker.Item   label="Direct Connection" value="direct" />
                          </Picker>
                          <Button mode="contained" style={{backgroundColor:'#aa99aa', flex:3, marginRight:10, height:hp('5%'),marginTop:5  }} compact="true" onPress={this.setPreference}>Set Con Preference</Button>
                        </View>
                      </Card.Actions>


                        <View style={{flexDirection:'row',padding:hp('1%')}}>
                          <Button mode="contained" style={{backgroundColor:'#aa99aa', height:hp('6%'), flex:3, marginRight:10  }} compact="true" onPress={this.getTimePressed}>Get Time</Button>
                        </View>

                    </Card>

                </View>

            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width: wp('100%'),
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    container2:{
        textAlign:"center",

        justifyContent: "center",
        flex:1,
        //backgroundColor:"#111111"

    },
    cardWidth:{
      // marginTop:20,
       marginLeft:20,
       marginRight:20,
       backgroundColor: blueVersion.bluish//blueVersion.secondaryGradientStart,
    },
    btnStyle:{
        width: "78%"
    },
  });

  mapStateToProps = state =>{
    return{
        visible: state.ssidModalReducer.ssid_modal_visible,
        savedSSID: state.ssidPassReducer.savedSSID,
        passwordtext: state.ssidPassReducer.savedPass,

        savedpreference: state.savedpreferenceReducer.savedpreference,
        returnMessege: state.returnmessegeReducer.returnmessege
    }
  }
  mapDispatchToProps = Dispatch =>{
        return{
            addVisible: (value) =>{
                Dispatch(ssidModalAction(value))
            },
            savedSSIDPassAdd: (savedSSIDPassObj) => {
              Dispatch(ssidPassAction(savedSSIDPassObj))
            },
            savedpreferenceAdd: (savedpreference) => {
              Dispatch(savedprefAction(savedpreference))
            },
            returnmessegeAdd: (returnmessege) => {
             Dispatch(returnmessegeAction(returnmessege))
           }
        }
    }
  export default connect(mapStateToProps,mapDispatchToProps) (SSidPassModal)