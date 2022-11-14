import React, {Fragment} from 'react';
import { StyleSheet, View, Keyboard, ScrollView, Text ,Platform,SafeAreaView} from 'react-native';
import I18n from '../../l18n/I18n';
import { Formik } from 'formik';
import Input from '../../components/Input';
import AppButton from '../../components/Buttons/AppButton';
// @ts-ignore
import Logo from '../../../assets/images/logo.svg';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../styles/StyleSheet';
import * as userActions from '../../redux/actions/user';
import * as Yup from 'yup';
import { getStatusBarHeight} from 'react-native-status-bar-height';

interface ResetPasswordProps {
  verifyEmail: string;
  resetError: string;
  isResiting: boolean;
  verifyToken: string;
  resetPassword: (values: any) => void;
  reset: () => void;
}
interface Inputs {
  password: any;
}
const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .min(6,  I18n.t('invalidInformation'))
    .required( I18n.t('invalidInformation')),
});
class ResetPassword extends React.Component<ResetPasswordProps> {
  constructor(props: any) {
    super(props);
  }

  componentWillUnmount() {
    this.props.reset();
  }

  render() {
    const input: Inputs = { password: undefined };
    const { reset, resetPassword, isResiting, resetError, verifyToken, verifyEmail } = this.props;

    return (
      <Fragment>
      <SafeAreaView style={styles.saveAreaBackgrounColor} />
      <SafeAreaView style={styles.saveAreaView}>
      <Formik
        initialValues={{ password: '' }}
        onSubmit={(values) => {
          Keyboard.dismiss();
          resetPassword({ password: values.password, email: verifyEmail, token: verifyToken });
        }}
        validationSchema={resetPasswordSchema}>
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
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="always"
                  contentContainerStyle={styles.contentView}>
                  <View style={styles.content}>
                    <View style={styles.header}>
                      <Text style={styles.title}>{I18n.t('resetPasswordTitle')}</Text>
                    </View>
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
                    />
                    <Text style={styles.error}>
                      {touched.password && errors.password && errors.password}
                      {resetError && resetError}
                    </Text>
                    <View style={styles.btnContainer}>
                      <AppButton
                        loading={isResiting}
                        title={I18n.t('send')}
                        submit={handleSubmit}
                      />
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
  saveAreaBackgrounColor: {
    flex: 0,
    backgroundColor: Colors.themeColor,
  },
  saveAreaView: {
      flex: 1,
      backgroundColor: '#e8e8e8',
      paddingTop: Platform.OS === 'android' ?  getStatusBarHeight() : 0 ,
  },
  logo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.4,
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
    fontSize: 12,
  },
  btnContainer: { marginTop: 16 },
});
const mapStateToProps = (state: { user: { isResiting: any; resetError: any; verifyToken: any; verifyEmail: any }; }) => ({
  isResiting: state.user.isResiting,
  resetError: state.user.resetError,
  verifyToken: state.user.verifyToken,
  verifyEmail: state.user.verifyEmail,
});
export default connect(mapStateToProps, {
  resetPassword: userActions.resetPassword,
  reset: userActions.reset,
})(ResetPassword);
