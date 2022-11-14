import React, { Fragment } from 'react';
import { ScrollView, SafeAreaView ,View, Text, StyleSheet,Platform } from 'react-native';
import Header from '../../components/Header';
import { StackNavigationProp } from '@react-navigation/stack';
import I18n from '../../l18n/I18n';
import { Colors } from '../../styles/StyleSheet';
// @ts-ignore
import Name from '../../../assets/images/name.svg';
// @ts-ignore
import Age from '../../..//assets/images/age.svg';
// @ts-ignore
import Tooth from '../../../assets/images/tooth.svg';
// @ts-ignore
import Serial from '../../../assets/images/serial.svg';
// @ts-ignore
import Gender from '../../../assets/images/gender.svg';
// @ts-ignore
import MedicalCondition from '../../../assets/images/medicalCondition.svg';
import ImplantDetailsHeader from './ImplantDetailsHeader';
import Footer from './Footer';
import * as userActions from '../../redux/actions/user';
import { getStatusBarHeight} from 'react-native-status-bar-height';

import { connect } from 'react-redux';
interface PatientInformationtProps {
  navigation: StackNavigationProp<{}>;
  route: any;
  getMedicalConditions: () => void;
  medicalConditions: any;
}

const PatientText = ({ text, placholder }: any) => (
  <View style={styles.patientTextContainer}>
    <Text style={styles.patientPlaceHolder}>{placholder}</Text>
    <Text style={styles.patientText}>{text || '--'}</Text>
  </View>
)
class PatientInformation extends React.Component<PatientInformationtProps> {
  focusListener: any;
  scrollView: any;
  constructor(props: Readonly<PatientInformationtProps>) {
    super(props);
    this.getHeader = this.getHeader.bind(this);
    this.goBack = this.goBack.bind(this);
    this.getToothNumText = this.getToothNumText.bind(this);
    this.goNext = this.goNext.bind(this);
    this.getMedicalConditionName = this.getMedicalConditionName.bind(this);
  }

  componentDidMount() {
    const { getMedicalConditions, navigation } = this.props;
    getMedicalConditions();
    this.focusListener = navigation.addListener('focus', this.scrollToTop);
  }

  componentWillUnmount() {
    this.focusListener();
  }

  scrollToTop = () => {
    this.scrollView &&
      this.scrollView.scrollTo && this.scrollView.scrollTo({ x: 0, y: 0, animated: false })
  }

  getMedicalConditionName = (id: number) => {
    const medicalCondition = this.props.medicalConditions &&
      this.props.medicalConditions.filter((item: any) => item.id === id)[0];
    return (medicalCondition && medicalCondition.name) || "";
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
    this.props.navigation.goBack();
  }

  goNext = (pageName: any) => {
    this.props.navigation.navigate(pageName, { item: this.props.route.params.item });
  }

  render() {
    const { route, navigation } = this.props;
    const { item } = route.params;
    return (
      <Fragment>
      <SafeAreaView style={styles.saveAreaBackgrounColor} />
      <SafeAreaView style={styles.saveAreaView}>
      <View style={{ flex: 1 }}>
        <Header
          title={this.getHeader(item.Installs)}
          style={{paddingBottom:10}}
          navigation={navigation}
          showEditIcon={true}
          isEditPatientInfo={true}
          visit={{
            ...item,
            medicalCondition: this.getMedicalConditionName(item.Patient.medicalConditionId)
          }}
        />
        <ScrollView  
          ref={ref => this.scrollView = ref}
          keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
          <View style={styles.patientInformation}>
            <ImplantDetailsHeader visit={item} title={I18n.t('patientInformation')} navigation={navigation} />
            <View style={[styles.column, { marginBottom: 5, paddingRight: '10%'}]}>
              <View style={styles.patientContent}>
                <PatientText text={item.Patient.name} placholder={I18n.t('fullName')} />
                <Name />
              </View>
              <View style={styles.patientContent}>
                <PatientText text={item.Patient.gender} placholder={I18n.t('gender')} />
                <Gender />
              </View>
              <View style={styles.patientContent}>
                <PatientText text={item.Patient.age} placholder={I18n.t('age')} />
                <Age />
              </View>
              <View style={styles.patientContent}>
                <PatientText text={this.getMedicalConditionName(item.Patient.medicalConditionId)} placholder={I18n.t('medicalCondition')} />
                <MedicalCondition />
              </View>
              <View style={[styles.patientContent, { borderBottomWidth: 0 }]}>
                <PatientText text={this.getToothNumText(item.Installs)} placholder={I18n.t('toothNumber')} />
                <Tooth />
              </View>
            </View>
          </View>
        </ScrollView>
        <Footer back={this.goBack} next={this.goNext} nextPageName="SurgeryInformationPlacement"
          isFailure={item.isFailure} pageNum={1} navigation={navigation} item={item} />
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
      paddingTop: Platform.OS === 'android' ?  getStatusBarHeight() : 0 ,
  },
  patientInformation: {
    paddingTop:20,
    paddingLeft: '5%',
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

const mapStateToProps = (state: { constants: { medicalConditions: any }; }) => ({
  medicalConditions: state.constants.medicalConditions
});
export default connect(mapStateToProps, {
  getMedicalConditions: userActions.getMedicalConditions,
})(PatientInformation);