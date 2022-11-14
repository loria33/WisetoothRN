import React, { Fragment } from 'react';
import { ScrollView, View, SafeAreaView, Text, StyleSheet, Alert, Platform } from 'react-native';
import Header from '../../components/Header';
import { StackNavigationProp } from '@react-navigation/stack';
import I18n from '../../l18n/I18n';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { Colors } from '../../styles/StyleSheet';
// @ts-ignore
import Name from '../../../assets/images/name.svg';
// @ts-ignore
import Age from '../../../assets/images/age.svg';
// @ts-ignore
import Tooth from '../../../assets/images/tooth.svg';
// @ts-ignore
import Serial from '../../../assets/images/serial.svg';
// @ts-ignore
import Gender from '../../../assets/images/gender.svg';
// @ts-ignore
import Submit from '../../../assets/images/submit44.svg';
// @ts-ignore
import MedicalCondition from '../../../assets/images/medicalCondition.svg';
import ImplantDetailsHeader from '../ImplantDetails/ImplantDetailsHeader';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { CreateImplantParamList } from '../../Models/CreateImplantStackModel';
import { RouteProp } from '@react-navigation/native';
import { createVisit } from '../../api/user';
import { connect } from 'react-redux';
import * as visitActions from '../../redux/actions/visit';
import * as userActions from '../../redux/actions/user';
interface CreateImplantSummaryProps {
  getVisitList: () => void;
  getImplantStatistics: (values: any, flag: boolean) => void;
  getMedicalConditions: () => void;
  medicalConditions: any;
  navigation: StackNavigationProp<CreateImplantParamList, "CreateImplantSummary">;
  route: RouteProp<CreateImplantParamList, "CreateImplantSummary">;
}

const PatientText = ({ text, placholder }: any) => (
  <View style={styles.patientTextContainer}>
    <Text style={styles.patientPlaceHolder}>{placholder}</Text>
    <Text style={styles.patientText}>{text || '--'}</Text>
  </View>
)
class CreateImplantSummary extends React.Component<CreateImplantSummaryProps> {
  focusListener: any;
  scrollView: any;
  constructor(props: Readonly<CreateImplantSummaryProps>) {
    super(props);
    this.getHeader = this.getHeader.bind(this);
    this.goBack = this.goBack.bind(this);
    this.goNext = this.goNext.bind(this);
  }

  componentDidMount() {
    this.props.getMedicalConditions();
    this.focusListener = this.props.navigation.addListener('focus', this.scrollToTop)
  }

  componentWillUnmount() {
    this.focusListener();
  }

