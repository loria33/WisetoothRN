import React, { Component,Fragment } from 'react';
import { View, Text, KeyboardAvoidingView,SafeAreaView, Keyboard } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Formik } from 'formik';
import Input from '../../components/Input';
import Picker from '../../components/Picker';
import I18n from '../../l18n/I18n';
import * as Yup from 'yup';
import { TouchableOpacity, ScrollView } from 'react-native-gesture-handler';
// @ts-ignore
import Wiseplant from '../../../assets/images/wiseplant.svg';
// @ts-ignore
import NextOff from '../../../assets/images/nextOff.svg';
// @ts-ignore
import Register from '../../../assets/images/register.svg';
// @ts-ignore
import Star from '../../../assets/images/star.svg';
// @ts-ignore
import Implants from '../../../assets/images/implants.svg';
// @ts-ignore
import Speciality from '../../../assets/images/speciality.svg';
import { Styles } from './Styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { LoginStackParamList } from "../../Models/AuthStackModel";
import { register, getSpecialities } from "../../api/user";
import Reactotron from '../../config/ReactotronConfig';
import { Colors } from '../../styles/StyleSheet';
import { PickerModel } from '../../Models/GeneralModels';
import { connect } from 'react-redux';
import * as userActions from '../../redux/actions/user';

interface Inputs {
  experience: any;
  implantsPerYear: any;
}

interface AccountDetailsValues {
  specialityId: string;
  experience: string;
  implantsPerYear: string;
}

const SignupSchema = Yup.object().shape({
  experience: Yup.string()
    .matches(/^[0-9]*$/, "This field must be a number")
    .required('The experience is required')
    .max(2, 'Length must be a maximum of 2 digits')
    .test('limit',
      "You can't have more than 50 years of experience",
      function (experience: any) {
        return parseInt(experience) <= 50;
      }),
  implantsPerYear: Yup.string()
    .matches(/^[0-9]*$/, "This field must be a number")
    .required('The estimated number of implants per year is required')
    .max(4, 'Length must be a maximum of 4 digits'),
  specialityId: Yup.string()
    .required("Speciality field is required")
});

interface AccountProps {
  navigation: StackNavigationProp<LoginStackParamList, "AccountDetails">
  route: RouteProp<LoginStackParamList, "AccountDetails">;
  updateAccount: (values: any) => void;
}

interface AccountState {
  hideInputs: boolean;
}

class AccountDetails extends Component<AccountProps, AccountState> {

