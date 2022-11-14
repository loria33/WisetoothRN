import React, { Fragment } from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, ScrollView, Dimensions, TextInput, Alert, Platform } from 'react-native';
import I18n from '../../l18n/I18n';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Header from '../../components/Header';
// @ts-ignore
import NextOn24 from '../../../assets/images/nextOn24.svg';
// @ts-ignore
import Line from '../../../assets/images/line.svg';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, fontRatio } from '../../styles/StyleSheet';
import { StackNavigationProp } from '@react-navigation/stack';
// @ts-ignore
import WhiteSerial from '../../../assets/images/whiteSerial.svg';
// @ts-ignore
import Tooth from '../../../assets/images/tooth.svg';
import { CreateImplantParamList } from '../../Models/CreateImplantStackModel';
import { RouteProp } from '@react-navigation/native';
import { getStatusBarHeight } from 'react-native-status-bar-height';

interface SelectToothNumberProps {
  navigation: any,
  route: RouteProp<CreateImplantParamList, "SelectToothNumber">;
}
interface StateProps {
  toothNumber: string,
  toothNumbersLowerViews: JSX.Element[],
  toothNumbersUpperViews: JSX.Element[]
}

const shapeWidth = Dimensions.get('window').width * 0.7;
const radius = shapeWidth / 2;
class SelectToothNumber extends React.Component<SelectToothNumberProps, StateProps> {
  input: any;
  private prevIndex: number;
  private prevI: number;
  private initializedLowerViews: boolean;
  private initializedUpperViews: boolean;
  private toothNumbersLowerViews: JSX.Element[];
  private toothNumbersUpperViews: JSX.Element[];
  private upper: boolean;

  constructor(props: Readonly<SelectToothNumberProps>) {
    super(props);
    this.state = {
      toothNumber: "",
      toothNumbersLowerViews: [],
      toothNumbersUpperViews: [],
    }
    this.goBack = this.goBack.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.selectLowerToothNumber = this.selectLowerToothNumber.bind(this);
    this.selectUpperToothNumber = this.selectUpperToothNumber.bind(this);
    this.initializedLowerViews = false;
    this.initializedUpperViews = false;
    this.toothNumbersLowerViews = [];
    this.toothNumbersUpperViews = []
    this.prevIndex = -1;
    this.prevI = -1;
    this.upper = true;
  }

  componentWillUnmount() {
  }

  goBack() {
    const { isBackFromNewImplant, implants } = this.props.route.params || {};
    if (isBackFromNewImplant) {
      this.props.navigation.navigate('ScanImplant', { implants });
    } else {
      this.props.navigation.goBack();
    }

  }

  checkImplants = () => {
    if (this.props.route.params.implants?.length > 0) {
      this.props.navigation.navigate("CreateImplantPatientInformation", {
        ...this.props.route.params
      })
    } else {
      this.props.navigation.navigate('Implants Statistics');
    }
  }

  goBackConfirmation = (msg: string) => {
    Alert.alert('', msg, [
      {
        text: 'No',
        onPress: () => this.checkImplants(),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: () => this.goBack(),
      },
    ]);
  }