  async onSubmit() {
    const { patientAge, gender, patientFullName, medicalCondition, implants } = this.props.route.params;
    const installsData = [];
    
    for (let i = 0; i < implants.length; i++) {
      const { implantLabelId, diameter, length, toothNum } = implants[i];
      installsData.push({
        toothNumber: toothNum,
        implant: {
          length,
          diameter,
          implantLabelId
        }
      },
      )
    }

    createVisit({
      patient: {
        age: patientAge,
        gender: gender,
        medicalCondition: medicalCondition,
        name: patientFullName
      },
      installs: installsData
    })
      .then((val: any) => {
        this.props.getVisitList();
        this.props.getImplantStatistics({
          timeline: 12,
          amount: { min: 0, max: 3000 },
          diameter: { min: 2, max: 10 },
          length: { min: 2, max: 54 }
        }, false
        );
        this.props.navigation.navigate("Implants List");
      }, (err) => {
        Alert.alert('', err.message, [
          {
            text: 'OK'
          },
        ]);
      }).catch((error) => {
        console.log(error.message)
      })
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

  goBack = () => {
    this.props.navigation.goBack();
  }

  goNext = (pageName: any) => {
    //this.props.navigation.navigate(pageName, { item: this.props.route.params.item });
  }

  getMedicalConditionName = (id: any) => {
    const medicalCondition = this.props.medicalConditions &&
      this.props.medicalConditions.filter((item: any) => item.id === id)[0];
    return (medicalCondition && medicalCondition.name) || "";
  }

  render() {
    const { route, navigation } = this.props;
    const { implantPhoto, implants, patientAge, patientFullName, medicalCondition, gender } = route.params;
    const installs = [];
    const toothNumbers: string[] = [];
    for (let i = 0; i < implants.length; i++) {
      const { length, implantLabel, ManufacturerModel,
        lot, diameter, toothNum } = implants[i];
      installs.push({
        Implant: {
          ImplantLabel: {
            imageUrl: implantPhoto,
            label: implantLabel,
            ManufacturerModel,
            length,
            lot,
            diameter,
          }
        },
        toothNum
      });
      toothNumbers.push(toothNum);
    }

    return (
      <Fragment>
        <SafeAreaView style={styles.saveAreaBackgrounColor} />
        <SafeAreaView style={styles.saveAreaView}>
          <View style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <Header title={"Summary"} navigation={navigation} />
            <ScrollView
              style={{ marginTop: 10 }}
              ref={ref => this.scrollView = ref}
              keyboardShouldPersistTaps='always' showsVerticalScrollIndicator={false}>
              <View style={styles.patientInformation}>
                <ImplantDetailsHeader createImplant={true} headerText={false} visit={{
                  Installs: installs,
                  date: Date.now()
                }}
                  title={I18n.t('patientInformation')} navigation={navigation} />
                <View style={[styles.column, { marginBottom: 5 }]}>
                  <View style={styles.patientContent}>
                    <PatientText text={patientFullName} placholder={I18n.t('fullName')} />
                    <Name />
                  </View>
                  <View style={styles.patientContent}>
                    <PatientText text={gender} placholder={I18n.t('gender')} />
                    <Gender />
                  </View>
                  <View style={styles.patientContent}>
                    <PatientText text={patientAge} placholder={I18n.t('age')} />
                    <Age />
                  </View>
                  <View style={styles.patientContent}>
                    <PatientText text={this.getMedicalConditionName(medicalCondition)} placholder={I18n.t('medicalCondition')} />
                    <MedicalCondition />
                  </View>
                  <View style={[styles.patientContent, { borderBottomWidth: 0 }]}>
                    <PatientText text={toothNumbers.join(", ")} placholder={I18n.t('toothNumber')} />
                    <Tooth />
                  </View>
                </View>
              </View>
            </ScrollView>
            <View style={{ justifyContent: "flex-end" }}>
              <LinearGradient colors={[Colors.whiteColor, '#e8e8e8']} style={[styles.bottomsRow, styles.shadow]}>
                <TouchableOpacity onPress={this.goBack}>
                  <Text style={styles.back}> {I18n.t("back")} </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => this.onSubmit()} style={{
                  flex: 1,
                  paddingRight: 10,
                  justifyContent: 'center'
                }}>
                  <Submit />
                </TouchableOpacity>
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
  patientInformation: {
    paddingLeft: '5%',
    paddingRight: '10%',
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
    fontSize: 12,
    opacity: 0.6,
    fontFamily: 'System',
    fontWeight: '300',
    fontStyle: 'normal',
    textAlign: 'left',
    color: Colors.blueColor,
    paddingTop: 2,
  },
  bottomsRow: {
    backgroundColor: "red",
    width: "100%",
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
    height: 85,
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
  back: {
    fontFamily: "Roboto",
    fontSize: 14,
    fontWeight: "300",
    textAlign: "center",
    color: Colors.blueColor,
    marginTop: 25,
    marginLeft: 30
  }
});

const mapStateToProps = (state: { constants: { medicalConditions: any }; }) => ({
  medicalConditions: state.constants.medicalConditions
});
export default connect(mapStateToProps, {
  getVisitList: visitActions.getVisitList,
  getImplantStatistics: visitActions.getImplantStatistics,
  getMedicalConditions: userActions.getMedicalConditions,
})(CreateImplantSummary);