  private input: Inputs;
  constructor(props: any) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.goBack = this.goBack.bind(this);
    this.state = {
      hideInputs: false
    }
    this.hideInputs = this.hideInputs.bind(this);
    this.onUpdate = this.onUpdate.bind(this);
    this.input = { implantsPerYear: undefined, experience: undefined };
  }

  onSubmit(values: AccountDetailsValues) {
    this.props.navigation.navigate("ThankYou", { values: this.props.route.params });
    this.registerAccount(values);
  }

  onUpdate(values: AccountDetailsValues) {
    this.props.updateAccount({ ...values, id: this.props.route.params.id })
  }

  registerAccount(values: AccountDetailsValues) {
    let registerationData = { ...this.props.route.params, ...values };
    // @ts-ignore
    Reactotron.log(registerationData)
    register({ ...registerationData })
  }

  goBack() {
    this.props.navigation.goBack();
  }

  hideInputs(after?: () => void) {
    this.setState({ hideInputs: !this.state.hideInputs }, () => {
      !this.state.hideInputs && after && after();
    });
  }

  async getPickerSpecialities(): Promise<PickerModel[]> {
    const response = await getSpecialities();
    const specialities = response.data;
    var promise = new Promise<PickerModel[]>(function(resolve, reject) {
      /* missing implementation */
      resolve(specialities);
    });
    return promise;
  }

  render() {
    const input: Inputs = { experience: undefined, implantsPerYear: undefined };
    return (
      <Fragment>
      <SafeAreaView style={Styles.saveAreaBackgrounColor} />
      <SafeAreaView style={Styles.saveAreaView}>
      <View style={Styles.container}>
        <View style={Styles.top}>
          <Wiseplant width={120} height={140} />
        </View>
        <ScrollView style={Styles.down} contentContainerStyle={{ flexGrow: 1, backgroundColor: Colors.themeColor }}>
          <Formik
            initialValues={{ specialityId: '', experience: '', implantsPerYear: '' }}
            onSubmit={this.props.route.params.isToUpdateUser ? this.onUpdate : this.onSubmit}
            validationSchema={SignupSchema}
          >
            {({ dirty, isValid, handleSubmit, values, setFieldValue, setFieldTouched, errors, touched
            }) => (
                <KeyboardAvoidingView behavior={"height"}
                  style={{ flex: 1 }}>
                  <LinearGradient colors={[Colors.whiteColor, '#e8e8e8']} style={Styles.downView}>
                    <Text style={Styles.mainText}> {I18n.t('account_details')} </Text>
                    <View style={{ ...Styles.inputsContainer, width: "80%" }}>
                      <Picker value={values.specialityId}
                        fieldName={"specialityId"}
                        useIdAsATheValue={true}
                        label={"Specialty"}
                        style={{marginTop: 20}}
                        SvgIcon={Speciality}
                        getSpecialities={this.getPickerSpecialities}
                        errorMessage={errors.specialityId}
                        setFieldValue={setFieldValue}
                        touched={touched.specialityId}
                        hideOverlappingViews={() => this.hideInputs(() => this.input.experience.focus())} />
                      {!this.state.hideInputs && <View>
                        <Input
                          SvgIcon={Star}
                          value={values.experience}
                          keyboardType='numeric'
                          reference={(c: any) => (this.input.experience = c)}
                          onSubmitEditing={() => {
                            input.implantsPerYear.focus()
                          }}
                          onFocus={() => setFieldTouched('specialityId', true)}
                          autoCorrect={false}
                          placeholder={I18n.t('experience')}
                          returnKeyType="done"
                          ChangeText={(text: string) => {
                            setFieldValue('experience', text);
                          }}
                          errorMessage={errors.experience}
                          touched={touched.experience}
                          onBlur={() => {
                            setFieldTouched('experience', true);
                          }}
                          autoCapitalize="none"
                          blurOnSubmit={false}
                          hideErrorMsg={false}
                        />
                        <Input
                          SvgIcon={Implants}
                          value={values.implantsPerYear}
                          keyboardType='numeric'
                          reference={(c: any) => (input.implantsPerYear = c)}
                          onSubmitEditing={() => {
                            Keyboard.dismiss()
                          }}
                          autoCorrect={false}
                          placeholder={I18n.t('implants')}
                          returnKeyType="done"
                          ChangeText={(text: string) => {
                            setFieldValue('implantsPerYear', text);
                          }}
                          errorMessage={errors.implantsPerYear}
                          touched={touched.implantsPerYear}
                          onBlur={() => {
                            setFieldTouched('implantsPerYear', true);
                          }}
                          autoCapitalize="none"
                          blurOnSubmit={false}
                          hideErrorMsg={false}
                        />
                      </View>}
                    </View>
                    <View style={Styles.bottomsRow}>
                      <TouchableOpacity onPress={this.goBack}>
                        <Text style={Styles.back}> {I18n.t("back")} </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleSubmit()}>
                        {dirty && isValid ? <Register /> : <NextOff />}
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </KeyboardAvoidingView>
              )}
          </Formik>
        </ScrollView>
      </View>
      </SafeAreaView>
      </Fragment>
    );
  }
}

const mapStateToProps = () => ({});
export default connect(mapStateToProps, {
  updateAccount: userActions.updateAccount,
})(AccountDetails);