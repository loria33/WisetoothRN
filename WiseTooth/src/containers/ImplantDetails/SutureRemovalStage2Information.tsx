import React, { Fragment } from 'react';
import { ScrollView, SafeAreaView, View, Text, StyleSheet, Platform } from 'react-native';
import Header from '../../components/Header';
import { StackNavigationProp } from '@react-navigation/stack';
import I18n from '../../l18n/I18n';
import { Colors } from '../../styles/StyleSheet';
import ImplantDetailsHeader from './ImplantDetailsHeader';
import Footer from './Footer';
import moment from 'moment';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import * as _ from 'lodash';

interface SutureRemovalStage2InformationtProps {
  navigation: StackNavigationProp<{}>;
  route: any;
}

const PatientText = ({ text, placholder }: any) => (
  <View style={styles.patientTextContainer}>
    <Text style={styles.patientPlaceHolder}>{placholder}</Text>
    <Text style={styles.patientText}>{text || '--'}</Text>
  </View>
)
class SutureRemovalStage2Information extends React.Component<SutureRemovalStage2InformationtProps> {
  focusListener: any;
  scrollView: any;
  constructor(props: Readonly<SutureRemovalStage2InformationtProps>) {
    super(props);
    this.getHeader = this.getHeader.bind(this);
    this.goBack = this.goBack.bind(this);
    this.getToothNumText = this.getToothNumText.bind(this);
    this.goNext = this.goNext.bind(this);
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

  getHeader = (installs: any) => {
    let title: any = [];
    installs.map((item: any) => {
      title.push(item.Implant && item.Implant.ImplantLabel &&
        item.Implant.ImplantLabel.label)
    })
    return title.join(', ');
  }

  getToothNumText = (installs: any) => {
    let text: any = [];
    installs.map((item: any) => {
      text.push(item.toothNum)
    })
    return text.join(', ');
  }
  goBack = () => {
    const { navigation, route } = this.props;
    const item = route.params.item;
    const prostheticStepsInformation = item.Installs[0] &&
      item.Installs[0].report && item.Installs[0].report.answers.prostheticStepsInformation;
    if (_.isEmpty(prostheticStepsInformation)) {
      navigation.navigate('PatientInformation', { item });

    } else {
      navigation.goBack();

    }

  }

  goNext = (pageName: any) => {
    this.props.navigation.navigate(pageName, { item: this.props.route.params.item });
  }

  render() {
    const { navigation, route } = this.props;
    const visit = route.params.item;
    const answers = visit.Installs[0].report && visit.Installs[0].report.answers;
    const { secondStagePerformedBy, secondStageDate, softTissueAugmentationNeeded,
      uncoveryTechnique, assessmentOfHygiene, isqValue, healingCap
    } = answers.secondStageSurgeryInformation;
    return (
      <Fragment>
        <SafeAreaView style={styles.saveAreaBackgrounColor} />
        <SafeAreaView style={styles.saveAreaView}>
          <View style={{ flex: 1 }}>
            <Header title={this.getHeader(visit.Installs)} navigation={navigation} showEditIcon={true} visit={{ ...visit, pageName: 'SutureRemovalStage2Information' }} style={{ paddingBottom: 10 }} />
            <ScrollView
              ref={ref => this.scrollView = ref}
              keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
              <View style={styles.patientInformation}>
                <ImplantDetailsHeader visit={visit} title={I18n.t('sutureRemovalStageInformation')} navigation={navigation} />
                <View style={[styles.column, { marginBottom: 5 }]}>
                  <View style={styles.patientContent}>
                    <PatientText text={secondStagePerformedBy} placholder={I18n.t('secondStagePerformedBy')} />
                  </View>
                  <View style={styles.patientContent}>
                    <PatientText text={moment(secondStageDate).format('DD/MM/YYYY')}
                      placholder={I18n.t('secondStageDate')} />
                  </View>
                  <View style={styles.patientContent}>
                    <PatientText text={softTissueAugmentationNeeded} placholder={I18n.t('softTissueAugmentationNeeded')} />
                  </View>
                  <View style={styles.patientContent}>
                    <PatientText text={uncoveryTechnique} placholder={I18n.t('uncoveryTechnique')} />
                  </View>
                  <View style={styles.patientContent}>
                    <PatientText text={assessmentOfHygiene} placholder={I18n.t('assessmentOfHygiene')} />
                  </View>
                  <View style={styles.patientContent}>
                    <PatientText text={isqValue} placholder={I18n.t('isqValue')} />
                  </View>
                  <View style={[styles.patientContent, { borderBottomWidth: 0 }]}>
                    <PatientText text={"Size: " + healingCap.size + ", Height:" + healingCap.height} placholder={I18n.t('healingCap')} />
                  </View>
                </View>
              </View>
            </ScrollView>
            <Footer back={this.goBack} next={this.goNext} nextPageName="ProstheticStepsInformation"
              isFailure={visit.isFailure} pageNum={4} navigation={navigation} item={visit} />
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
  patientInformation: {
    paddingTop: 20,
    paddingLeft: '5%',
    paddingRight: '5%',
    flexDirection: 'column',
    flex: 1,
  },
  column: {
    flexDirection: 'column',
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    flex: 1,
  },
  patientContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderStyle: 'solid',
    borderColor: 'rgba(45, 48, 52, 0.3)',
    borderBottomWidth: 0.5,
    paddingBottom: 8,
    paddingTop: 8
  },
  patientTextContainer: {
    flexDirection: 'column',
  },
  patientText: {
    fontFamily: 'System',
    fontSize: 14,
    fontWeight: '300',
    fontStyle: 'normal',
    textAlign: 'left',
    color: Colors.blueColor,
    paddingTop: 2,
    textTransform: 'capitalize'
  },
  patientPlaceHolder: {
    fontSize: 14,
    opacity: 0.6,
    fontFamily: 'System',
    fontWeight: '300',
    fontStyle: 'normal',
    textAlign: 'left',
    color: Colors.blueColor,
    paddingTop: 2,
  },
});


export default SutureRemovalStage2Information;
