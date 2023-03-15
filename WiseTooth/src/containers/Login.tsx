import React, { Fragment } from 'react';
import { StyleSheet, Keyboard, Text, View,SafeAreaView, TouchableOpacity, ScrollView ,Platform} from 'react-native';
import { Formik } from 'formik';
import * as validation from '../utils/validator';
import Input from '../components/Input';
import I18n from '../l18n/I18n';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
//import FaceBookButton from '../components/Buttons/FaceBookButton';
import GoogleButton from '../components/Buttons/GoogleButton';
import TwitterButton from '../components/Buttons/TwitterButton';
import LinkedinButton from '../components/Buttons/LinkedinButton';
import AppleButton from '../components/Buttons/AppleButton';
import * as userActions from '../redux/actions/user';
// @ts-ignore
import Logo from '../../assets/images/logo.svg';
import AppButton from '../components/Buttons/AppButton';
import { StackNavigationProp } from '@react-navigation/stack';
import { CommonActions } from '@react-navigation/native';
import { Colors } from '../styles/StyleSheet';
import { getStatusBarHeight} from 'react-native-status-bar-height';


interface LoginProps {
  login: (values: any) => void;
  isLoggingIn: boolean;
  //facebookLogin: (values: any) => void;
  googleLogin: (values: any) => void;
  linkedinLogin: (values: any) => void;
  twitterLogin: (values: any) => void;
  appleLogin: (values: any) => void;
  loggingInError: string;
  reset: () => void;
  navigation: StackNavigationProp<{
    ForgotPassword: undefined;
  }, "ForgotPassword">;
  route: any;
}

interface Inputs {
  email: any;
  password: any;
}
class Login extends React.Component<LoginProps> {
  formRef: any;
  focusListener: any;
  scrollView: any;
  constructor(props: any) {
    super(props);
  }

 

  resetForm = () => {
    this.formRef.resetForm({
      email: undefined,
      password: undefined
    });
    this.formRef.setErrors({
      email: undefined,
      password: undefined
    });
  }
  navigateToRegisterView = () => {
    this.props.navigation.dispatch(
      CommonActions.navigate({
        name: 'Account',
        params: {},
      })
    );
  };

