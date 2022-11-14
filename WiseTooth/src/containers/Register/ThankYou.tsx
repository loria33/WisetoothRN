import React, {Component,Fragment} from 'react';
import {View, StyleSheet, Text,SafeAreaView,Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
// @ts-ignore
import Wiseplant from '../../../assets/images/wiseplant.svg';
// @ts-ignore
import Login from '../../../assets/images/login.svg';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors } from '../../styles/StyleSheet';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { LoginStackParamList }  from "../../Models/AuthStackModel";
import { RouteProp } from '@react-navigation/native';
import { getStatusBarHeight} from 'react-native-status-bar-height';

interface ThankYouProps {
  navigation: StackNavigationProp<LoginStackParamList, "ThankYou">,
  route: RouteProp<LoginStackParamList, "ThankYou">
}

class ThankYou extends Component<ThankYouProps> {

  constructor(props: any) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.goBack = this.goBack.bind(this);
  }

  onSubmit() {
    this.props.navigation.navigate("Login", {values: this.props.route.params.values});
  }

  goBack() {
    this.props.navigation.goBack();
  }

  render() {
    return (
      <Fragment>
      <SafeAreaView style={styles.saveAreaBackgrounColor} />
      <SafeAreaView style={styles.saveAreaView}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Wiseplant width={120} height={140} />
          <Text style={styles.mainText}>Thank you for signing up! You may now log in </Text>
        </View>
        <LinearGradient colors={[Colors.whiteColor, '#e8e8e8']} style={styles.rectangle}>
          <TouchableOpacity style={{marginTop: 15}} onPress={this.onSubmit}>
              <Login />
          </TouchableOpacity>
        </LinearGradient>
        </View>
      </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.themeColor
  },
  saveAreaBackgrounColor: {
    flex: 0,
    backgroundColor: Colors.themeColor,
  },
  saveAreaView: {
      flex: 1,
      backgroundColor: '#e8e8e8',
      paddingTop: Platform.OS === 'android' ?  getStatusBarHeight() : 0 ,
  },
  logoContainer: {
    flex: 14,
    width: "100%",
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.themeColor,
  },
  mainText: {
    width: 170,
    marginTop: 25,
    fontFamily: "Roboto",
    fontSize: 14,
    textAlign: "center",
    color: "#ffffff"
  },
  rectangle: {
    flex: 2,
    justifyContent: 'center',
    borderTopRightRadius: 32,
    borderTopLeftRadius: 32,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
    elevation: 5,
  }
});

export default ThankYou;
