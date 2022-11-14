import React, { Component,Fragment } from 'react';
import { View, StyleSheet, SafeAreaView ,StatusBar, Text, Keyboard ,Platform} from 'react-native';
import { Colors } from '../../styles/StyleSheet';
import Header from '../../components/Header';
// @ts-ignore
import patientFullName from '../../../assets/images/name.svg';
// @ts-ignore
import Age from '../../../assets/images/age.svg';
// @ts-ignore
import No from '../../../assets/images/no.svg';
import * as Yup from 'yup';
import { Formik } from 'formik';
import Input from '../../components/Input';
import I18n from '../../l18n/I18n';
import LinearGradient from 'react-native-linear-gradient';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
// @ts-ignore
import NextOff14 from '../../../assets/images/nextOff14.svg';
// @ts-ignore
import NextOn34 from '../../../assets/images/nextOn34.svg';
// @ts-ignore
import Submit from '../../../assets/images/submit.svg';
// @ts-ignore
import MedicalCondition from '../../../assets/images/medicalCondition.svg';
// @ts-ignore
import Gender from '../../../assets/images/gender.svg';
import Picker from '../../components/Picker';
import { PickerModel } from '../../Models/GeneralModels';
import { CreateImplantParamList } from '../../Models/CreateImplantStackModel';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { getStatusBarHeight} from 'react-native-status-bar-height';
import { getMedicalConditions } from '../../api/user';
import _ from 'lodash';
import { connect } from 'react-redux';
import * as userActions from '../../redux/actions/user';
interface Inputs {
  patientFullName: any;
  patientAge: any;
}

const SignupSchema = Yup.object().shape({
  patientFullName: Yup.string()
    .required('The patient full name is required'),
  patientAge: Yup.string()
    .matches(/^[0-9]*$/, "This field must be a number")
    .required('Age field is required')
    .max(3, 'Length must be a maximum of 3 digits')
    .test('limit',
      "Your age can't be more than 120 years",
      function (patientAge: any) {
        return parseInt(patientAge) <= 120;
      }),
  gender: Yup.string()
    .required("Gender field is required"),
  medicalCondition: Yup.string()
    .required("Medical condition field is required")
});


interface CreateImplantPatientInformationProps {
  navigation: StackNavigationProp<CreateImplantParamList, "CreateImplantPatientInformation">;
  route: RouteProp<CreateImplantParamList, "CreateImplantPatientInformation">;
  updatePatient: (values: any) => void;
}

interface CreateImplantPatientInformationState {
  hideInputs: boolean;
}

class CreateImplantPatientInformation extends Component<CreateImplantPatientInformationProps, CreateImplantPatientInformationState> {

  private genderPicker: any;
  private medicalConditionPicker: any;
  private input: Inputs;

  constructor(props: any) {
    super(props);
    this.state = {
      hideInputs: false
    }
    this.goBack = this.goBack.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.hideInputs = this.hideInputs.bind(this);
    this.input = { patientFullName: undefined, patientAge: undefined };
  }

  goBack() {
    this.props.navigation.goBack();
  }

  onSubmit(values: any) {
    const visit = (this.props.route.params && this.props.route.params.visit);
    if (visit) {
      this.props.updatePatient({
        ...visit,
        ...values,
        id: visit.Patient.id,
        medicalCondition: typeof values.medicalCondition === 'string'
          ? values.medicalConditionId : values.medicalCondition
      });
    } else {
      this.props.navigation.navigate("CreateImplantSummary", {
        ...this.props.route.params,
        ...values
      });
    }
  }

  getGenderPickerValues(): Promise<PickerModel[]> {
    const genderValues = [{ name: "Male", id: 0 }, { name: "Female", id: 0 }]
    const promise = new Promise<PickerModel[]>(function (resolve) {
      /* missing implementation */
      // ["Male", "Female"]
      resolve(genderValues);
    });
    return promise;
  }

  async getMedicalConditionPickerValues(): Promise<PickerModel[]> {
    const response = await getMedicalConditions();
    const genderValues = response.data;
    const promise = new Promise<PickerModel[]>(function (resolve) {
      resolve(genderValues);
    });
    return promise;
  }

  hideInputs(after?: () => void) {
    this.setState({ hideInputs: !this.state.hideInputs }, () => {
      !this.state.hideInputs && after && after();
    });
  }

