import React,{Component} from 'react';
import { View,Text, SafeAreaView,ScrollView, ActivityIndicator, StyleSheet,PermissionsAndroid, 
  Alert,BackHandler,TouchableOpacity,Image, ToastAndroid } from 'react-native';
import {connect} from 'react-redux';
import dgram from 'react-native-udp';
import wifi from 'react-native-android-wifi';
import { Avatar, Button, Card, Title, Paragraph,TextInput, Portal,Dialog } from 'react-native-paper';
import { NetworkInfo } from "react-native-network-info";
import AsyncStorage from '@react-native-community/async-storage';
import {ssidPassAction} from '../redux/actions/ssidPassAction' 
import { savedprefAction } from '../redux/actions/savedpreferenceaction'
import { returnmessegeAction } from '../redux/actions/returnmessegeAction'
import { withNavigation } from 'react-navigation';
import images from '../../assets/images';
import blueVersion from '../styles/colors';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {  _dialog } from '../components/dialog'
import { dateTimeSend,mobTimeSend,setSavedPreference,getBroadcast,checkPermissionWifiState } from '../common/storagedata'

var socket;
socket = dgram.createSocket('udp4',function(err){
  if(err){console.log(err)}
})

// a component that calls the imperative ToastAndroid API
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
class welcome extends Component{
    timerHandle;

    constructor(props){
        super(props)
        this.state = {
          toastvisible: false,
        };   
   
    }
    state = {
        dialogvisible: false,
        animating: true,
        reanderAllDisplay: false,
        //initMesseage:'',
        btn1Image: images.btnOffImage,
        btn2Image: images.btnOffImage,
        //connectionStatusText:'Connecting...',
        routerConnectionTryout: '0',
        IOTdeviceIp: '',
        broadcastip: '',
        tryAgainScreenState: false,
        savedpreference: '',
        returnMessege: '',
        toastvisible: false,
        toastMessege: '',
        starttime1: '',
        endtime1: '',
        starttime2: '',
        endtime2: '',
        btnbackcol: '#000000',
        mobileIpAdd: '',
        toggleStartTime1: '',
        toggleEndTime1: '',
        toggleInitDuration: '',
        toggleTimeDuration: '',
        globalsentData: ''
    }
    
