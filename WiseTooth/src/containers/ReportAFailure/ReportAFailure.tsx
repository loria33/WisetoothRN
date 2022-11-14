import React, { Fragment } from 'react';
import { ScrollView, StyleSheet, SafeAreaView, View, Text, Alert, Platform } from 'react-native';
import I18n from '../../l18n/I18n';
import { StackNavigationProp } from '@react-navigation/stack';
import { Colors, fontRatio } from '../../styles/StyleSheet'
import LinearGradient from 'react-native-linear-gradient';
// @ts-ignore
import Begin from '../../../assets/images/begin.svg';
// @ts-ignore
import NextOn14 from '../../../assets/images/nextOn14.svg';
// @ts-ignore
import NextOn24 from '../../../assets/images/nextOn24.svg';
// @ts-ignore
import NextOn34 from '../../../assets/images/nextOn34.svg';
// @ts-ignore
import Submit from '../../../assets/images/submit.svg';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { connect } from 'react-redux';
import { CompositeNavigationProp } from '@react-navigation/native';
import * as visitActions from '../../redux/actions/visit';
import Header from './header';
import { Icon } from 'react-native-elements';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import * as _ from 'lodash';

interface ReportAFailureProps {
  route: any;
  createReport: (reqObj: any) => void;
  editReport: (reqObj: any) => void;
  navigation: CompositeNavigationProp<
    StackNavigationProp<{
      "SurgeryInformationPlacementView": {};
    }, "SurgeryInformationPlacementView">,
    StackNavigationProp<{
      "SutureRemovalStageInformationView": {};
    }, "SutureRemovalStageInformationView">
  >
}

interface StateProps {
  prostheticStageConfirmQuestion: string
}

class ReportAFailure extends React.Component<ReportAFailureProps, StateProps> {
  scrollView: any;
  focusListener: any;
  constructor(props: Readonly<ReportAFailureProps>) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.navigateToSurgeryInformationPlacementView = this.navigateToSurgeryInformationPlacementView.bind(this);
    this.state = {
      prostheticStageConfirmQuestion: (this.props.route.params && this.props.route.params.prostheticStageConfirmQuestion) || ''
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

  goBack = () => {
    if (this.checkIfDataFilled()) {
      this.goBackConfirmation();
    } else {
      this.props.navigation.goBack();

    }
  }

  goBackConfirmation = () => {
    Alert.alert('', I18n.t('reportAFailureAlertMsg'), [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () => {
          this.props.navigation.goBack();
        },
      },
    ]);
  };

  checkIfDataFilled = () => {
    let isFilled = false;
    const { surgeryInformationPlacement, sutureRemovalStageInformation,
      secondStageSurgeryInformation, prostheticStepsInformation
    } = this.props.route.params;

    if (surgeryInformationPlacement || sutureRemovalStageInformation ||
      secondStageSurgeryInformation || (this.state.prostheticStageConfirmQuestion === 'no' && prostheticStepsInformation)) {
      isFilled = true;

    }

    return isFilled;
  }

  navigateToSurgeryInformationPlacementView = (data?: any) => {
    this.props.navigation.navigate("SurgeryInformationPlacementView", { item: this.props.route.params, ...data })
  }

  navigateToSutureRemovalStageInformationView = (data?: any) => {
    this.props.navigation.navigate("SutureRemovalStageInformationView", { item: this.props.route.params, ...data })
  }

  navigateToSecondStageSurgeryInformationView = (data?: any) => {
    this.props.navigation.navigate("SecondStageSurgeryInformationView", {
      item: {
        ...this.props.route.params,
        sutureRemovalDate: this.props.route.params && this.props.route.params.sutureRemovalStageInformation ? this.props.route.params.sutureRemovalStageInformation.sutureRemovalDate : ''
      }, ...data
    })
  }

  navigateToProstheticStepsInformationView = (data?: any) => {
    this.props.navigation.navigate("ProstheticStepsInformationView", { item: this.props.route.params, ...data })
  }

  reportAFailureSection = ({ title, count, color, disabled, onNavigate }: any) => (
    <View style={styles.sectionContainer}>
      <TouchableOpacity disabled={disabled} onPress={onNavigate}>
        <View style={styles.editIconContainer}>
          <Text style={styles.sectionTitle}>{title}</Text>
          {this.props.route.params &&
            this.props.route.params.isEditMode && <Icon name="edit" size={18} color={Colors.themeColor} />}
        </View>
        <View style={styles.sectionContent}>
          {this.renderFields(count, color)}
        </View>
      </TouchableOpacity>
    </View>
  );