  navigateToForgotPasswordView = () => {
    this.props.navigation.navigate('ForgotPassword');
  };

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('focus', this.scrollToTop)
  }

  componentWillUnmount() {
    this.props.reset();
    this.focusListener();
  }

  scrollToTop = () => {
    this.props.reset();
    this.resetForm();
    this.scrollView &&
      this.scrollView.scrollTo && this.scrollView.scrollTo({ x: 0, y: 0, animated: false })
  }

  render() {
    const input: Inputs = { email: undefined, password: undefined };
    const {
      login,
      isLoggingIn,
      googleLogin,
      linkedinLogin,
      twitterLogin,
      appleLogin,
      loggingInError,
      reset,
      route,
    } = this.props;
    const regValues = (route.params && route.params.values) || {};
    return (
      <Fragment>
      <SafeAreaView style={styles.saveAreaBackgrounColor} />
      <SafeAreaView style={styles.saveAreaView}>
      <Formik
        innerRef={form => this.formRef = form}
        initialValues={{
          email: '',
          password: '',
        }}
        validate={(values) => {
          const errors = {};
          if (validation.isEmpty(values.password) && validation.isEmpty(regValues.password)) {
            // @ts-ignore
            errors.password = I18n.t('invalidInformation');
          }
          if (validation.isEmpty(values.email) && validation.isEmpty(regValues.email)) {
            // @ts-ignore
            errors.email = I18n.t('invalidInformation');
          }
          return errors;
        }}
        onSubmit={(values) => {
          Keyboard.dismiss();
          login({
            email: values.email || regValues.email,
            password: values.password || regValues.password
          });
        }}>
        {({
          setFieldValue,
          setFieldTouched,
          errors,
          touched,
          values,
          handleSubmit,
        }) => (
            <View style={styles.container}>
              <View style={styles.logo}>
                <Logo />
              </View>
              <LinearGradient
                colors={[Colors.whiteColor, '#e8e8e8']}
                style={styles.linearGradient}>
                <ScrollView
                  ref={ref => this.scrollView = ref}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="always"
                  contentContainerStyle={styles.contentView}>
                  <View style={styles.content}>
                    <View style={styles.header}>
                      <Text style={styles.title}>{I18n.t('signInTitle')}</Text>
                    </View>
                    <View>
                      <Input
                        reference={(c) => (input.email = c)}
                        onSubmitEditing={() => {
                          input.password.focus();
                        }}
                        autoCorrect={false}
                        placeholder={I18n.t('email')}
                        returnKeyType="next"
                        ChangeText={(text) => {
                          setFieldValue('email', text);
                          reset();
                        }}
                        errorMessage={errors.email}
                        touched={touched.email}
                        onBlur={() => {
                          if (values.email !== '') setFieldTouched('email', true);
                        }}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        icon="email"
                        iconType="material-community"
                        hideErrorMsg={true}
                        value={regValues.email ||  values.email}
                      />
                      <Input
                        reference={(c) => (input.password = c)}
                        placeholder={I18n.t('password')}
                        secureTextEntry={true}
                        returnKeyType="go"
                        autoCorrect={false}
                        ChangeText={(text) => {
                          setFieldValue('password', text);
                          reset();
                        }}
                        errorMessage={errors.password}
                        touched={touched.password}
                        onBlur={() => {
                          if (values.password !== '')
                            setFieldTouched('password', true);
                        }}
                        onSubmitEditing={handleSubmit}
                        autoCapitalize="none"
                        blurOnSubmit={false}
                        icon="lock"
                        iconType="material-community"
                        hideErrorMsg={true}
                        value={regValues.password || values.password}
                      />
                      <View style={styles.row}>
                        <Text style={styles.error}>
                          {(touched.password ? errors.password : '') ||
                            (touched.email ? errors.email : '')}
                          {loggingInError && loggingInError}
                        </Text>
                        <TouchableOpacity
                          onPress={this.navigateToForgotPasswordView}>
                          <Text style={styles.text}>
                            {I18n.t('forgotPasswordButton')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View>
                        <AppButton
                          loading={isLoggingIn}
                          title={I18n.t('login')}
                          submit={handleSubmit}
                        />
                      </View>
                      <View style={styles.column}>
                        <Text style={[styles.text, styles.blue, styles.subText]}>
                          {I18n.t('dontHaveAnAccount')}
                        </Text>
                        <TouchableOpacity onPress={this.navigateToRegisterView}>
                          <Text style={[styles.text, styles.register]}>
                            {I18n.t('register')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View style={styles.column}>
                        <Text
                          style={[styles.text, styles.blue, styles.conectText]}>
                          {I18n.t('conect')}
                        </Text>
                        <View style={styles.imgContainer}>
   
                          <GoogleButton login={googleLogin} />
                          <TwitterButton login={twitterLogin} />
                          <LinkedinButton login={linkedinLogin} />
                          <AppleButton login={appleLogin} />
                        </View>
                      </View>
                    </View>
                  </View>
                </ScrollView>
              </LinearGradient>
            </View>
          )}
      </Formik>
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
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.4,
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
  scrollView: {
    flex: 1,
  },
  linearGradient: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    flex: 1,
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
    width: '80%',
    flexDirection: 'column',
  },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 24,
  },
  text: {
    color: Colors.themeColor,
    fontSize: 13,
    fontFamily: 'Roboto',
    fontWeight: '300',
    fontStyle: 'normal',
    textAlign: 'right',
  },
  conectText: {
    fontSize: 13,
  },
  subText: {
    fontSize: 13,
    fontWeight: 'normal',
    textAlign: 'center',
  },
  register: {
    fontSize: 14,
    fontWeight: '500',
  },
  title: {
    color: Colors.blueColor,
    fontSize: 15,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  error: {
    color: '#eb4859',
    fontSize: 14,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  column: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  blue: {
    color: Colors.blueColor,
  },
  imgContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
});
const mapStateToProps = (state: { user: { isLoggingIn: any; loggingInError: any; }; }) => ({
  isLoggingIn: state.user.isLoggingIn,
  loggingInError: state.user.loggingInError,
});
export default connect(mapStateToProps, {
  login: userActions.login,
  googleLogin: userActions.googleLogin,
  linkedinLogin: userActions.linkedinLogin,
  twitterLogin: userActions.twitterLogin,
  reset: userActions.reset,
})(Login);
