import React, { Fragment,Component } from 'react';
import {View, Text, StyleSheet,SafeAreaView, StatusBar, Dimensions,Platform} from 'react-native';
import { Colors } from '../../styles/StyleSheet';
import Header from '../../components/Header';
// @ts-ignore
import Yes from '../../../assets/images/yes.svg';
// @ts-ignore
import No from '../../../assets/images/no.svg';
import { StackNavigationProp } from '@react-navigation/stack';
import { TouchableOpacity } from 'react-native-gesture-handler';
import I18n from '../../l18n/I18n';
import LinearGradient from 'react-native-linear-gradient';
import { CreateImplantParamList } from '../../Models/CreateImplantStackModel';
import { RouteProp } from '@react-navigation/native';
import { getStatusBarHeight} from 'react-native-status-bar-height';

interface NewImplantProps {
  navigation: any;
  route: RouteProp<CreateImplantParamList, "NewImplant">;
}


class NewImplant extends Component<NewImplantProps> {

  constructor(props: any) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.navigation.navigate('SelectToothNumber', {isBackFromNewImplant: true});
  }


  render() {
    const btnWidth = Dimensions.get("window").width * 0.5;
    const btnHeight = Dimensions.get("window").height * 0.5;
    return (
      <Fragment>
      <SafeAreaView style={styles.saveAreaBackgrounColor} />
      <SafeAreaView style={styles.saveAreaView}>
        <View style={styles.mainContainer}>
          <StatusBar translucent backgroundColor={Colors.whiteColor} barStyle="light-content"  />
          <Header title={"New Implant"} navigation={this.props.navigation} />
          <View style={styles.mainContainer}>
            <Text style={styles.mainText}>Would you like to enter another implant?</Text>
            <View style={{flex: 2, flexDirection: "row", alignItems: "center", flexGrow: 6}}>
              <TouchableOpacity disabled={this.props.route.params.implants.length > 32 ? true : false} onPress={() => {
                this.props.navigation.navigate("ScanImplant", {
                  ...this.props.route.params,
                  implants: this.props.route.params.implants,
                  implantPhoto: this.props.route.params.implantPhoto
                })
              }}>
                <Yes width={btnWidth} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {
                this.props.navigation.navigate("CreateImplantPatientInformation", {
                  ...this.props.route.params
                })
              }}>
                <No width={btnWidth} />
              </TouchableOpacity>  
            </View>
            <View style={styles.bottom}>
              <LinearGradient colors={[Colors.whiteColor, '#e8e8e8']} style={[styles.bottomsRow, styles.shadow]}>
                <TouchableOpacity onPress={this.goBack}>
                    <Text style={styles.back}> {I18n.t("back")} </Text>
                </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "space-between", 
    backgroundColor: Colors.whiteColor
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
  mainText: {
    fontFamily: "Roboto",
    fontSize: 14,
    marginTop:15,
    marginLeft: 15,
    textAlign: "left",
    color: Colors.blueColor
  },
  bottomsRow: {
    backgroundColor: "red",
    width: "100%",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    //alignSelf: "flex-end",
    height: 85,
    //paddingBottom: -10
    //flexGrow: 0
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.38,
    shadowRadius: 16.00,
    elevation: 24,
  },
  back: {
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "300",
    textAlign: "center",
    color: Colors.blueColor,
    marginTop: 25,
    marginLeft: 30
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end"
  }
  
});


export default NewImplant;
