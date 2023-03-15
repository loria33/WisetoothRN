import React, {Component,Fragment,useCallback} from 'react';
import {View, Text,Linking, KeyboardAvoidingView, SafeAreaView,Keyboard,Alert} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {Formik} from 'formik';
import Input from '../../components/Input';
import I18n from '../../l18n/I18n';
import * as Yup from 'yup';
import {TouchableOpacity, ScrollView} from 'react-native-gesture-handler';
// @ts-ignore
import Wiseplant from '../../../assets/images/wiseplant.svg';
// @ts-ignore
import NextOff from '../../../assets/images/nextOff.svg';
// @ts-ignore
import NextOn from '../../../assets/images/nextOn.svg';
// @ts-ignore
import Person from '../../../assets/images/person.svg';
import {Styles} from './Styles';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { LoginStackParamList }  from "../../Models/AuthStackModel";
import { Colors } from '../../styles/StyleSheet';
import { validateEmail } from '../../api/user';
interface Inputs {
  email: any;
  name: any;
  password: any;
  verifyPassword: any;
}
const urlTerms='https://wiseimplant.tech/?page_id=1559';
const SignupSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required'),
  password: Yup.string()
    .min(6, 'Too Short!')
    .max(10, 'Too Long!')
    .required('Required'),
  verifyPassword: Yup.string()
    .min(6, 'Too Short!')
    .max(10, 'Too Long!')
    .required('Required')
    .test('match',
    'Passwords do not match',
     function(verifyPassword) {
       return verifyPassword === this.parent.password;
     }),
  email: Yup.string()
    .test('CheckIfEmailIsUsed', 'This email is used', async function (email: any) {
        if (!email || email == "")  {
          return true;
        } else {
          let data: any;
          await validateEmail(email).then((res: any) => {
            data = res.data.valid
          }).catch((err: any) => {
            data = true;
          });
          return data;
        }
      })
    .required('Required')
    .email('Invalid email')
    
    
});

                     
interface AccountProps {
  navigation: StackNavigationProp<LoginStackParamList, "Account">;
  route: RouteProp<LoginStackParamList, "Account">;
}

class Account extends Component<AccountProps> {

  constructor(props: AccountProps) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
    this.goBack = this.goBack.bind(this);
    this.termsAndConditions = this.termsAndConditions.bind(this);
    
  }

  onSubmit(values: any) {
    this.props.navigation.navigate("AccountDetails", {
      email: values.email,
      name: values.name,
      password: values.password,
      verifyPassword: values.verifyPassword
    });
  }

  
    async termsAndConditions () {
      // Checking if the link is supported for links with custom URL scheme.
      const supported = await Linking.canOpenURL(urlTerms);
  
      if (supported) {
        // Opening the link with some app, if the URL scheme is "http" the web link should be opened
        // by some browser in the mobile
        await Linking.openURL(urlTerms);
      } else {
        Alert.alert(`Don't know how to open this URL: ${urlTerms}`);
      }
    }
  

  goBack() {
    this.props.navigation.goBack();
  }

  render() {
    const input: Inputs = {email: undefined, name: undefined, password: undefined, verifyPassword: undefined};
    return (
      <Fragment>
      <SafeAreaView style={Styles.saveAreaBackgrounColor} />
      <SafeAreaView style={Styles.saveAreaView}>
      <View style={Styles.container}>
        <View style={Styles.top}>
          <Wiseplant/>
        </View>
        <ScrollView style={Styles.down} contentContainerStyle={{flexGrow: 1, backgroundColor: Colors.themeColor}}>
          <Formik
          initialValues={{ email: '', name: '', password: '', verifyPassword: ''}}
          onSubmit={this.onSubmit}
          validationSchema={SignupSchema}
          >
            {({ dirty, isValid, handleSubmit, values, setFieldValue, setFieldTouched, errors, touched
              }) => (
              <KeyboardAvoidingView behavior={"padding"}
                style={{flex: 1}}>
                <LinearGradient colors={[Colors.whiteColor, '#e8e8e8']} style={Styles.downView}>
                  <Text style={Styles.mainText}> {I18n.t('create_account')} </Text>
                  <View style={{...Styles.inputsContainer, marginTop: 20}}>
                      <Input
                        value={values.email}
                        reference={(c: any) => (input.email = c)}
                        onSubmitEditing={() => {
                          input.name.focus();
                        }}
                        autoCorrect={false}
                        placeholder={I18n.t('email')}
                        returnKeyType="next"
                        ChangeText={(text: string) => {
                          setFieldValue('email', text);
                        }}
                        errorMessage={errors.email}
                        touched={touched.email}
                        onBlur={() => {
                            setFieldTouched('email', true);
                        }}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        icon="email"
                        iconType="material-community"
                        hideErrorMsg={false}
                      />
                      
                      <Input
                        SvgIcon={Person}
                        value={values.name}
                        reference={(c: any) => (input.name = c)}
                        onSubmitEditing={() => {
                          input.password.focus();
                        }}
                        autoCorrect={false}
                        placeholder={I18n.t('name')}
                        returnKeyType="next"
                        ChangeText={(text: string) => {
                          setFieldValue('name', text);
                        }}
                        errorMessage={errors.name}
                        touched={touched.name}
                        onBlur={() => {
                          setFieldTouched('name', true);
                        }}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        hideErrorMsg={false}
                      />

                      <Input
                        value={values.password}
                        secureTextEntry={true}
                        reference={(c: any) => (input.password = c)}
                        onSubmitEditing={() => {
                          input.verifyPassword.focus();
                        }}
                        autoCorrect={false}
                        placeholder={I18n.t('password')}
                        returnKeyType="next"
                        ChangeText={(text: string) => {
                          setFieldValue('password', text);
                        }}
                        errorMessage={errors.password}
                        touched={touched.password}
                        onBlur={() => {
                          setFieldTouched('password', true);
                        }}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        icon="lock"
                        iconType="material-community"
                        hideErrorMsg={false}
                      />

                      <Input
                        value={values.verifyPassword}
                        secureTextEntry={true}
                        reference={(c: any) => (input.verifyPassword = c)}
                        onSubmitEditing={() => {
                          Keyboard.dismiss()
                        }}
                        autoCorrect={false}
                        placeholder={I18n.t('verifyPassword')}
                        returnKeyType="next"
                        ChangeText={(text: string) => {
                          setFieldValue('verifyPassword', text);
                        }}
                        errorMessage={errors.verifyPassword}
                        touched={touched.verifyPassword}
                        onBlur={() => {
                          setFieldTouched('verifyPassword', true);
                        }}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        icon="lock"
                        iconType="material-community"
                        hideErrorMsg={false}
                      />
                       <TouchableOpacity onPress={this.termsAndConditions} style={{justifyContent:'center',alignItems:'center'}}>
                        <View style={{flexDirection:'row'}}>
                           <Text>By tapping </Text><Text style={{fontWeight:'800'}}>Next</Text><Text> you are agreeing to the </Text>
                        </View>
                      <Text  style={{fontWeight:'800',textDecorationLine: 'underline',paddingTop:10}}>Terms & Conditions</Text>
                    </TouchableOpacity>
                    </View>
                   
                    <View style={Styles.bottomsRow}>
                      <TouchableOpacity onPress={this.goBack}>
                          <Text style={Styles.back}> {I18n.t("back")} </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleSubmit()}>
                          {dirty && isValid ? <NextOn /> : <NextOff />}
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

export default Account;