  render() {
    const visit = (this.props.route.params && this.props.route.params.visit) || {};
    const { Patient,  medicalCondition } = visit;
    const {name, age, gender, medicalConditionId} = Patient || {};
    return (
      <Fragment>
      <SafeAreaView style={styles.saveAreaBackgrounColor} />
      <SafeAreaView style={styles.saveAreaView}>
      <View style={styles.mainContainer}>
        <StatusBar translucent backgroundColor={Colors.whiteColor} barStyle="light-content" />
        <Header style={{paddingBottom:10}} title={"Patient Information"} navigation={this.props.navigation} />
        <ScrollView contentContainerStyle={{ flexGrow: 1 } }>
          <Text style={styles.mainText}>{_.isEmpty(visit) ? `Fill in the required patient’s information.` : `Edit patient’s information.`}</Text>
          <Formik
            initialValues={{
              patientFullName: name || '',
              gender: gender || '',
              patientAge: age ? age.toString() : '',
              medicalCondition: medicalCondition || '',
              medicalConditionId: medicalConditionId || ''
            }}
            onSubmit={this.onSubmit}
            validationSchema={SignupSchema}
          >
            {({ dirty, isValid, handleSubmit, values, setFieldValue, setFieldTouched, errors, touched
            }) => (
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 1, alignItems: "center", marginTop: 30 }}>
                    <Input
                      style={styles.inputStyle}
                      SvgIcon={patientFullName}
                      value={values.patientFullName}
                      reference={(c: any) => {
                        this.input.patientFullName = c;
                      }}
                      onSubmitEditing={() => {
                        this.genderPicker.open();
                        Keyboard.dismiss();
                      }}
                      autoCorrect={false}
                      placeholder={I18n.t('patientFullName')}
                      returnKeyType="next"
                      ChangeText={(text: string) => {
                        setFieldValue('patientFullName', text);
                      }}
                      errorMessage={errors.patientFullName}
                      touched={touched.patientFullName}
                      onBlur={() => {
                        setFieldTouched('patientFullName', true);
                      }}
                      autoCapitalize="none"
                      blurOnSubmit={false}
                      hideErrorMsg={false}
                    />
                    <Picker
                      onRef={(ref) => {
                        this.genderPicker = ref;
                      }}
                      fieldName={"gender"}
                      useIdAsATheValue={false}
                      style={[styles.pickerStyle, {
                        height: 50
                      }]}
                      value={values.gender}
                      SvgIcon={Gender}
                      label={"Gender"}
                      getSpecialities={this.getGenderPickerValues}
                      errorMessage={errors.gender}
                      setFieldValue={setFieldValue}
                      touched={touched.gender}
                      hideOverlappingViews={() => this.hideInputs(() => this.input.patientAge.focus())}
                    />
                    {!this.state.hideInputs ? <View style={{ width: "100%", alignItems: "center" }}>
                      <Input
                        style={styles.inputStyle}
                        SvgIcon={Age}
                        keyboardType='numeric'
                        value={values.patientAge}
                        reference={(c: any) => (this.input.patientAge = c)}
                        onSubmitEditing={() => {
                          this.medicalConditionPicker.open();
                          Keyboard.dismiss();
                        }}
                        autoCorrect={false}
                        placeholder={I18n.t('age')}
                        returnKeyType="done"
                        ChangeText={(text: string) => {
                          setFieldValue('patientAge', text);
                        }}
                        errorMessage={errors.patientAge}
                        touched={touched.patientAge}
                        onBlur={() => {
                          setFieldTouched('patientAge', true);
                        }}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        hideErrorMsg={false}
                      />

                    </View> :
                      <View style={{ height: 65 }} />}

                    <Picker
                      onRef={(ref) => {
                        this.medicalConditionPicker = ref;
                      }}
                      useIdAsATheValue={true}
                      fieldName={"medicalCondition"}
                      onDropdownOpen={() => setFieldTouched('medicalCondition', true)}
                      value={values.medicalCondition}
                      SvgIcon={MedicalCondition}
                      label={"Medical condition"}
                      getSpecialities={this.getMedicalConditionPickerValues}
                      errorMessage={errors.medicalCondition}
                      setFieldValue={setFieldValue}
                      touched={touched.medicalCondition}
                      style={styles.pickerStyle}
                      pickerStyle={styles.picker}
                      lastView={true}
                    />
                  </View>
                  <View style={{ flex: 1, justifyContent: "flex-end" }}>
                    <LinearGradient colors={[Colors.whiteColor, '#e8e8e8']} style={[styles.bottomsRow, styles.shadow]}>
                      <TouchableOpacity onPress={this.goBack}>
                        <Text style={styles.back}> {I18n.t("back")} </Text>
                      </TouchableOpacity>
                      {!_.isEmpty(visit) ?
                        <TouchableOpacity onPress={() => handleSubmit()}>
                          <Submit />
                        </TouchableOpacity> :
                        
                        <TouchableOpacity onPress={() => {
                          handleSubmit();
                        }}>
                          {dirty && isValid ? <NextOn34 /> : <NextOn34 style={{ opacity: 0.5 }}/>}
                        </TouchableOpacity>
                      }
                    </LinearGradient>
                  </View>
                </View>
              )}
          </Formik>
        </ScrollView>
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
    paddingTop:20,
    fontFamily: "Roboto",
    fontSize: 14,
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
    height: 85,
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
  },
  pickerStyle: {
    width: "90%",
    marginTop: 5
  },
  inputStyle: {
    width: "90%",
  },
  picker: {
    marginLeft: 0,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'center',
    minWidth: '90%',
    height: '100%',
  },

});

const mapStateToProps = () => ({});
export default connect(mapStateToProps, {
  updatePatient: userActions.updatePatient,
})(CreateImplantPatientInformation);
