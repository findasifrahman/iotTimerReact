import React,{useState,useCallback,Component} from 'react';
import { View,Text, ImageBackground, StyleSheet } from 'react-native';
import {connect} from 'react-redux';
import {loginAction} from '../redux/actions/loginAction';
import blueVersion from '../styles/colors';
import { Avatar, Button, Card, Title, Paragraph,TextInput, withTheme } from 'react-native-paper';
class login extends Component{
    state = {
        emailtext: '',
        passwordtext: '',
        loginState: ''
    };
    PressNavigate = () => {
       let myobj = {
           username: this.state.emailtext,
           logState: 'true'
       }
       this.props.loginObjAdd(myobj);
       this.props.navigation.navigate('welcome')
    }
    render(){
        const { colors } = this.props.theme;
        return(
            
            <View style={styles.container}>
                <ImageBackground
                    source={require('../../assets/images/background.png')}
                    style={styles.bgImage}
                    resizeMode="cover"
                    >
                    <View style={styles.container2}>
                        <Card style={styles.cardWidth}>
                            <Card.Title title="Login" subtitle="Dupno tracker" left={(props) => <Avatar.Icon {...props} icon="folder" />} />
                            <Card.Content>
                                <TextInput
                                    label='Email'
                                    value={this.state.emailtext}
                                    onChangeText={emailtext => this.setState({ emailtext })}
                                    mode='outlined'
                                />
                                <TextInput
                                    label='Password'
                                    value={this.state.passwordtext}
                                    onChangeText={passwordtext=> this.setState({ passwordtext })}
                                    mode='outlined'
                                />
                            </Card.Content>

                            <Card.Actions>
                                <Button mode="contained" style={{ backgroundColor: colors.primary, width: '100%' }} compact="true" onPress={this.PressNavigate} dark="true">Ok</Button>
                            </Card.Actions>
                        </Card>
                    </View>

                </ImageBackground>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      width:'100%',
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
       margin:20,
       backgroundColor: blueVersion.primaryLight,
    },
    btnStyle:{
        width: "78%"
    },
    bgImage: {
      flex: 1,
      marginHorizontal: -20,
      width: '100%', height: '100%',
      resizeMode: 'stretch'
    },
    section: {
      flex: 1,
      paddingHorizontal: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    sectionLarge: {
      flex: 2,
      justifyContent: 'space-around',
    },
    sectionHeader: {
      marginBottom: 8,
    },
    priceContainer: {
      alignItems: 'center',
    },
    description: {
      padding: 15,
      lineHeight: 25,
    },
    titleDescription: {
      color: '#19e7f7',
      textAlign: 'center',
      fontFamily: 'Roboto',
      fontSize: 15,
    },
    title: {
      marginTop: 30,
    },
    price: {
      marginBottom: 5,
    },
    priceLink: {
      borderBottomWidth: 1,
      borderBottomColor: blueVersion.primary,
    },
  });

  const mapStateToProps = state => {
      return{
          emailtext: state.loginStateReducer.username,
          loginState: state.loginStateReducer.logState
      }
  } 
  const mapDispatchToProps = dispatch => {
      return{
          loginObjAdd: (loginObj) =>{
            dispatch(loginAction(loginObj))
          }
      }
  }
  export default connect(mapStateToProps,mapDispatchToProps)(withTheme(login))