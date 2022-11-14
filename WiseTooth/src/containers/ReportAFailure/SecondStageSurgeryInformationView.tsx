import React, { Fragment } from 'react';
import { ScrollView, StyleSheet, SafeAreaView,View, Text, Keyboard, Dimensions, ActivityIndicator, Platform } from 'react-native';
import I18n from '../../l18n/I18n';
import { Colors, fontRatio } from '../../styles/StyleSheet'
import LinearGradient from 'react-native-linear-gradient';
// @ts-ignore
import NextOff34 from '../../../assets/images/nextOn34.svg';
// @ts-ignore
import TickOff from '../../../assets/images/tickOff.svg';
// @ts-ignore
import TickON from '../../../assets/images/tickON.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import questionsObj from './questions.json';
import Input from '../../components/Input';
import moment from 'moment';
import Slider from '@react-native-community/slider';
import { CheckBox, colors, Icon } from 'react-native-elements'
import { getStatusBarHeight} from 'react-native-status-bar-height';

import Header from './header';
import {
  stripLeadingZerosDate,
  checkIfNumberKeyPressed,
  validateDate
} from '../../utils/helpers';
import Picker from '../../components/Picker';
import { connect } from 'react-redux';
import * as userActions from '../../redux/actions/user';

interface SecondStageSurgeryInformationViewProps {
  navigation: StackNavigationProp<{
    "ReportAFailure": {};
  }, "ReportAFailure">; route: any;
  getManufactures: () => void;
  manufactures: any;
}
interface StateProps {
  currentIndex: number;
  data: any;
  date: any;
  error: boolean;
  isNotMeasuredChecked: boolean;
  isSameManufacturerAsImplant: boolean;
  showMenu: boolean;
  dateError: string
}

interface Inputs {
  day: any;
  month: any;
  year: any;
  inputRef: any;
}
const input: Inputs = { day: undefined, month: undefined, year: undefined, inputRef: undefined };
const questions = questionsObj['secondStageSurgeryInformation']

