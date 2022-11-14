import React, { Fragment } from 'react';
import { ScrollView, StyleSheet,SafeAreaView, View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import I18n from '../../l18n/I18n';
import { Colors, fontRatio } from '../../styles/StyleSheet'
import LinearGradient from 'react-native-linear-gradient';
// @ts-ignore
import NextOff14 from '../../../assets/images/nextOff14.svg';
// @ts-ignore
import TickOff from '../../../assets/images/tickOff.svg';
// @ts-ignore
import TickON from '../../../assets/images/tickON.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import questionsObj from './questions.json';
import Slider from '@react-native-community/slider';
import { Icon } from 'react-native-elements';
import Header from './header';
import { getStatusBarHeight} from 'react-native-status-bar-height';

interface SurgeryInformationPlacementViewProps {
  navigation: StackNavigationProp<{
    "ReportAFailure": {};
  }, "ReportAFailure">; route: any;
}

interface StateProps {
  currentIndex: number;
  data: any;
  error: boolean
  singleStage: any
}

let questions = questionsObj['SurgeryInformationPlacement'];
const tmpQuestions = questionsObj['SurgeryInformationPlacement']

class SurgeryInformationPlacementView extends React.Component<SurgeryInformationPlacementViewProps, StateProps> {
  scrollView: any;
  focusListener: any;
  constructor(props: Readonly<SurgeryInformationPlacementViewProps>) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.goToNextQuestion = this.goToNextQuestion.bind(this);
    this.onSelectedValuesChange = this.onSelectedValuesChange.bind(this);
    this.pushData = this.pushData.bind(this);
    const surgeryInformationPlacement = this.props.route.params.item.surgeryInformationPlacement;
    const singleStage = this.getSingleSatgeObject(surgeryInformationPlacement);
    this.state = {
      currentIndex: 0,
      error: false,
      singleStage: {
        size: singleStage.size || 0,
        height: singleStage.height || 0
      },
      data: surgeryInformationPlacement || {
        methode: "",
        immediatePlacementCondition: [],
        boneQuality: "",
        implantPlacementLevel: "",
        placementTime: "",
        softTissueBiotype: "",
        implantPlacementProtocol: "",
        wasPrimaryStabilityAchived: "",
        ridgeAugmentation: "",
        gtrMembraneUsed: "",
        materialOfBoneGraftUsed: "",
        sinusFloorElevation: "",
        softTissueProcedures: "",
        torque: 0,
        singleStage: ""
      }
    }
  }

  getSingleSatgeObject = (surgeryInformationPlacement: any) => {
    return surgeryInformationPlacement && surgeryInformationPlacement.implantPlacementProtocol === 'Single stage' &&
      surgeryInformationPlacement.singleStage ? surgeryInformationPlacement.singleStage : {}
  }

  goBack = () => {
    if (this.state.currentIndex === 0) {
      this.props.navigation.goBack();
    } else {
      const currentIndex = this.state.currentIndex - 1;
      this.setState({
        currentIndex: currentIndex,
        error: false
      })
    }
  }

  onSelectedValuesChange = (selectedValue: any) => {
    let immediatePlacementCondition = this.state.data.immediatePlacementCondition;
    if (typeof this.state.data.immediatePlacementCondition === 'string') {
      immediatePlacementCondition = [];
      immediatePlacementCondition.push(this.state.data.immediatePlacementCondition);
    }
    const index = immediatePlacementCondition.indexOf(selectedValue);
    if (index === -1) {
      immediatePlacementCondition.push(selectedValue);
    } else {
      immediatePlacementCondition.splice(index, 1);
    }
    this.pushData("immediatePlacementCondition", immediatePlacementCondition);
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', this.scrollToTop)
  }

  componentWillUnmount() {
    this.focusListener();
  }

  scrollToTop = () => {
    this.scrollView &&
      this.scrollView.scrollTo && this.scrollView.scrollTo({ x: 0, y: 0, animated: false })
  }

  isValid = (index: number, isSkiped: boolean) => {
    let isValid = false;
    const currentQuestion = questions[index];
    if ((this.state.data[currentQuestion && currentQuestion.title] &&
      this.state.data[currentQuestion && currentQuestion.title].toString())
      || (currentQuestion && currentQuestion.isToSkipCurrentValue && isSkiped)) {
      isValid = true;
    }

    return isValid;
  }

  goToNextQuestion = () => {
    let isToShowValidationMsg = false;
    if (this.isValid(this.state.currentIndex, true)) {
      const currentIndex = this.state.currentIndex + 1;
      if (questions.length == currentIndex) {
        this.props.navigation.navigate("ReportAFailure",
          { surgeryInformationPlacement: this.state.data, nextStageNumber: '2' }
        );
      } else {
        this.setState({
          currentIndex: currentIndex
        }, () => {
          if (questions[this.state.currentIndex].title === 'implantPlacementProtocol') {
            if (this.state.data.implantPlacementProtocol === 'Two stages') {
              questions = questions.filter((item: any) => item.type !== 'singleStage');
            } else {
              questions = tmpQuestions;
            }
          }
        })

      }
      isToShowValidationMsg = false;
    } else {
      isToShowValidationMsg = true;
    }
    this.setState({
      error: isToShowValidationMsg
    })

  }
  pushData = (index: string, value: string) => {
    this.setState({
      data: { ...this.state.data, [index]: value },
      error: false
    }, () => {
      if (questions[this.state.currentIndex].type === 'selectBox' ||
        questions[this.state.currentIndex].type === 'singleStage') {
        if (index === 'implantPlacementProtocol') {
          if (value === 'Two stages') {
            questions = questions.filter((item: any) => item.type !== 'singleStage');
          } else {
            questions = tmpQuestions;
          }

        }
        this.goToNextQuestion();
      }
    });
  }

  collectSingleStageData = (index: string, value: string) => {
    this.setState({
      singleStage: { ...this.state.singleStage, [index]: value },
      error: false
    });
  }

  validateSingleStageData = () => {
    if (this.state.data.implantPlacementProtocol === 'Single stage') {
      const { size, height } = this.state.singleStage;
      if (size && height ) {
        const singleStageObj: any = {
          size,
          height
        }
        this.pushData('singleStage', singleStageObj)

      } else {
        this.setState({ error: true });
      }
    } else {
      const twoStageObj: any = { size: "", height: "" };
      this.pushData('singleStage', twoStageObj)
    }
  }

  renderFields(max: number) {
    const fields = [];
    for (let i = 0; i < max; i++) {
      const currentQuestion = questions[i];
      let isValid = this.isValid(i, false);
      if (currentQuestion.title === 'singleStage') {
        const { size, height } = this.state.singleStage;
        if (size && height) {
          isValid = true;
        } else {
          isValid = false;
        }
      } else if (currentQuestion.isToSkipCurrentValue &&
        (i === this.state.currentIndex - 1 || this.props.route.params.item.surgeryInformationPlacement)) {
        isValid = true;
      }
      fields.push(
        <TouchableOpacity key={i} style={[styles.rect, {
          backgroundColor: i === this.state.currentIndex ?
            Colors.themeColor : isValid ?
              Colors.lightGreenColor : Colors.grayColor
        }]}
          disabled={!isValid}
          onPress={() => { this.scrollToTop(); this.setState({ currentIndex: i, error: false }) }}
        />
      );
    }
    return fields;
  }

  render() {
    const currentQuestion = questions[this.state.currentIndex];
    return (
      <Fragment>
      <SafeAreaView style={styles.saveAreaBackgrounColor} />
      <SafeAreaView style={styles.saveAreaView}>
      <View style={styles.container}>
        <Header item={this.props.route.params.item} title={I18n.t('surgeryInformationPlacement')} />

        {currentQuestion && (
          <LinearGradient
            colors={[Colors.whiteColor, '#e8e8e8']}
            style={styles.linearGradient}>
            <ScrollView
              ref={ref => this.scrollView = ref}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="always"
              contentContainerStyle={styles.contentView}>
              <View style={styles.content}>
                <View style={{ alignItems: 'center' }}><Text style={[styles.sectionTitle, { fontSize: fontRatio(20), textAlign: 'center' }]}>{I18n.t(currentQuestion.title)}</Text></View>
                <View style={{ alignItems: 'flex-start' }}><Text style={[styles.text, styles.blueText, { textAlign: 'left', fontWeight: 'normal', paddingTop: 2 }]}>{currentQuestion.question}</Text></View>
                {currentQuestion.type === 'selectBox' ?
                  <View style={[styles.questionContainer, {
                    justifyContent: currentQuestion.isToAddCustomStyle ? 'center' : 'flex-start',
                  }]}>
                    {currentQuestion.answers.map((item: any, index: any) => (
                      <View key={index} style={[styles.question, {
                        width: currentQuestion.isToAddCustomStyle ? '70%' : '45%',
                      }]}>
                        <TouchableOpacity style={{
                          height: '100%',
                          width: '100%',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexDirection: 'row',
                        }} onPress={() => {
                          this.pushData(currentQuestion && currentQuestion.title, item);
                        }}>
                          <View style={{
                            flex: 3,
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            <Text style={[styles.text, {
                              fontSize: fontRatio(14),
                              paddingLeft: this.state.data[currentQuestion && currentQuestion.title] === item ? 10 : 0,
                            }]}>{item}</Text>
                          </View>
                          {
                            this.state.data[currentQuestion && currentQuestion.title] === item &&
                            <View style={{ flex: 1 }}>
                              <Icon name="check" size={fontRatio(18)} color={Colors.whiteColor} style={{ paddingLeft: 2 }} />
                            </View>
                          }
                        </TouchableOpacity>
                      </View>
                    )
                    )}
                  </View>
                  : currentQuestion.type === 'comboBox' ?
                    <View style={styles.column}>
                      <View style={styles.questionContainer}>
                        {currentQuestion.answers.map((item: any, index: any) => (
                          <View key={index} style={[styles.question, {
                            backgroundColor: this.state.data.immediatePlacementCondition.indexOf(item) === -1 ?
                              Colors.grayColor : Colors.themeColor,

                          }]}>
                            <TouchableOpacity style={{
                              height: '100%',
                              width: '100%',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }} onPress={() => this.onSelectedValuesChange(item)}>
                              <Text style={[styles.text, {
                                fontSize: fontRatio(14),
                                paddingLeft: 5,
                                paddingRight: 5,
                                color: this.state.data.immediatePlacementCondition.indexOf(item) === -1 ?
                                  Colors.blueColor : Colors.whiteColor,
                              }]}>{item}</Text>
                            </TouchableOpacity>
                          </View>
                        )
                        )}
                      </View>

                      {this.state.data.immediatePlacementCondition.length > 0 ? <TouchableOpacity onPress={this.goToNextQuestion}><TickON /></TouchableOpacity> : <TickOff />}
                    </View>
                    : currentQuestion.type === 'slider' ?
                      <View style={styles.column}>

                        <View style={[styles.questionContainer, {
                          flexDirection: 'column',
                          alignItems: 'center',
                          width: '100%',
                          justifyContent: 'center',
                        }]}>
                          <View style={{ height: fontRatio(60), justifyContent: 'flex-end' }}>
                            {this.state.data.torque ?
                              <Text style={styles.sliderNumber}>{this.state.data.torque}</Text>
                              :
                              <Text style={styles.placeholder}>{I18n.t('N-cm')}</Text>
                            }
                          </View>
                          <Slider
                            style={{ width: '100%', marginBottom: 32 }}
                            minimumValue={0}
                            maximumValue={100}
                            step={1}
                            minimumTrackTintColor={Colors.themeColor}
                            maximumTrackTintColor={Platform.OS == "android" ? Colors.themeColor : "rgba(43, 143, 255, 0.3)"}
                            thumbTintColor={Colors.themeColor}
                            value={parseInt(this.state.data.torque) || 0}
                            onValueChange={(value: any) => { this.pushData(currentQuestion.title, value) }}
                          />
                        </View>
                        {this.state.data.torque ? <TouchableOpacity onPress={this.goToNextQuestion}><TickON /></TouchableOpacity> : <TickOff />}
                      </View>
                      : currentQuestion.type === 'singleStage' ?
                        <KeyboardAvoidingView style={{ flex: 1 }}>
                          <View style={styles.column}>
                            <View style={[styles.questionContainer, {
                              flexDirection: 'column',
                              alignItems: 'center',
                              width: '100%',
                              justifyContent: 'center',
                            }]}>
                              <View style={{ justifyContent: 'flex-end' }}>
                                {this.state.singleStage.size ?
                                  <Text style={[styles.placeholder, { opacity: 1 }]}>{this.state.singleStage.size}</Text>
                                  :
                                  <Text style={styles.placeholder}>{I18n.t('size')}</Text>
                                }
                              </View>
                              <Slider
                                style={{ width: '100%' }}
                                minimumValue={0}
                                maximumValue={100}
                                step={0.5}
                                minimumTrackTintColor={Colors.themeColor}
                                maximumTrackTintColor={Platform.OS == "android" ? Colors.themeColor : "rgba(43, 143, 255, 0.3)"}
                                thumbTintColor={Colors.themeColor}
                                value={Number(this.state.singleStage.size) || 0}
                                onValueChange={(value: any) => { this.collectSingleStageData('size', value) }}
                              />
                            </View>
                            <View style={[styles.questionContainer, {
                              flexDirection: 'column',
                              alignItems: 'center',
                              width: '100%',
                              justifyContent: 'center',
                            }]}>
                              <View style={{ justifyContent: 'flex-end' }}>
                                {this.state.singleStage.height ?
                                  <Text style={[styles.placeholder, { opacity: 1 }]}>{this.state.singleStage.height}</Text>
                                  :
                                  <Text style={styles.placeholder}>{I18n.t('height')}</Text>
                                }
                              </View>
                              <Slider
                                style={{ width: '100%' }}
                                minimumValue={0}
                                maximumValue={100}
                                step={0.5}
                                minimumTrackTintColor={Colors.themeColor}
                                maximumTrackTintColor={Platform.OS == "android" ? Colors.themeColor : "rgba(43, 143, 255, 0.3)"}
                                thumbTintColor={Colors.themeColor}
                                value={Number(this.state.singleStage.height) || 0}
                                onValueChange={(value: any) => { this.collectSingleStageData('height', value) }}
                              />
                            </View>
                            {(this.state.singleStage.size && this.state.singleStage.height) ? <TouchableOpacity onPress={this.validateSingleStageData}><TickON /></TouchableOpacity> : <TickOff />}
                          </View>
                        </KeyboardAvoidingView>
                        : <View />
                }
                <View style={{ height: 30 }}>
                  {this.state.error && <Text style={styles.errorText}>{I18n.t('invalidInformation')}</Text>}
                </View>
              </View>
              <View style={styles.sectionContent}>
                {this.renderFields(questions.length)}
              </View>
            </ScrollView>
          </LinearGradient>
        )}


        <View style={{ height: 70 }}>
          <LinearGradient
            colors={[Colors.whiteColor, '#e8e8e8']}
            style={styles.footerLinearGradient}>
            <View style={styles.footer}>
              <TouchableOpacity onPress={this.goBack} style={[styles.footerContent, { alignItems: 'center' }]}><Text style={styles.back}>{I18n.t('back')}</Text></TouchableOpacity>
              {currentQuestion.isToSkipCurrentValue && <TouchableOpacity onPress={this.goToNextQuestion} style={[styles.btnContainer, { alignItems: 'center' }]}>
                <Text style={styles.text}>{I18n.t('skip')}</Text>
              </TouchableOpacity>
              }
              {currentQuestion.type === 'singleStage' ?
                <TouchableOpacity onPress={this.validateSingleStageData} style={styles.footerContent}><NextOff14 /></TouchableOpacity>
                :
                <TouchableOpacity onPress={this.goToNextQuestion} style={styles.footerContent}><NextOff14 /></TouchableOpacity>
              }
            </View>
          </LinearGradient>
        </View>
      </View>
      </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.themeColor,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
  linearGradient: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1.5,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.23,
    shadowRadius: 15,
    elevation: 4,
  },
  contentView: {
    width: '100%',
    alignItems: 'center',
    flexGrow: 1
  },
  content: {
    flex: 1,
    width: '90%',
    flexDirection: 'column',
    marginTop: 18,
    marginBottom: 24,

  },
  footerLinearGradient: {
    flex: 1,
    shadowColor: 'rgba(0, 0, 0, 0.16)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.23,
    shadowRadius: 15,
    elevation: 4,
  },
  footer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  back: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '300',
    fontStyle: 'normal',
    textAlign: 'center',
    color: Colors.blueColor,
    paddingLeft: 15
  },
  footerContent: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
  },
  flex: {
    flex: 1
  },
  text: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '300',
    fontStyle: 'normal',
    color: Colors.whiteColor,
    textAlign: 'center',
  },
  blueText: {
    color: Colors.blueColor
  },
  rect: {
    backgroundColor: Colors.grayColor,
    width: 15,
    height: 15,
    borderRadius: 5,
    marginRight: 8,
    marginBottom: 8,
    flexWrap: 'wrap'
  },
  sectionTitle: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: 'bold',
    fontStyle: 'normal',
    color: Colors.themeColor,
    textAlign: 'left',
    paddingBottom: 7
  },
  sectionContainer: {
    flexDirection: 'column',
    marginBottom: 50,
  },
  sectionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    alignSelf: 'flex-start',
    marginLeft: 15,
    marginBottom: 24
  },
  questionContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
    alignContent: 'center',
    paddingTop: 32,
  },
  question: {
    width: '45%',
    height: 53,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.29,
    shadowRadius: 4.65,
    elevation: 7,
    marginRight: '5%',
    marginBottom: 16,
    backgroundColor: Colors.themeColor
  },
  btnContainer: {
    backgroundColor: Colors.themeColor,
    width: 90,
    height: 53,
    borderRadius: 25,
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.23,
    shadowRadius: 10,
    alignContent: 'center',
    justifyContent: 'center',
    marginRight: 0,
    marginLeft: 10
  },
  sliderNumber: {
    fontFamily: 'System',
    fontSize: fontRatio(50),
    fontWeight: '300',
    fontStyle: 'normal',
    color: Colors.blueColor,
    textAlign: 'center',
  },
  placeholder: {
    fontFamily: 'System',
    fontSize: fontRatio(14),
    fontWeight: '300',
    fontStyle: 'normal',
    color: '#222f3e',
    textAlign: 'center',
    opacity: 0.6,
  },
  inputRow: {
    flex: 1.5,
    flexDirection: 'row',
    position: 'relative'
  },
  errorText: {
    fontFamily: 'System',
    color: '#FF0000',
    fontSize: fontRatio(14),
    paddingBottom: 10,
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1
  }
});

export default SurgeryInformationPlacementView;