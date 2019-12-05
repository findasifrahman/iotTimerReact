import React from 'react';
import {
  SafeAreaView,
} from 'react-native';
import { DefaultTheme,Provider as PaperProvider } from 'react-native-paper';
import { Provider } from 'react-redux';

import AppView from './src/navigator/AppViewContainer';
import blueVersion from './src/styles/colors';
import configureStore from './src/redux/store';
const store = configureStore()

const theme = {
  ...DefaultTheme,
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
    primary: blueVersion.primary,
    accent: blueVersion.blue,
    text: blueVersion.black,
    background: "#ffffff",
    contained: '#000000'
  },
  dark: true
};
function App(){
  return(
      <Provider store={store}>
        <PaperProvider theme={theme}> 
          <AppView></AppView>
        </PaperProvider>
      </Provider>
 
  )
}

export default App;