class SecondStageSurgeryInformationView extends React.Component<SecondStageSurgeryInformationViewProps, StateProps> {
  scrollView: any;
  focusListener: any;
  constructor(props: Readonly<SecondStageSurgeryInformationViewProps>) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.goToNextQuestion = this.goToNextQuestion.bind(this);
    this.pushData = this.pushData.bind(this);
    this.onSelectedValuesChange = this.onSelectedValuesChange.bind(this);
    const secondStageSurgeryInformation = this.props.route.params.item.secondStageSurgeryInformation;
    const date = this.getDate(secondStageSurgeryInformation && secondStageSurgeryInformation.secondStageDate);
    this.state = {
      currentIndex: 0,
      error: false,
      showMenu: false,
      dateError: '',
      isNotMeasuredChecked: secondStageSurgeryInformation &&
        secondStageSurgeryInformation.isqValue == 0 ? true : false,
      isSameManufacturerAsImplant: false,
      date: {
        day: date[2] || "",
        month: date[1] || "",
        year: date[0] || "",
      },

      data: secondStageSurgeryInformation || {
        secondStagePerformedBy: "",
        secondStageDate: "",
        softTissueAugmentationNeeded: "",
        uncoveryTechnique: "",
        assessmentOfHygiene: "",
        isqValue: 0,
        healingCap: {
          size: 0,
          height: 0
        },
        secondStagecondition: [],
        boneLoss: "",
        manufacturerName: ""
      }
    }
  }

  goBack = () => {
    if (this.state.currentIndex === 0) {
      this.props.navigation.goBack();
    } else {
      const currentIndex = this.state.currentIndex - 1;
      this.setState({
        currentIndex: currentIndex,
        error: false,
        dateError: ''
      })
    }
  }

  getDate = (date: string) => {
    return date ?
      stripLeadingZerosDate(date).split('-') : []
  }

  componentDidMount() {
    this.props.getManufactures();
    this.focusListener = this.props.navigation.addListener('focus', this.scrollToTop)
  }

  componentWillUnmount() {
    this.focusListener();
  }

  scrollToTop = () => {
    this.scrollView &&
      this.scrollView.scrollTo && this.scrollView.scrollTo({ x: 0, y: 0, animated: false })
  }

  setSelection = () => {
    this.setState({ isNotMeasuredChecked: !this.state.isNotMeasuredChecked }, () => {
      if (this.state.isNotMeasuredChecked) {
        this.pushData('isqValue', '0');
      }
    });
  }

  setManufacturerSelection = () => {
    const { Manufacturer } = this.props.route.params.item.manufacturerModel
    this.setState({ isSameManufacturerAsImplant: !this.state.isSameManufacturerAsImplant }, () => {
      if (this.state.isSameManufacturerAsImplant) {
        this.pushData('manufacturerName', Manufacturer.name);
      }
    });

  }


  getNextQuestion = () => {
    if (questions[this.state.currentIndex].type === 'date') {
      if (this.validateDate()) {
        const { day, month, year } = this.state.date;
        const date = new Date(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`);
        const sutureRemovalDate = this.props.route.params.item.sutureRemovalDate ? new Date(this.props.route.params.item.sutureRemovalDate) : '';
        if (sutureRemovalDate) {
          if (date > sutureRemovalDate) {
            this.pushData('secondStageDate',
              moment(date).format("YYYY-MM-DD")
            );
          } else {
            this.setState({
              error: true,
              dateError: 'Please enter a date after the sutures removed by date'
            });
          }
        } else {
          this.pushData('secondStageDate',
            moment(date).format("YYYY-MM-DD")
          );
        }
      } else {
        this.setState({
          error: true
        });
      }
    } else if (questions[this.state.currentIndex].type === 'slider' &&
      (!this.state.data.healingCap.size || !this.state.data.healingCap.height)) {
      this.setState({
        error: true
      });
    } else {
      this.goToNextQuestion();
    }
  }

  validateHealingCap = (index: number) => {
    let isValid = true;
    if (questions[index].type === 'slider' &&
      (!this.state.data.healingCap.size || !this.state.data.healingCap.height)) {
      isValid = false;
    }
    return isValid;
  }

  onSelectedValuesChange = (selectedValue: any) => {
    let secondStagecondition = this.state.data.secondStagecondition;
    if (typeof this.state.data.secondStagecondition === 'string') {
      secondStagecondition = [];
      secondStagecondition.push(this.state.data.secondStagecondition);
    }
    const index = secondStagecondition.indexOf(selectedValue);
    if (index === -1) {
      secondStagecondition.push(selectedValue);
    } else {
      secondStagecondition.splice(index, 1);
    }
    this.pushData("secondStagecondition", secondStagecondition);
  }

  goToNextQuestion = () => {
    Keyboard.dismiss()
    let isToShowValidationMsg = false;
    if (this.isValid(this.state.currentIndex, true)) {
      const currentIndex = this.state.currentIndex + 1;
      if (questions.length == currentIndex) {
        this.props.navigation.navigate("ReportAFailure",
          { secondStageSurgeryInformation: this.state.data, nextStageNumber: '4' }
        );
      } else {
        this.setState({
          currentIndex: currentIndex
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
  pushData = (index: string, value: any) => {
    this.setState({
      data: { ...this.state.data, [index]: value },
      error: false,
      dateError: ''
    }, () => {
      if (questions[this.state.currentIndex].type === 'selectBox' ||
        questions[this.state.currentIndex].type === 'date') {
        this.goToNextQuestion();
      }
    });
  }

  getManufactureName = (id: any) => {
    const manufacture = this.props.manufactures &&
      this.props.manufactures.filter((item: any) => item.id === id)[0];
    return (manufacture && manufacture.name) || "";
  }

  validateDate = () => {
    const { day, month, year } = this.state.date;
    return validateDate(day, month, year);
  }

  isValid = (index: number, isSkiped: boolean) => {
    let isValid = false;
    const currentQuestion = questions[index];

    if ((this.state.data[currentQuestion.title] &&
      this.state.data[currentQuestion.title].toString())
      || (currentQuestion.isToSkipCurrentValue && isSkiped)) {
      isValid = true;
    }

    return isValid;
  }

  renderFields(max: number) {
    const fields = [];
    for (let i = 0; i < max; i++) {
      const currentQuestion = questions[i];
      let isValid = this.isValid(i, false);
      if (currentQuestion.isToSkipCurrentValue &&
        (i === this.state.currentIndex - 1 || this.props.route.params.item.secondStageSurgeryInformation)) {
        isValid = true;
      }
      fields.push(
        <TouchableOpacity key={i} style={[styles.rect, {
          backgroundColor: i === this.state.currentIndex ?
            Colors.themeColor : isValid && this.validateHealingCap(i) ?
              Colors.lightGreenColor : Colors.grayColor
        }]}
          disabled={!isValid || !this.validateHealingCap(i)}
          onPress={() => { this.scrollToTop(); this.setState({ currentIndex: i, error: false, dateError: '' }) }}
        />
      );
    }
    return fields;
  }

  collectDateObj = (index: string, value: string) => {
    this.setState({
      date: { ...this.state.date, [index]: value },
      error: false,
      dateError: ''
    });
  }

  render() {
    const currentQuestion = questions[this.state.currentIndex];
    return (
      <Fragment>
      <SafeAreaView style={styles.saveAreaBackgrounColor} />
      <SafeAreaView style={styles.saveAreaView}>
      <View style={styles.container}>
        <Header item={this.props.route.params.item} title={I18n.t('secondStageSurgeryInformation')} />
        <LinearGradient
          colors={[Colors.whiteColor, '#e8e8e8']}
          style={styles.linearGradient}>
          <ScrollView
            ref={ref => this.scrollView = ref}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="always"
            contentContainerStyle={styles.contentView}>
            <View style={styles.content}>
              <View style={{ alignItems: 'center' }}><Text style={[styles.sectionTitle, { fontSize: fontRatio(20), textAlign: 'center' }]}>{I18n.t(currentQuestion.title) + (currentQuestion.isToShowSemiColon ? ':' : '')}</Text></View>
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
                        this.pushData(currentQuestion.title, item);
                      }}>
                        <View style={{
                          flex: 3,
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          <Text style={[styles.text, {
                            fontSize: fontRatio(14),
                            paddingLeft: this.state.data[currentQuestion.title] === item ? 10 : 0,
                          }]}>{item}</Text>
                        </View>
                        {
                          this.state.data[currentQuestion.title] === item &&
                          <View style={{ flex: 1 }}>
                            <Icon name="check" size={fontRatio(18)} color={Colors.whiteColor} style={{ paddingLeft: 2 }} />
                          </View>
                        }
                      </TouchableOpacity>
                    </View>
                  )
                  )}
                </View>
                : currentQuestion.type === 'date' ?
                  <View style={styles.column}>
                    <View style={styles.questionContainer}>
                      <View style={styles.inputRow}>
                        <Input
                          reference={c => input.day = c}
                          onSubmitEditing={() => {
                            input.month.focus();
                          }}
                          autoCorrect={false}
                          placeholder={I18n.t('day')}
                          returnKeyType="next"
                          ChangeText={(text) => {
                            if (checkIfNumberKeyPressed(text)) {
                              this.collectDateObj('day', text)
                            }
                          }}
                          autoCapitalize="none"
                          blurOnSubmit={false}
                          hideErrorMsg={true}
                          hideIcon={true}
                          value={this.state.date.day}
                        />
                        <View style={styles.dateDivider} />
                      </View>
                      <View style={styles.inputRow}>
                        <Input
                          reference={c => input.month = c}
                          onSubmitEditing={() => {
                            input.year.focus();
                          }}
                          autoCorrect={false}
                          placeholder={I18n.t('month')}
                          returnKeyType="next"
                          ChangeText={(text) => {
                            if (checkIfNumberKeyPressed(text)) {
                              this.collectDateObj('month', text)
                            }
                          }}
                          autoCapitalize="none"
                          blurOnSubmit={false}
                          hideErrorMsg={true}
                          hideIcon={true}
                          value={this.state.date.month}
                        />
                        <View style={styles.dateDivider} />
                      </View>
                      <View style={styles.inputRow}>
                        <Input
                          reference={c => input.year = c}
                          onSubmitEditing={() => {
                            Keyboard.dismiss()
                          }}
                          autoCorrect={false}
                          placeholder={I18n.t('year')}
                          returnKeyType="go"
                          ChangeText={(text) => {
                            if (checkIfNumberKeyPressed(text)) {
                              this.collectDateObj('year', text)
                            }
                          }}
                          autoCapitalize="none"
                          blurOnSubmit={false}
                          hideErrorMsg={true}
                          hideIcon={true}
                          value={this.state.date.year}
                        />
                      </View>
                    </View>
                    {(this.validateDate()) ? <TouchableOpacity onPress={this.getNextQuestion}><TickON /></TouchableOpacity> : <TickOff />}
                  </View>
                  : currentQuestion.type === 'input' ?
                    <View style={styles.column}>
                      <View style={[styles.questionContainer, styles.innerContainer]}>
                        <Input
                          reference={c => input.inputRef = c}
                          onSubmitEditing={() => {
                            Keyboard.dismiss()
                          }}
                          autoCorrect={false}
                          placeholder={currentQuestion.answers.toString()}
                          returnKeyType="go"
                          ChangeText={(text) => {
                            this.pushData(currentQuestion.title, text);
                          }}
                          autoCapitalize="none"
                          blurOnSubmit={false}
                          hideErrorMsg={true}
                          hideIcon={true}
                          value={this.state.data[currentQuestion.title]}
                          style={currentQuestion.isToAddCustomInputStyle ? {
                            height: 40
                          } : {}}
                          maxLength={26}
                        />
                      </View>
                      {this.state.data[currentQuestion.title] ? <TouchableOpacity onPress={this.goToNextQuestion}><TickON /></TouchableOpacity> : <TickOff />}
                    </View>
                    : currentQuestion.type === 'sliderWithCheckbox' ?
                      <View style={styles.column}>
                        <View style={[styles.questionContainer, styles.innerContainer]}>
                          <View style={styles.innerContainer}>
                            <View style={{ height: fontRatio(60), justifyContent: 'flex-end' }}>
                              {this.state.data[currentQuestion.title] ?
                                <Text style={styles.sliderNumber}>{this.state.data[currentQuestion.title]}</Text>
                                :
                                <Text style={styles.placeholder}>{I18n.t('N-cm')}</Text>
                              }
                            </View>
                            <Slider
                              style={{ width: '100%' }}
                              minimumValue={0}
                              maximumValue={100}
                              step={currentQuestion.step}
                              minimumTrackTintColor={Colors.themeColor}
                              maximumTrackTintColor={Platform.OS == "android" ? Colors.themeColor : "rgba(43, 143, 255, 0.3)"}
                              thumbTintColor={Colors.themeColor}
                              value={Number(this.state.data[currentQuestion.title]) || 0}
                              onValueChange={(value: any) => {
                                this.pushData(currentQuestion.title, value);
                                this.setState({ isNotMeasuredChecked: false });
                              }}
                            />
                          </View>
                          <CheckBox
                            title={I18n.t('notMeasured')}
                            checkedColor={Colors.themeColor}
                            uncheckedColor={Colors.themeColor}
                            checked={this.state.isNotMeasuredChecked}
                            onPress={this.setSelection}
                            textStyle={[styles.placeholder]}
                            containerStyle={styles.checkBoxContainer}
                          />
                        </View>
                        {this.state.data.isqValue ? <TouchableOpacity onPress={this.goToNextQuestion}><TickON /></TouchableOpacity> : <TickOff />}
                      </View>
                      : currentQuestion.type === 'comboBox' ?
                        <View style={styles.column}>
                          <View style={[styles.questionContainer, {
                            justifyContent: currentQuestion.isToAddCustomStyle ? 'center' : 'flex-start',
                          }]}>
                            {currentQuestion.answers.map((item: any, index: any) => (
                              <View key={index} style={[styles.question, {
                                width: currentQuestion.isToAddCustomStyle ? '70%' : '45%',
                              }, {
                                backgroundColor: this.state.data.secondStagecondition.indexOf(item) === -1 ?
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
                                    color: this.state.data.secondStagecondition.indexOf(item) === -1 ?
                                      Colors.blueColor : Colors.whiteColor,
                                  }]}>{item}</Text>
                                </TouchableOpacity>
                              </View>
                            )
                            )}
                          </View>
                          {this.state.data.secondStagecondition.length > 0 ? <TouchableOpacity onPress={this.goToNextQuestion}><TickON /></TouchableOpacity> : <TickOff />}
                        </View>
                        : currentQuestion.type === 'slider' ?
                          <View style={styles.column}>
                            <View style={[styles.questionContainer, styles.innerContainer]}>
                              {currentQuestion.answers.map((item: any, index: any) => (
                                <View key={index} style={styles.innerContainer}>
                                  <View style={{ height: fontRatio(60), justifyContent: 'flex-end' }}>
                                    {this.state.data[currentQuestion.title][item] ?
                                      <Text style={[styles.placeholder, { opacity: 1 }]}>{this.state.data[currentQuestion.title][item]}</Text>
                                      :
                                      <Text style={styles.placeholder}>{item}</Text>
                                    }
                                  </View>
                                  <Slider
                                    style={{ width: '100%' }}
                                    minimumValue={1}
                                    maximumValue={10}
                                    step={0.5}
                                    minimumTrackTintColor={Colors.themeColor}
                                    maximumTrackTintColor={Platform.OS == "android" ? Colors.themeColor : "rgba(43, 143, 255, 0.3)"}
                                    thumbTintColor={Colors.themeColor}
                                    value={Number(this.state.data[currentQuestion.title][item]) || 0}
                                    onValueChange={(value: any) => { this.pushData(currentQuestion.title, { ...this.state.data[currentQuestion.title], [item]: value }) }}
                                  />
                                </View>
                              )
                              )}
                            </View>
                            {this.state.data.healingCap.size &&
                              this.state.data.healingCap.height ?
                              <TouchableOpacity onPress={this.getNextQuestion}><TickON /></TouchableOpacity> : <TickOff />}
                          </View>
                          : currentQuestion.type === 'picker' ?
                            this.props.manufactures ?
                              <View style={[styles.questionContainer, styles.innerContainer]}>
                                <Picker
                                  value={this.state.data.manufacturerName}
                                  fieldName={"specialityId"}
                                  useIdAsATheValue={true}
                                  label={this.state.data.manufacturerName || I18n.t('manufacturer')}
                                  style={{
                                    width: '80%',
                                  }}
                                  options={this.props.manufactures}
                                  errorMessage={undefined}
                                  labelStyle={styles.label}
                                  setFieldValue={(fieldName, value) => {
                                    this.pushData(currentQuestion.title, this.getManufactureName(value));
                                    this.setState({ isSameManufacturerAsImplant: false });
                                  }}
                                  touched={false}
                                  pickerStyle={styles.picker}
                                  innerValue={this.state.data.manufacturerName}
                                  onDropdownOpen={() => this.setState({ showMenu: !this.state.showMenu })}
                                />
                                {this.props.route.params.item.manufacturerModel &&
                                  <CheckBox
                                    title={I18n.t('sameManufacturerAsImplant')}
                                    checkedColor={Colors.themeColor}
                                    uncheckedColor={Colors.themeColor}
                                    checked={this.state.isSameManufacturerAsImplant}
                                    onPress={this.setManufacturerSelection}
                                    textStyle={[styles.placeholder]}
                                    containerStyle={[styles.checkBoxContainer, {
                                      width: '90%',
                                      marginTop: -15,
                                    }]}
                                    disabled={this.state.showMenu}
                                  />
                                }
                              </View>
                              : <ActivityIndicator color={Colors.lightGreenColor} size="large" style={{ marginTop: 100 }} />
                            :
                            <View />
              }
              <View style={{ height: 30 }}>
                {this.state.error && <Text style={styles.errorText}>{this.state.dateError || I18n.t('invalidInformation')}</Text>}
              </View>
            </View>
            <View style={styles.sectionContent}>
              {this.renderFields(10)}
            </View>
          </ScrollView>
        </LinearGradient>

        <View style={{ height: 70 }}>
          <LinearGradient
            colors={[Colors.whiteColor, '#e8e8e8']}
            style={styles.footerLinearGradient}>
            <View style={styles.footer}>
              <TouchableOpacity onPress={this.goBack} style={[styles.footerContent, { alignItems: 'center' }]}><Text style={styles.back}>{I18n.t('back')}</Text></TouchableOpacity>
              <View style={[styles.footerContent, { justifyContent: 'flex-end', alignItems: 'center', marginLeft: 20 }]}>
                {currentQuestion.isToSkipCurrentValue && <TouchableOpacity onPress={this.goToNextQuestion} style={[styles.btnContainer, { alignItems: 'center' }]}>
                  <Text style={styles.text}>{I18n.t('skip')}</Text>
                </TouchableOpacity>
                }
                <TouchableOpacity onPress={this.getNextQuestion} style={[styles.footerContent, {
                  opacity: 0.5
                }]} ><NextOff34 width={160} /></TouchableOpacity>
              </View>
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
    alignItems: 'center',
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
  inputRow: {
    flex: 1.5,
    flexDirection: 'row',
    position: 'relative'
  },
  dateDivider: {
    backgroundColor: Colors.themeColor,
    flex: 0.1,
    transform: [{ rotate: '30deg' }],
    marginBottom: 28,
    marginLeft: 10,
  },
  errorText: {
    fontFamily: 'System',
    color: '#FF0000',
    fontSize: fontRatio(14),
    paddingBottom: 10,
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
    marginLeft: 10
  },
  column: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1
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
  checkBoxContainer: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    width: '100%',
    alignItems: 'flex-start',
  },
  innerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
  },
  label: {
    textAlign: "center",
    opacity: 0.6,
    fontFamily: "Roboto",
    fontSize: fontRatio(14),
    color: Colors.blueColor,
    paddingVertical: 0,
    marginRight: 0
  },
  picker: {
    marginLeft: 0,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    width: Dimensions.get('window').width * 0.65,
    height: '100%'
  },
});

const mapStateToProps = (state: { constants: { manufactures: any; }; }) => ({
  manufactures: state.constants.manufactures,

});
export default connect(mapStateToProps, {
  getManufactures: userActions.getManufactures,
})(SecondStageSurgeryInformationView);