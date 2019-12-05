import React,{Component} from 'react';
import { View,Text, ActivityIndicator, StyleSheet,PermissionsAndroid,Modal,TouchableOpacity } from 'react-native';
import SSidPassModal from '../components/ssidPassModal';
import {connect} from 'react-redux';
import {ssidModalAction} from '../redux/actions/ssidModalAction';
import dgram from 'react-native-udp';
import wifi from 'react-native-android-wifi';
import { Button, Portal, Avatar } from 'react-native-paper';
import { NetworkInfo } from "react-native-network-info";
import AsyncStorage from '@react-native-community/async-storage';
import blueVersion from '../styles/colors';


class settings extends Component{
    state = {
        ssid: "",
        password: "",
        visible: false,
        returnMessege: ''
    }
    _showModal = () => {
        this.props.addVisible(true)
        //this.setState({ visible: true })
    };
    _hideModal = () => this.setState({ visible: false });

    getStoreData = async () => {
        try {
          const value1 = await AsyncStorage.getItem('@ssid')
          const value2 = await AsyncStorage.getItem('@password')
          console.log("get storage data")
          console.log(value1)
          if(value1 !== null) {
            this.setState({
                ssid: value1,
                password: value2
            })
          }
        } catch(e) {
            console.log("cant get data")
          // error reading value
        }
      }
    componentDidMount(){
        console.log("settings ins")
        this.getStoreData();
    }
    async checkDeviceisConToRouter(){
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            'title': 'Wifi networks',
            'message': 'We need your permission in order to find device'
          }
        )
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Thank you for your permission :)");
          wifi.setEnabled(true);
          wifi.isEnabled((isEnabled) => {
            if (isEnabled) {
              console.log("wifi service enabled");
              NetworkInfo.getIPV4Address().then(ipAdd => {
                console.log(ipAdd);
                this.getBroadcast(ipAdd,function(remoteHost){
                  console.log("broadcast ip val -- ",remoteHost)
                  let socket;
                  socket = dgram.createSocket('udp4')
                  socket.bind(9999)//8888)
            
                  const remotePort = 9999;
                    socket.once('listening', function() {
                        var obj = "initial";
                        var uint = new Uint8Array(8);
                        for (var i = 0, l = 8; i < l; i++){
                            uint[i] = obj.charCodeAt(i);
                        }
                      var buf = new Uint8Array(uint)
                      socket.send(buf, 0, buf.length, remotePort, remoteHost, function(err) {
                        if (err) throw err
                        console.log('message was sent')
                        setTimeout(() => {
                          console.log("inside SetTimeout")
                          console.log(this.state.initMesseage);
                          if(this.state.initMesseage === "Init"){            
                          }
                          else{
                            console.log("no messega recieved")
                            socket.close()
                            this.connectDirect()
                          }
                        }, 3000)
                      
                      }.bind(this))
                    }.bind(this))                    
                    socket.on('message', function(msg, rinfo) {
                      if(rinfo.address != ipAdd){
                        var str = String.fromCharCode.apply(null, new Uint8Array(msg));
                        
                        console.log('messege -- ' + str + ' -' + JSON.stringify(rinfo));
                        this.setState({initMesseage: str,IOTdeviceIp: rinfo.address})
                        console.log('message ws receivd', msg);
                        socket.close()
                      }                      
                    }.bind(this))
                }.bind(this))
              });
            } else {
              console.log("wifi service is disabled");
            }
          });

        } else {
          console.log("You will not able to retrieve wifi available networks list");
        }
      } catch (err) {
        console.warn(err)
      }
    }

    readerModal =() =>{
        if(this.props.visible){
            return(
                <Portal>
                    <SSidPassModal/>
                </Portal>
            )
        }
        return <Text></Text>
    }
    render(){
        return(
            <View style={styels.container}>
                {this.readerModal()}
                <View style={{backgroundColor:blueVersion.bluish, width:'90%'}}>
                  <Text style={{textAlign:'center', marginBottom:10,fontSize:25,color:'#cc1111'}}>{this.props.returnMessege}</Text>
                </View>
                <Text style={{margin:30, fontSize:20,color:'#1111ee'}} >Click to Change Settings</Text>
                <TouchableOpacity onPress={this._showModal}
                  style={{
                      borderWidth:1,
                      borderColor:'rgba(0,0,0,0.2)',
                      alignItems:'center',
                      justifyContent:'center',
                      width:200,
                      height:200,
                      backgroundColor:'#1122ff',
                      borderRadius:100,
                    }}
                >
                  <Avatar.Icon icon="wifi"  size={130} color="#01a699" />
                </TouchableOpacity>
            </View>
        )
        
    }
}
const styels = StyleSheet.create({
   container:{
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
   },
    txtCol:{
        color:'#880000'
    }
})
mapStateToProps = state =>{
    return{
        visible: state.ssidModalReducer.ssid_modal_visible,
        savedpreference: state.savedpreferenceReducer.savedpreference,
        returnMessege: state.returnmessegeReducer.returnmessege
    }
}
mapDispatchToProps = Dispatch =>{
    return{
        addVisible: (value) =>{
            Dispatch(ssidModalAction(value))
        }
    }
}

export default connect(mapStateToProps,mapDispatchToProps) (settings)