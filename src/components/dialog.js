import React,{Component} from 'react';
import {View} from 'react-native'
import { Avatar, Button, Card, Title, Paragraph,TextInput, Portal,Dialog } from 'react-native-paper';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
export class  _dialog extends Component{
    _showDialog = () => this.setState({ dialogvisible: true });

    _hideDialog = () => this.setState({ dialogvisible: false });
  
    render() {
      return (
        <View>
          <Portal>
            <Dialog style={{backgroundColor:'#227722'}}
                dismissable={this.props.dialogdismiss}
               visible={this.props.dialogvisible}
               onDismiss={this._hideDialog}>
              <Dialog.Title>{this.props.dialogtitle}</Dialog.Title>
              <Dialog.Content>
                <Paragraph>{this.props.dialogmessege}</Paragraph>
              </Dialog.Content>
              <Dialog.Actions>
                    <Button mode="contained" style={{ backgroundColor: '#440000',flex:.4,height:hp('5%'),marginTop:5,marginLeft:10 }} compact="true" onPress={this._hideDialog}>{this.props}</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </View>
      );
    }
  
}