  onSubmit() {
    if (this.state.toothNumber) {
      var toothNumber = parseInt(this.state.toothNumber);
      if (toothNumber < 49 && toothNumber > 10) {
        const implants = this.props.route.params.implants;
        const lastIndex = implants.length - 1;
        const lastImplant = implants[lastIndex];
        const isDuplicateToothNum = lastImplant.toothNumList.indexOf(toothNumber) !== -1 || lastImplant.toothNumList.indexOf(toothNumber.toString()) !== -1;
        if (!lastImplant.new && isDuplicateToothNum) {
          if (!lastImplant.hasFailure) {
            Alert.alert('', "Are you reporting a failure", [
              {
                text: 'No',
                onPress: () => {
                  implants.splice(lastIndex, 1);
                  this.goBackConfirmation(I18n.t('sameImplantCreatedMsg'))
                },
                style: 'cancel',
              },
              {
                text: 'Yes',
                onPress: () => {
                  const implant = lastImplant;
                  const tempImplants = [...implants];
                  tempImplants.splice(lastIndex, 1);
                  this.props.navigation.navigate('ReportAFailure', {
                    date: Date.now(),
                    id: implant.installId,
                    toothNum: this.state.toothNumber,
                    serialNum: implant.implantLabel,
                    manufacturerModel: implant.ManufacturerModel,
                    nextStageNumber: '1',
                    isBackToPatientInformation: tempImplants && tempImplants.length > 0 ? true : false,
                    routeParams: this.props.route.params
                  });
                },
              },
            ]);
          } else {
            implants.splice(lastIndex, 1);
            this.goBackConfirmation(I18n.t('sameImplantReportedMsg'));
          }
        } else {
          lastImplant.toothNum = this.state.toothNumber;
          lastImplant.toothNumList.push(this.state.toothNumber);
          const tempImplants = [...implants];
          tempImplants.splice(lastIndex, 1);
          const found = tempImplants.some((item: any) =>
            item.implantLabel === lastImplant.implantLabel &&
            item.lot === lastImplant.lot &&
            Number(item.length) === Number(lastImplant.length) &&
            Number(item.diameter) ===  Number(lastImplant.diameter) &&
            (item.toothNumList.indexOf(this.state.toothNumber) !== -1 || item.toothNumList.indexOf(this.state.toothNumber.toString()) !== -1)
          );
          if (found) {
            implants.splice(lastIndex, 1);
            Alert.alert('', I18n.t('implantAlreadyExitMsg'), [
              {
                text: 'OK', onPress: () => this.goBack(),
              },
            ]);
          } else {
            this.props.navigation.navigate("NewImplant", {
              ...this.props.route.params,
              implants: implants
            });
          }
        }
      } else {
        Alert.alert('', I18n.t('vaildToothNumber'), [
          {
            text: 'Ok',
          },
        ]);
      }
    }
  }

  degToRad = (deg: number) => {
    return deg * Math.PI / 180;
  }
  getLeft(r: number, a: any, delta: number) {
    return r * Math.cos(this.degToRad(a)) + r + delta;
  }

  getTop(r: number, a: any) {
    return r * Math.sin(this.degToRad(a)) + r - 30;
  }

  clearPreviousSelectedTooths() {
    if (this.upper) {
      this.toothNumbersUpperViews[this.prevIndex] = this.getUpperTeethNumberView(this.prevI, this.prevIndex);
      this.setState({ toothNumbersUpperViews: [...this.toothNumbersUpperViews] });
    } else {
      this.toothNumbersLowerViews[this.prevIndex] = this.getLowerTeethNumberView(this.prevI, this.prevIndex);
      this.setState({ toothNumbersLowerViews: [...this.toothNumbersLowerViews] });
    }
  }

  selectLowerToothNumber(i: number, index: number) {
    this.setState({ toothNumber: i + '' }, () => {
      this.toothNumbersLowerViews[index] = this.getLowerTeethNumberView(i, index);
      if (this.prevIndex != -1) {
        this.clearPreviousSelectedTooths();
      }
      this.setState({ toothNumbersLowerViews: [...this.toothNumbersLowerViews] });

      this.upper = false;
      this.prevIndex = index;
      this.prevI = i;
    });


  }

  selectUpperToothNumber(i: number, index: number) {
    this.setState({ toothNumber: i + '' }, () => {
      this.toothNumbersUpperViews[index] = this.getUpperTeethNumberView(i, index);
      if (this.prevIndex != -1) {
        this.clearPreviousSelectedTooths();
      }
      this.setState({ toothNumbersUpperViews: [...this.toothNumbersUpperViews] });

      this.upper = true;
      this.prevIndex = index;
      this.prevI = i;
    });


  }

  getUpperTeethNumberView(i: number, index: number): JSX.Element {
    return (<View
      key={index}
      style={
        {
          left: this.getLeft(radius, index >= 8 ? 0 - (index - 8) * 13 : 180 + index * 13, index >= 8 ? 10 : -30),
          top: this.getTop(radius, index >= 8 ? 0 - (index - 8) * 13 : 180 + index * 13),
          position: 'absolute',
        }}
    >
      <TouchableOpacity
        style={
          [this.state.toothNumber === i + '' ? styles.selected : {}, styles.toothNumberContainer]
        }
        onPress={() => this.selectUpperToothNumber(i, index)}><Text style={[styles.toothNumber,
        this.state.toothNumber === i + '' ? { color: Colors.whiteColor, opacity: 1 } : {}]}>{i}</Text>
      </TouchableOpacity>
    </View>)
  }