  renderFields(max: number, color?: string) {
    const fields = [];
    for (let i = 0; i < max; i++) {
      fields.push(
        <View key={i} style={[styles.rect, {
          backgroundColor: color || Colors.grayColor
        }]} />
      );
    }
    return fields;
  }

  onSubmit = () => {
    const { id, surgeryInformationPlacement, sutureRemovalStageInformation,
      secondStageSurgeryInformation, prostheticStepsInformation, isEditMode, reportId
      , isBackToPatientInformation, routeParams } = this.props.route.params;
    if (isEditMode) {
      this.props.editReport({
        visit: this.props.route.params,
        answerObj: {
          questionaireType: "failure",
          answers: {
            surgeryInformationPlacement,
            sutureRemovalStageInformation,
            secondStageSurgeryInformation,
            prostheticStepsInformation: this.state.prostheticStageConfirmQuestion === 'no' ?
              prostheticStepsInformation : {},
            prostheticStageConfirmQuestion: this.state.prostheticStageConfirmQuestion
          },
          installId: id,
          reportId
        }
      });
    } else {
      this.props.createReport({
        createReportObj: {
          questionaireType: "failure",
          answers: {
            surgeryInformationPlacement,
            sutureRemovalStageInformation,
            secondStageSurgeryInformation,
            prostheticStageConfirmQuestion: this.state.prostheticStageConfirmQuestion,
            prostheticStepsInformation: this.state.prostheticStageConfirmQuestion === 'no' ?
              prostheticStepsInformation : {}
          },
          installId: id
        },
        isBackToPatientInformation: isBackToPatientInformation,
        routeParams
      });
    }
  }
  render() {
    const { surgeryInformationPlacement, nextStageNumber,
      sutureRemovalStageInformation, secondStageSurgeryInformation, prostheticStepsInformation
    } = this.props.route.params;
    return (
      <Fragment>
        <SafeAreaView style={styles.saveAreaBackgrounColor} />
        <SafeAreaView style={styles.saveAreaView}>
          <View style={styles.container}>
            <Header item={this.props.route.params} title={I18n.t('ReportAFailureImplant')} />
            <LinearGradient
              colors={[Colors.whiteColor, '#e8e8e8']}
              style={styles.linearGradient}>
              <ScrollView
                ref={ref => this.scrollView = ref}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="always"
                contentContainerStyle={styles.contentView}>
                <View style={styles.content}>
                  <View style={{ paddingTop: 10, marginBottom: 32 }}>
                    <Text style={[styles.text, styles.blueText, { textAlign: 'left', fontWeight: 'normal' }]}>{I18n.t('reportAFailureTitleAfterSection' + nextStageNumber)}</Text>
                  </View>
                  <this.reportAFailureSection
                    title={I18n.t('surgeryInformationPlacement')}
                    count={surgeryInformationPlacement && surgeryInformationPlacement.implantPlacementProtocol === 'Two stages' ? 14 : 15}
                    color={surgeryInformationPlacement ? Colors.lightGreenColor : Colors.grayColor}
                    onNavigate={() => this.navigateToSurgeryInformationPlacementView(surgeryInformationPlacement)}
                    disabled={!surgeryInformationPlacement}
                  />
                  <this.reportAFailureSection
                    title={I18n.t('sutureRemovalStageInformation')}
                    count={3}
                    color={sutureRemovalStageInformation ? Colors.lightGreenColor : Colors.grayColor}
                    onNavigate={() => this.navigateToSutureRemovalStageInformationView(sutureRemovalStageInformation)}
                    disabled={!sutureRemovalStageInformation}
                  />
                  <this.reportAFailureSection
                    title={I18n.t('secondStageSurgeryInformation')}
                    count={10}
                    color={secondStageSurgeryInformation ? Colors.lightGreenColor : Colors.grayColor}
                    onNavigate={() => this.navigateToSecondStageSurgeryInformationView(secondStageSurgeryInformation)}
                    disabled={!secondStageSurgeryInformation}
                  />
                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>{I18n.t('prostheticStageConfirmQuestion')}</Text>
                    <View style={styles.btnsContainer}>
                      <TouchableOpacity style={styles.btn} onPress={() => this.setState({ prostheticStageConfirmQuestion: 'yes' })}>
                        <Text style={styles.btnText}>{I18n.t('yes')}</Text>
                        {this.state.prostheticStageConfirmQuestion === 'yes' && <Icon name="check" size={fontRatio(18)} color={Colors.whiteColor} style={{ paddingLeft: 10 }} />}
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.btn, { marginLeft: 48, backgroundColor: 'gray' }]} onPress={() => this.setState({ prostheticStageConfirmQuestion: 'no' })}>
                        <Text style={styles.btnText}>{I18n.t('no')}</Text>
                        {this.state.prostheticStageConfirmQuestion === 'no' && <Icon name="check" size={fontRatio(18)} color={Colors.whiteColor} style={{ paddingLeft: 10 }} />}
                      </TouchableOpacity>
                    </View>
                  </View>
                  {this.state.prostheticStageConfirmQuestion === 'no' && <this.reportAFailureSection
                    title={I18n.t('prostheticStepsInformation')}
                    count={23}
                    color={!_.isEmpty(prostheticStepsInformation) ? Colors.lightGreenColor : Colors.grayColor}
                    onNavigate={() => this.navigateToProstheticStepsInformationView(prostheticStepsInformation)}
                    disabled={!prostheticStepsInformation}
                  />}
                </View>
              </ScrollView>
            </LinearGradient>

