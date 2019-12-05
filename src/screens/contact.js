import React from 'react';
import { View,Text,StyleSheet } from 'react-native';

export default function contact(){
    return(
        <View style={styles.container}>
            <Text style={{fontFamily:'Roboto', fontSize:25,color:'#999999'}}>Developed By Intricate Lab</Text>
            <Text style={{fontFamily:'Roboto', fontSize:20,color:'#999999'}}>@www.intricatelab.com</Text>
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      width:'100%',
      alignItems: 'center',
      justifyContent: 'space-around',
    },

})