  getLowerTeethNumberView(i: number, index: number): JSX.Element {
    return (<View
      key={index}
      style={
        {
          left: this.getLeft(radius, index >= 8 ? 0 - (index - 8) * 13 : 180 + index * 13, index >= 8 ? 10 : -30),
          bottom: this.getTop(radius, index >= 8 ? 0 - (index - 8) * 13 : 180 + index * 13),
          position: 'absolute',
        }}
    >
      <TouchableOpacity
        style={
          [this.state.toothNumber === i + '' ? styles.selected : {}, styles.toothNumberContainer]
        }
        onPress={() => this.selectLowerToothNumber(i, index)}><Text style={[styles.toothNumber,
        this.state.toothNumber === i + '' ? { color: Colors.whiteColor, opacity: 1 } : {}]}>{i}</Text>
      </TouchableOpacity>
    </View>)
  }

  fillLowerToothNumbersViews() {
    if (!this.initializedLowerViews) {
      {
        [48, 47, 46, 45, 44, 43, 42, 41, 38, 37, 36, 35, 34, 33, 32, 31].forEach((i: number, index: number) => (
          this.toothNumbersLowerViews.push(
            this.getLowerTeethNumberView(i, index)
          )
        ))
      }
      this.setState({ toothNumbersLowerViews: this.toothNumbersLowerViews });
      this.initializedLowerViews = true;
    }
  }

  fillUpperToothNumbersViews() {
    if (!this.initializedUpperViews) {
      {
        [18, 17, 16, 15, 14, 13, 12, 11, 28, 27, 26, 25, 24, 23, 22, 21].forEach((i: number, index: number) => (
          this.toothNumbersUpperViews.push(
            this.getUpperTeethNumberView(i, index)
          )
        ))
      }
      this.setState({ toothNumbersUpperViews: this.toothNumbersUpperViews });
      this.initializedUpperViews = true;
    }
  }

