import React, { Fragment } from 'react';
import { ScrollView, StyleSheet, SafeAreaView, View, Text, Keyboard, Platform } from 'react-native';
import I18n from '../../l18n/I18n';
import { Colors, fontRatio } from '../../styles/StyleSheet'
import LinearGradient from 'react-native-linear-gradient';
// @ts-ignore
import NextOff24 from '../../../assets/images/nextOn24.svg';
// @ts-ignore
import TickOff from '../../../assets/images/tickOff.svg';
// @ts-ignore
import TickON from '../../../assets/images/tickON.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { StackNavigationProp } from '@react-navigation/stack';
import questionsObj from './questions.json';
import Input from '../../components/Input';
import moment from 'moment';
import { Icon } from 'react-native-elements';
import Header from './header';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import {
  stripLeadingZerosDate,
  checkIfNumberKeyPressed,
  validateDate
} from '../../utils/helpers';

interface SutureRemovalStageInformationViewProps {
  navigation: StackNavigationProp<{
    "ReportAFailure": {};
  }, "ReportAFailure">; route: any;
}
interface StateProps {
  currentIndex: number;
  data: any;
  date: any;
  error: boolean
}

interface Inputs {
  day: any;
  month: any;
  year: any;
  inputRef: any;
}
const input: Inputs = { day: undefined, month: undefined, year: undefined, inputRef: undefined };
const questions = questionsObj['sutureRemovalStageInformation']

class SutureRemovalStageInformationView extends React.Component<SutureRemovalStageInformationViewProps, StateProps> {
  scrollView: any;
  focusListener: any;
  constructor(props: Readonly<SutureRemovalStageInformationViewProps>) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.goToNextQuestion = this.goToNextQuestion.bind(this);
    this.pushData = this.pushData.bind(this);
    const sutureRemovalStageInformation = this.props.route.params.item.sutureRemovalStageInformation;
    const date = this.getDate(sutureRemovalStageInformation && sutureRemovalStageInformation.sutureRemovalDate);
    this.state = {
      currentIndex: 0,
      error: false,
      date: {
        day: date[2] || "",
        month: date[1] || "",
        year: date[0] || "",
      },
      data: sutureRemovalStageInformation || {
        suturesRemovedBy: "",
        atTheTimeOfSutureRemoval: "",
        sutureRemovalDate: ""
      }
    }
  }

  getDate = (date: string) => {
    return date ?
      stripLeadingZerosDate(date).split('-') : []
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

  getNextQuestion = () => {
    if (questions[this.state.currentIndex].type === 'date') {
      if (this.validateDate()) {
        const { day, month, year } = this.state.date;
        this.pushData('sutureRemovalDate',
          moment(new Date(`${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`)).format("YYYY-MM-DD")
        );
      } else {
        this.setState({
          error: true
        });
      }

    } else {
      this.goToNextQuestion();
    }
  }
  goToNextQuestion = () => {
    Keyboard.dismiss()
    let isToShowValidationMsg = false;
    if (this.isValid(this.state.currentIndex, true)) {
      const currentIndex = this.state.currentIndex + 1;
      if (questions.length == currentIndex) {
        this.props.navigation.navigate("ReportAFailure",
          { sutureRemovalStageInformation: this.state.data, nextStageNumber: '3' }
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
  pushData = (index: string, value: string) => {
    this.setState({
      data: { ...this.state.data, [index]: value },
      error: false
    }, () => {
      if (questions[this.state.currentIndex].type !== 'input') {
        this.goToNextQuestion();
      }
    });
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
        (i === this.state.currentIndex - 1 || this.props.route.params.item.sutureRemovalStageInformation)) {
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

  collectDateObj = (index: string, value: string) => {
    this.setState({
      date: { ...this.state.date, [index]: value },
      error: false
    });
  }

  render() {
    const currentQuestion = questions[this.state.currentIndex];
    return (
      <Fragment>
        <SafeAreaView style={styles.saveAreaBackgrounColor} />
        <SafeAreaView style={styles.saveAreaView}>
          <View style={styles.container}>
            <Header item={this.props.route.params.item} title={I18n.t('sutureRemovalStageInformation')} />
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
                    <View style={[styles.questionContainer, { flexDirection: 'column' }]}>
                      {currentQuestion.answers.map((item: any, index: any) => (
                        <View key={index} style={styles.question}>
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
                          <View style={styles.questionContainer}>
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
                              maxLength={26}
                            />
                          </View>
                          {this.state.data[currentQuestion.title] ? <TouchableOpacity onPress={this.goToNextQuestion}><TickON /></TouchableOpacity> : <TickOff />}
                        </View>
                        :
                        <View />
                  }
                  <View style={{ height: 30 }}>
                    {this.state.error && <Text style={styles.errorText}>{I18n.t('invalidInformation')}</Text>}
                  </View>
                </View>
                <View style={styles.sectionContent}>
                  {this.renderFields(3)}
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
                    }]} ><NextOff24 width={160} /></TouchableOpacity>
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
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    marginBottom: 14,
  },
  saveAreaBackgrounColor: {
    flex: 0,
    backgroundColor: Colors.themeColor,
  },
  saveAreaView: {
    flex: 1,
    backgroundColor: '#e8e8e8',
    paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
    flex: 5,
    alignContent: 'center',
    paddingTop: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  question: {
    width: '80%',
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
  }
});

export default SutureRemovalStageInformationView;