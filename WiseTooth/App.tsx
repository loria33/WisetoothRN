import React, { Component } from 'react';
import { Provider } from 'react-redux';
import AppContainer from './src/containers/RootContainer';
import createStore from './src/redux/store';
import './src/config/ReactotronConfig';
import { PersistGate } from 'redux-persist/integration/react';
import { StatusBar, LogBox } from 'react-native';
import codePush from "react-native-code-push";
import { Colors } from './src/styles/StyleSheet'
import FlashMessage from "react-native-flash-message";

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested',
])

const { store, persistor } = createStore();
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <StatusBar translucent backgroundColor={Colors.themeColor} barStyle="light-content" />
          <AppContainer />
          
        </PersistGate>
      </Provider>
    );
  }
}

const codePushOptions = { 
  updateDialog: true, 
  installMode: codePush.InstallMode.IMMEDIATE, 
  checkFrequency: codePush.CheckFrequency.ON_APP_RESUME 
}; 

export default codePush(codePushOptions)(App);