            <View style={{ height: 70 }}>
              <LinearGradient
                colors={[Colors.whiteColor, '#e8e8e8']}
                style={styles.footerLinearGradient}>
                <View style={styles.footer}>
                  <TouchableOpacity onPress={this.goBack} style={[styles.footerContent, { alignItems: 'center' }]}><Text style={styles.back}>{I18n.t('back')}</Text></TouchableOpacity>
                  {(surgeryInformationPlacement && sutureRemovalStageInformation
                    && secondStageSurgeryInformation && (!_.isEmpty(prostheticStepsInformation) || this.state.prostheticStageConfirmQuestion === 'yes')) ||
                    (nextStageNumber === "5" && (this.state.prostheticStageConfirmQuestion === 'no' && !_.isEmpty(prostheticStepsInformation))) ?
                    <TouchableOpacity onPress={this.onSubmit} style={styles.footerContent}><Submit /></TouchableOpacity>
                    : nextStageNumber === "1" ?
                      <TouchableOpacity onPress={this.navigateToSurgeryInformationPlacementView} style={styles.footerContent}><Begin /></TouchableOpacity>
                      : nextStageNumber === "2" ?
                        <TouchableOpacity onPress={this.navigateToSutureRemovalStageInformationView} style={styles.footerContent}><NextOn14 /></TouchableOpacity>
                        : nextStageNumber === "3" ?
                          <TouchableOpacity onPress={this.navigateToSecondStageSurgeryInformationView} style={styles.footerContent}><NextOn24 /></TouchableOpacity>
                          : nextStageNumber === "4" || this.state.prostheticStageConfirmQuestion === 'no' ?
                            <TouchableOpacity onPress={this.navigateToProstheticStepsInformationView} style={styles.footerContent} disabled={!this.state.prostheticStageConfirmQuestion}>
                              <View style={{ opacity: !this.state.prostheticStageConfirmQuestion ? 0.5 : 1 }}><NextOn34 /></View>
                            </TouchableOpacity>
                            : <View />
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
  },
  content: {
    flex: 1,
    width: '90%',
    flexDirection: 'column',
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
    marginBottom: 42
  },
  sectionContent: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  editIconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  btnsContainer: {
    flexDirection: 'row',
    alignItems: 'center'

  },

  btn: {
    backgroundColor: Colors.lightGreenColor,
    borderRadius: 10,
    height: 35,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },

  btnText: {
    color: Colors.whiteColor,
    fontFamily: 'System',
    fontSize: 15,
    fontStyle: 'normal',
    textAlign: 'center'
  }
});

const mapStateToProps = () => ({

});
export default connect(mapStateToProps, {
  createReport: visitActions.createReport,
  editReport: visitActions.editReport,
})(ReportAFailure);