    checktimely = async(txt) =>{
      if(txt.length != 2){
        this.setState({toastMessege: "wrong lenghth or format", toastvisible: true},
        () => {
          this.hideToast();
        },)
        return false
      }
      else if(isNaN(txt.substring(0, 2))){
        this.setState({toastMessege: "Not a number problem", toastvisible: true},
        () => {
          this.hideToast();      
        },)
        return false
      }
      else{
        return true
      }
    }
    checktimevalueproper = async(txt)=>{
      console.log(txt)
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
    async connectWifiDirectSSID(){
          let wistate = await checkPermissionWifiState()
          let getdatetimeval = await dateTimeSend()
          if(wistate){
                console.log("inside connect direct")
                wifi.getSSID((ssid) => {
                  console.log(ssid)
                  console.log(getdatetimeval)
                  if(ssid == "IntricateDev"){
                      //this.setState({animating: false, reanderAllDisplay: true})
                      console.log("Direct Connection. SSID MILESE");
                      this.setState({connectionStatusText: "Connected Directly"})
                      this.sendData(getdatetimeval)//("initial-" + h+":"+m+":"+s)
                  }
                  else {
                    console.log("Cont connect directly.Try again or if you are already connected press wifi settings and connect to intricate device ");
                    this.setState({animating: false, reanderAllDisplay: false,tryAgainScreenState: true}) 
                    Alert.alert(
                      'Hello',
                      'Your preference is set to connect directly but you are not connect to device named "IntricateDev".Try again or if you are already connected or go to wifi settings and connect to IntricateDev.Press settings and change your prefence if you want to connect via router',
                      [
                        {text: 'Try Again', onPress: () =>  this.connectWifiDirectSSID()},
                        //{text: 'Show Anyway', onPress: () => {this.setState({animating: false, reanderAllDisplay: true}), this.setState({connectionStatusText: "Disconnected"})   }},
                        //{text: 'Settings', onPress: () => { BackHandler.exitApp();AndroidOpenSettings.wifiSettings();}}
                        {text: 'Settings', onPress: () => { this.props.navigation.navigate('settings')}}
                      ],
                      {cancelable: false},
                    );
                  } 
                })
          }  
    }
    connectDirect(){
      this.connectWifiDirectSSID();
    }
    checkRouterConnectivity = async () =>{
          let currentSSID = await this.checkSSID()
          console.log("current ssidis ----", currentSSID)
          var sdata = await dateTimeSend()
          wifi.getSSID((ssid) => {
            console.log("current ssidis ----", ssid)
            if(ssid == currentSSID){
              this.setState({connectionStatusText: "Local Network"})
              
              NetworkInfo.getIPV4Address().then(ipAdd => {
                console.log(ipAdd);
                this.setState({mobileIpAdd: ipAdd})
                getBroadcast(ipAdd,function(remoteHost){
                  this.setState({broadcastip:remoteHost})
                  this.sendData(sdata)
                }.bind(this))
              });
            }
            else{
              Alert.alert(
                'Hello',
                'You are not connected to the correct ssid.Please Change ssid from app settings or your phones wifi settings',
                [
                  {text: 'Settings', onPress: () =>  this.props.navigation.navigate('settings') },
                  {text: 'Connect Directly', onPress: () =>  this.connectDirect() }
                ],
                {cancelable: false},
              );
            }
          })
    }
    checkSavedPreference = async () =>{
      try {
        let conpref = await AsyncStorage.getItem('@savedPreference')
        if(conpref.startsWith("router") || conpref.startsWith("Router")){
          conpref = "router"
        }
        if(conpref !== null) {
          this.props.savedpreferenceAdd(conpref)
          return conpref;
        }
        else{
          return null
        }
      } catch(e) {console.log("cant get data")
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
    async componentDidMount(){
      let savedPref = await this.checkSavedPreference();

      socket.bind(9999)//8888)
      /////////////////
      try{         
          var str = null
          socket.once('listening', function() {
            socket.on('message',function(msg, rinfo) {//messege recieved
              returnAddress = rinfo
              str = String.fromCharCode.apply(null, new Uint8Array(msg));
              console.log('messege -- ' + str + ' -' + JSON.stringify(rinfo));              

              if(str == "Device 1 set"){                
                this.setState({animating:false,reanderAllDisplay:true,btn1Image: images.btnOffImage});
              }
              else if(str == "Device 2 set"){
                this.setState({animating:false,reanderAllDisplay:true,btn2Image: images.btnOffImage});
              }
              else if(str == "Toggle Time Set"){
                //this.props.returnmessegeAdd(str)
                this.setState({animating:false,reanderAllDisplay:true,btn1Image: images.btnOnImage});
              }
              else if(str.startsWith("Device Found -") && savedPref.startsWith("router")){
                console.log("router er dhare")
                  if(rinfo.address != this.state.mobileIpAdd){
                    //this.props.returnmessegeAdd(str)
                    this.setState({IOTdeviceIp: rinfo.address,animating: false, reanderAllDisplay: true})
                  }    
                  this.setState({animating:false,reanderAllDisplay:true});  
              }
              else if(str.startsWith("Device Found -") && savedPref.startsWith("direct")){
                this.setState({animating:false,reanderAllDisplay:true});
              }
              else if(str == "Device 1 Close"){
                //this.props.returnmessegeAdd(str)
                this.setState({animating:false,reanderAllDisplay:true,btn1Image: images.btnOnImage});
              }
              else if(str == "Device 2 Close"){
                this.setState({animating:false,reanderAllDisplay:true,btn2Image: images.btnOnImage});
              }
              else if(str.startsWith("Time")){
                this.setState({animating:false,reanderAllDisplay:true});
              }
              else if(str.startsWith("Forgotten")){
                this.setState({animating:false,reanderAllDisplay:true});
              }
              else if(str.includes(":") && this.state.globalsentData.startsWith("MOBTIME-")){
                this.setState({animating:false,reanderAllDisplay:true});
              }
              else if(str.startsWith("Set Time -")){
                this.setState({animating:false,reanderAllDisplay:true});
              }
              // this.setState({returnMessege: str})
              console.log("mobile ip add--", this.state.mobileIpAdd)
              console.log("rinfo ip add--", rinfo.address)
              if(rinfo.address != this.state.mobileIpAdd){
                this.props.returnmessegeAdd(str)
                this.setState({animating:false,reanderAllDisplay:true});
                this.clearTimer()
                //socket.close() 
              }             
            }.bind(this))
        }.bind(this))
    } catch(e){
        console.log(e)
        Alert.alert(
          'Problem',
          'Something went wrong cant send data to device. Either the device is occupied or disconnected. Check your Settings',
          [
            {text: 'Ok', onPress: () =>  BackHandler.exitApp()},
            {text: 'Settings', onPress: () =>  this.props.navigation.navigate('settings') },
          ],
          {cancelable: false},
        );
      }
      ///////////////////

      this.setState({ btnbackcol: '#000000',btn1Image: images.btnOnImage,btn2Image: images.btnOnImage })
      const { navigation } = this.props;
      this.focusListener = navigation.addListener('didFocus', async () => {
        console.log("focused")
        this.setState({
          starttime1: await AsyncStorage.getItem('@time1st'),
          endtime1: await AsyncStorage.getItem('@time1en'),
          toggleStartTime1: await AsyncStorage.getItem('@togStart'),
          toggleEndTime1: await AsyncStorage.getItem('@togEnd'),
          toggleInitDuration: await AsyncStorage.getItem('@togInitDur'),
          toggleTimeDuration: await AsyncStorage.getItem('@togDur'),
          starttime2: await AsyncStorage.getItem('@time2st'),
          endtime2: await AsyncStorage.getItem('@time2en')
        })
      });
        
        
        if(savedPref != null){
              let wiperm = await checkPermissionWifiState();
              if(wiperm){
                  wifi.isEnabled((isEnabled) => {
                    if (isEnabled) {                  
                      if(savedPref.startsWith('router')){
                        console.log("its router")
                        this.setState({animating: true, reanderAllDisplay: false})
                        this.checkRouterConnectivity()
                      }
                      else{
                        this.connectDirect()
                      }
                    }
                    else{
                      Alert.alert(
                        'Hello',
                        'Please turn on wifi and enter again',
                        [
                          {text: 'Ok', onPress: () =>  BackHandler.exitApp()},
                        ],
                        {cancelable: false},
                      );
                    }
                  })
              }
          }
          else{
            //this._showDialog()
            Alert.alert(
              'Alert',
              'Your settings is not configured. Press Settings to got to settings or press direct to connect device directly',
              [
                {text: 'Settings', onPress: () =>  this.props.navigation.navigate('settings') },
                {text: 'Direct', onPress: () =>  {
                  this.props.savedpreferenceAdd("direct")
                  setSavedPreference("direct")
                  this.connectDirect();
                } },
              ],
              {cancelable: false},
            );
          }
    //});
    }
    componentWillUnmount(){
      socket.close()
    }

    setTimer = () => {
      if (this.timerHandle) {
        // Exception?
        return;
      }
      // Remember the timer handle
      this.timerHandle = setTimeout(
        function() {
          let savedpref = this.props.savedpreference
          console.log("ret messege is--" ,this.props.returnMessege)
          {
            this.props.returnmessegeAdd("Cant Send data")
            this.setState({animating:false,reanderAllDisplay:true});
          }
          /////////////
          if(this.state.globalsentData.startsWith("initial-")){
                this.setState({animating: false, reanderAllDisplay: false}) 
                Alert.alert(
                  'Alert',
                  'Your Prefenrence is set to '+ savedpref + ' But we cant connect. Press Settings to got to settings and change prefenrence or press try again',
                  [
                    {text: 'Settings', onPress: () =>  this.props.navigation.navigate('settings') },
                    {text: 'Try Again', onPress: () =>  {
                      if(savedpref.startsWith("router")){
                        this.checkRouterConnectivity()
                      }
                      else{
                        this.connectWifiDirectSSID()
                      }
                    } },
                  ],
                  {cancelable: false},
                );
          }
        }.bind(this),5000
      )
    };
  
    clearTimer = () => {
      // Is our timer running?
      if (this.timerHandle) {
          console.log("timer cleares")
          clearTimeout(this.timerHandle);
          this.timerHandle = 0;
      }
    };
    sendData(sentData){ 
      if(!sentData){
        return
      }
      this.clearTimer()

      this.setState({globalsentData: sentData})
      this.props.returnmessegeAdd("")
      console.log("inside touch")
      this.setState({animating:true,reanderAllDisplay:false});

      ////////
      this.setTimer()
      ///////
      const remotePort = 9999;//8888;
      let remoteHost;
      if(this.props.savedpreference == "direct" ){
        remoteHost = "192.168.4.1";
        console.log("direct ip man")
      }
      else if(sentData.startsWith("initial-") && this.props.savedpreference.startsWith("router")){
        remoteHost = this.state.broadcastip;
      }
      else{
        remoteHost = this.state.IOTdeviceIp;
        console.log("indirect ip")
      }
      var obj = sentData;
      var uint = new Uint8Array(sentData.length);
      for (var i = 0, l = sentData.length; i < l; i++){
          uint[i] = obj.charCodeAt(i);
      }
      var buf = new Uint8Array(uint); 
      if(!remoteHost){
        remoteHost = this.state.broadcastip;
        console.log("Ip address is invalid-",remoteHost)
        //return
      }    
      socket.send(buf, 0, buf.length, remotePort, remoteHost, function(err) {
        if (err){ 
          console.log(err) 
          return  
        }
        console.log('message wa sent')              
      })
      //////////

    } 

    hideToast = () => {
      this.setState({
        toastvisible: false,
      });
    };
    
    time1set = async() => {  
      if(!this.state.starttime1 ||  !this.state.endtime1){
        return
      }
      var tt1 = await this.checktimevalueproper(this.state.starttime1) 
      var tt2 = await this.checktimevalueproper(this.state.endtime1) 
      if(tt1 && tt2){
        this.sendData("TIME1-"+ this.state.starttime1+ "?" + this.state.endtime1)
        try {
          await AsyncStorage.setItem('@time1st', this.state.starttime1)
          await AsyncStorage.setItem('@time1en', this.state.endtime1)
        } catch (e) {}
      }
    }
    time2set = async() => {  
      var tt1 = await this.checktimevalueproper(this.state.starttime2) 
      var tt2 = await this.checktimevalueproper(this.state.endtime2) 
      if(tt1 && tt2){
        this.sendData("TIME2-"+ this.state.starttime2+ "?" + this.state.endtime2)
        try {
          await AsyncStorage.setItem('@time2st', this.state.starttime2)
          await AsyncStorage.setItem('@time2en', this.state.endtime2)
        } catch (e) {}
      }
    }
    toggleset = async() =>{
      if(!this.state.toggleStartTime1 ||  !this.state.toggleEndTime1 || !this.state.toggleInitDuration || !this.state.toggleTimeDuration){
        return
      }
      var tt1 = await this.checktimevalueproper(this.state.toggleStartTime1) 
      var tt2 = await this.checktimevalueproper(this.state.toggleEndTime1)
      var inittime = await this.checktimely(this.state.toggleInitDuration)
      var tt4 = await this.checktimely(this.state.toggleTimeDuration)
      if(tt1 && tt2 && inittime && tt4){
        this.sendData("toggleTIME-"+ this.state.toggleStartTime1 + "?" + this.state.toggleEndTime1 + "!" + this.state.toggleInitDuration + "$" + this.state.toggleTimeDuration )
        try {
          await AsyncStorage.setItem('@togStart', this.state.toggleStartTime1)
          await AsyncStorage.setItem('@togEnd', this.state.toggleEndTime1)
          await AsyncStorage.setItem('@togInitDur', this.state.toggleInitDuration)
          await AsyncStorage.setItem('@togDur', this.state.toggleTimeDuration)
        } catch (e) {}  
      }
    }
    settimePressed = async() =>{
      var sdata = await mobTimeSend()
      await this.sendData(sdata)
    }
    _showDialog = () => this.setState({ dialogvisible: true });

    _hideDialog = () => this.setState({ dialogvisible: false });

    forgetRouterPressed = async() =>{ 
      await this.sendData("forgetROUTER")
      console.log("fogetting..")
      await setSavedPreference("direct");
      this.props.savedpreferenceAdd("direct");
      console.log("getting pref --", this.props.savedpreference)

      this.sendData("forgetROUTER")
    }
  
    showTryAgainWifi = () =>{
      if(this.state.connectionStatusText == "Disconnected"){
        return(
          <View>
            <Button onPress={() => this.checkRouterConnectivity()}>Try Again to coonect via Router</Button>
            <Button onPress={() => this.connectDirect()}> Connect Directlty</Button>
          </View>
        ) 
      }
    }

    showMainScreen = () =>{     
      if(this.state.reanderAllDisplay)
      {
        return(
          <View> 
            <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
              <Text  style={{fontSize:hp('3%'),marginBottom:hp('1%'),textAlign:'center', color:'#882233',width:wp('90%'), backgroundColor:blueVersion.bluish}}>{this.props.returnMessege}</Text> 
            </View>
            <View style={{flex:0.7,marginBottom:0,paddingBottom:0}}>
              <Card style={style.cardWidth}>
                  <Card.Title title="Timer (24-h format- HH:mm)" subtitle="Enter Time" left={(props) => <Avatar.Icon {...props} icon="star" />} />
                  <Card.Content >    
 
                  </Card.Content>
                  <Card.Actions>
                    <View style={{flexDirection:"row"}}>            
                          <TextInput  label='Start Timer1' value={this.state.starttime1}  mode='outlined'
                              onChangeText={starttime1 => this.setState({ starttime1 })}
                              style={{fontSize:hp('2%'),height:hp('5%'),flex:.3}}                           
                          />
                          <TextInput  label='End Timer1' value={this.state.endtime1} mode='outlined'
                              style={{fontSize:hp('2%'),height:hp('5%'),flex:.3}}
                              onChangeText={endtime1=> this.setState({ endtime1 })}                            
                          />
                          <Button icon="camera" mode="contained" style={{ backgroundColor: '#440000',flex:.4,height:hp('5%'),marginTop:5,marginLeft:10 }} compact="true" onPress={this.time1set}>Set Timer1</Button>
                      </View>  
                  </Card.Actions>
                  <Card.Actions>
                    <View style={{flexDirection:"row"}}>            
                          <TextInput  label='Start Timer2' value={this.state.starttime2}  mode='outlined'
                              onChangeText={starttime2 => this.setState({ starttime2 })}
                              style={{fontSize:hp('2%'),height:hp('5%'),flex:.3}}                           
                          />
                          <TextInput  label='End Timer2' value={this.state.endtime2} mode='outlined'
                              style={{fontSize:hp('2%'),height:hp('5%'),flex:.3}}
                              onChangeText={endtime2=> this.setState({ endtime2 })}                            
                          />
                          <Button icon="camera" mode="contained" style={{ backgroundColor: '#440000',flex:.4,height:hp('5%'),marginTop:5,marginLeft:10 }} compact="true" onPress={this.time2set} dark="true">Set Timer2</Button>
                      </View>  
                  </Card.Actions>
              </Card>
              <Card style={style.cardWidth}>
                  <Card.Title title="Toogle Time (24-h HH:mm)" subtitle="Enter start & end time with intial time & duration" left={(props) => <Avatar.Icon style={{backgroundColor:'#229911', color:"#229911"}} {...props} icon="folder" />} />
                  <Card.Content >    
                  </Card.Content>
                  <Card.Actions>
                    <View style={{flexDirection:"row"}}>            
                          <TextInput  label='Toggle Start(hh:mm)' value={this.state.toggleStartTime1}  mode='outlined'
                              onChangeText={toggleStartTime1 => this.setState({ toggleStartTime1 })}
                              style={{fontSize:hp('2%'),height:hp('5%'),flex:.5}}                           
                          />
                          <TextInput  label='Toggle End(hh:mm)' value={this.state.toggleEndTime1} mode='outlined'
                              style={{fontSize:hp('2%'),height:hp('5%'),flex:.5}}
                              onChangeText={ toggleEndTime1=> this.setState({ toggleEndTime1 })}                            
                          />
                      </View>  
                  </Card.Actions>
                  <Card.Actions>
                  <View style={{flexDirection:"row"}}>            
                          <TextInput  label='Init(mm)' value={this.state.toggleInitDuration}  mode='outlined'
                              onChangeText={toggleInitDuration => this.setState({ toggleInitDuration })}
                              style={{fontSize:hp('2%'),height:hp('5%'),flex:.3}}                           
                          />
                          <TextInput  label='Dura(mm)' value={this.state.toggleTimeDuration} mode='outlined'
                              style={{fontSize:hp('2%'),height:hp('5%'),flex:.3}}
                              onChangeText={ toggleTimeDuration=> this.setState({ toggleTimeDuration })}                            
                          />
                          <Button icon="home" mode="contained" style={{ backgroundColor: '#440000',flex:.4,height:hp('5%'),marginTop:5,marginLeft:10 }} compact="true" onPress={this.toggleset}>Set Toggle</Button>
                      </View> 
                  </Card.Actions>
              </Card>
              <View style={{flexDirection:"row"}}> 
                <View style={{flex:0.5,justifyContent:"center",alignItems: 'center', paddingBottom:0,marginTop:hp('4%')}}>
                    <TouchableOpacity style={{justifyContent:"center",textAlign:'center',}} onPress={()=> {this.sendData("CH1DEV");this.setState({animating:true})}}>
                      <Image style={{backgroundColor: 'transparent',width: hp('10%'),height:hp('10%')}}
                        source={this.state.btn1Image}
                      />
                    </TouchableOpacity>
                </View>
                <View style={{flex:0.5,justifyContent:"center",alignItems: 'center', paddingBottom:0,marginTop:hp('4%')}}>
                    <TouchableOpacity style={{justifyContent:"center",textAlign:'center',}} onPress={()=> {this.sendData("CH2DEV");this.setState({animating:true})}}>
                      <Image style={{backgroundColor: 'transparent',width: hp('10%'),height:hp('10%')}}
                        source={this.state.btn2Image}
                      />
                    </TouchableOpacity>
                </View>
              </View>
              <View style={{flexDirection:"row"}}> 
                <View style={{flex:0.5,justifyContent:"center",alignItems: 'center', paddingBottom:0,marginTop:hp('1%')}}>
                    <Text>Dev1</Text>
                </View>
                <View style={{flex:0.5,justifyContent:"center",alignItems: 'center', paddingBottom:0,marginTop:hp('1%')}}>
                    <Text>Dev2</Text>
                </View>
              </View>

              <View style={{flexDirection:"row"}}> 
                <View style={{flex:0.3,justifyContent:"center",alignItems: 'center', paddingBottom:0,marginTop:hp('5%')}}>
                    <Button  mode="contained" style={{ backgroundColor: '#223322',flex:.4,height:hp('5%'),marginTop:5,marginLeft:10 }} compact="true" onPress={this.settimePressed}>Set Time</Button>
                </View>
                <View style={{flex:0.3,justifyContent:"center",alignItems: 'center', paddingBottom:0,marginTop:hp('5%')}}>
                    <Button  mode="contained" style={{ backgroundColor: '#223322',flex:.4,height:hp('5%'),marginTop:5,marginLeft:10 }} compact="true" onPress={() => this.sendData("getTime")}>Get Time</Button>
                </View>
                <View style={{flex:0.4,justifyContent:"center",alignItems: 'center', paddingBottom:0,marginTop:hp('5%')}}>
                    <Button mode="contained" style={{ backgroundColor: '#223322',flex:.4,height:hp('5%'),marginTop:5,marginLeft:10 }} compact="true" onPress={this.forgetRouterPressed}>Forget Router</Button>
                </View>
              </View>
            </View> 
          </View>
        )
      }
    }
    render(){      
        return(
            <SafeAreaView >
              <ScrollView >
                <View style = {style.container}>
   
                    <_dialog dialogvisible={this.state.dialogvisible} />
                    <Toast visible={this.state.toastvisible} message={this.state.toastMessege} />
                    {/*this.state.animating ? <Text></Text> : this.showMainScreen()*/}  
                    <Text   style={{fontSize:hp('3%'),marginBottom:hp('1%'),textAlign:'center',width:wp('90%'), backgroundColor:blueVersion.bluish}}>{this.state.connectionStatusText}</Text>

                    <View  style={style.activityIndicator}>
                      <ActivityIndicator animating= {this.state.animating} size = 'large' >                    
                      </ActivityIndicator>
                    </View>
                    
                    {this.showMainScreen()}
                    {this.showTryAgainWifi()}
                </View>
              </ScrollView>
            </SafeAreaView>
        )
    }
}
const style = StyleSheet.create({
    container:{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60
    },
    cardWidth:{
      textAlign:"center",
      justifyContent: "center",
      backgroundColor:"#aaaaaa",

      margin:5,
      padding: 0,
      backgroundColor: blueVersion.bluish//blueVersion.secondaryGradientStart,
    },
    btnStyle:{
        width: "78%"
    },
    activityIndicator: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute'
    },
    buttonStyle:{
      justifyContent: 'center',
      alignItems: 'center',
   
    },
    imageStyleButton:{
      backgroundColor: 'transparent',
      width: hp('12%'),height:hp('12%')
    }

})
const mapStateToProps = state =>{
    return{
        savedpreference: state.savedpreferenceReducer.savedpreference,
        returnMessege: state.returnmessegeReducer.returnmessege
    }
}
const mapDispatchToProps = dispatch =>{
     return{
       savedpreferenceAdd: (savedpreference) => {
         dispatch(savedprefAction(savedpreference))
       },
       returnmessegeAdd: (returnmessege) => {
        dispatch(returnmessegeAction(returnmessege))
      }
     }
}
export default connect(mapStateToProps,mapDispatchToProps)(withNavigation(welcome))