  render() {

    this.fillLowerToothNumbersViews();
    this.fillUpperToothNumbersViews();
    return (
      <Fragment>
        <SafeAreaView style={styles.saveAreaBackgrounColor} />
        <SafeAreaView style={styles.saveAreaView}>
          <View style={styles.mainContainer}>
            <StatusBar translucent backgroundColor={Colors.whiteColor} barStyle="light-content" />
            <Header title={I18n.t('toothNumber')} navigation={this.props.navigation} style={{ paddingBottom: 10 }} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
              <View style={styles.contentContainer}>
                <View style={styles.header}>
                  <Text style={styles.title}>{I18n.t('selectToothNumberTitle')}</Text>
                  <View style={styles.serialContainer}>
                    <WhiteSerial width={12} height={13} style={{ marginTop: 5, marginHorizontal: 3 }} />
                    <Text style={{ fontFamily: "Roboto", fontSize: 16, color: Colors.whiteColor }}> {this.props.route.params.implants[this.props.route.params.implants.length - 1] && this.props.route.params.implants[this.props.route.params.implants.length - 1].implantLabel} </Text>
                  </View>
                </View>
                <View style={styles.toothContainer}>
                  <View>
                    <View style={styles.halfCircleParent}>
                      <View style={styles.halfCircle} />
                    </View>
                    <Line style={{ position: 'absolute', top: -(73 / 2), left: shapeWidth / 2 }} height={73} />
                    <View style={{ position: 'absolute', top: '40%', left: (shapeWidth / 2) - 30 }}>
                      <Text style={styles.toothText}>{I18n.t('upperTeeth')}</Text>
                    </View>
                    {this.state.toothNumbersUpperViews}
                  </View>
                  <View style={{ width: '50%', alignItems: 'center', alignSelf: 'center' }}>
                    <View
                      style={
                        styles.inputWrap
                      }>
                      <View style={{ marginBottom: 10, marginLeft: 10 }}>
                        <Tooth />
                      </View>
                      <TextInput
                        placeholder={I18n.t('toothNumber')}
                        maxLength={2}
                        keyboardType='numeric'
                        underlineColorAndroid="transparent"
                        onChangeText={(text: any) => {
                          this.clearPreviousSelectedTooths();
                          this.setState({
                            toothNumber: text
                          })
                        }}
                        placeholderTextColor="rgba(0, 65, 124, 0.6)"
                        value={this.state.toothNumber}
                        style={[this.state.toothNumber ? styles.input : styles.placeholder, styles.textInput]}
                        onSubmitEditing={this.onSubmit}
                        autoCorrect={false}
                        returnKeyType="go"
                        autoCapitalize="none"
                      />

                    </View>
                  </View>
                  <View>
                    <View style={[styles.halfCircleParent, { transform: [{ rotate: '180deg' }] }]}>
                      <View style={[styles.halfCircle]} />
                    </View>
                    <Line style={{ position: 'absolute', bottom: -(73 / 2), left: (shapeWidth / 2) }} />
                    <View style={{ position: 'absolute', bottom: '40%', left: (shapeWidth / 2) - 30 }}>
                      <Text style={styles.toothText}>{I18n.t('lowerTeeth')}</Text>
                    </View>
                    {this.state.toothNumbersLowerViews}
                  </View>
                </View>
              </View>
            </ScrollView>
            <View style={{ height: 70 }}>
              <LinearGradient colors={[Colors.whiteColor, '#e8e8e8']} style={[styles.bottomsRow, styles.shadow]}>
                <TouchableOpacity onPress={this.goBack}>
                  <Text style={styles.back}> {I18n.t("back")} </Text>
                </TouchableOpacity>
                {this.state.toothNumber ?
                  <TouchableOpacity onPress={this.onSubmit}><NextOn24 /></TouchableOpacity>
                  :
                  <View style={{ opacity: 0.5 }}><NextOn24 /></View>
                }
              </LinearGradient>
            </View>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  saveAreaBackgrounColor: {
    flex: 0,
    backgroundColor: Colors.themeColor,
  },
  saveAreaView: {
    flex: 1,
    backgroundColor: '#e8e8e8',
    paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
  },
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.whiteColor,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    flexDirection: "column",
  },
  bottomsRow: {
    backgroundColor: "red",
    width: "100%",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
  },
  serialContainer: {
    backgroundColor: Colors.themeColor,
    flexDirection: "row",
    alignSelf: 'baseline',
    padding: 4,
    marginTop: 10,
    borderRadius: 5,
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
  header: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 32,
    paddingLeft: '8%',
  },
  title: {
    paddingTop: 10,
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: 'normal',
    fontStyle: 'normal',
    color: Colors.blueColor,
    textAlign: 'left',
  },
  toothContainer: {
    alignItems: 'center',
    marginBottom: 32,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  toothNumber: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '300',
    fontStyle: 'normal',
    textAlign: 'center',
    color: Colors.blueColor,
    opacity: 0.6,
    width: '100%',
    height: '100%',
  },
  toothText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '300',
    fontStyle: 'normal',
    textAlign: 'center',
    color: Colors.blueColor,
    opacity: 0.6,
  },
  halfCircleParent: {
    width: shapeWidth,
    height: shapeWidth / 2,
    overflow: "hidden",
  },
  halfCircle: {
    borderRadius: radius,
    width: shapeWidth,
    height: shapeWidth,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Colors.themeColor,
    borderWidth: 2,
    borderBottomWidth: 0,
    position: 'relative',
  },
  input: {
    marginRight: 20,
    fontSize: fontRatio(50),
    fontWeight: '100',
    opacity: 1,
  },
  placeholder: {
    marginRight: 20,
    fontSize: fontRatio(14),
    fontWeight: '300',
    opacity: 0.6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderColor: '#9B9B9B',
    borderBottomWidth: 1,
  },
  textInput: {
    height: fontRatio(70),
    alignItems: 'center',
    alignSelf: 'center',
    paddingBottom: 0,
    marginBottom: 0,
    paddingHorizontal: 10,
    width: '80%',
    color: Colors.blueColor,
    textAlign: 'center',
    fontFamily: 'System',
    fontStyle: 'normal',
  },
  toothNumberContainer: {
    width: 25,
    height: 25,
  },
  selected: {
    backgroundColor: Colors.themeColor,
    borderRadius: 25 / 2,
    paddingTop: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
export default SelectToothNumber;
