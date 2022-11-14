import React, { Fragment } from 'react';
import { StyleSheet, View, Keyboard, ScrollView, Text,Platform,SafeAreaView } from 'react-native';
import I18n from '../../l18n/I18n';
import { Formik } from 'formik';
import Input from '../../components/Input';
import AppButton from '../../components/Buttons/AppButton';
// @ts-ignore
import Logo from '../../../assets/images/logo.svg';
import * as validation from '../../utils/validator';
import { connect } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../styles/StyleSheet';
import * as userActions from '../../redux/actions/user';
import { getStatusBarHeight} from 'react-native-status-bar-height';
interface VerificationCodeProps {
  verifyEmail: string;
  verifyError: string;
  isVerifing: boolean;
  verifyCode: (values: any) => void;
  reset: () => void;
}

interface Inputs {
  code: any;
}
class VerificationCode extends React.Component<VerificationCodeProps> {
  constructor(props: any) {
    super(props);
  }

  componentWillUnmount() {
    this.props.reset();
  }

  render() {
    const input: Inputs = { code: undefined };
    const { reset, verifyCode, verifyEmail, isVerifing, verifyError } = this.props;
    return (
      <Fragment>
      <SafeAreaView style={styles.saveAreaBackgrounColor} />
      <SafeAreaView style={styles.saveAreaView}>
      <Formik
        initialValues={{ code: '' }}
        onSubmit={(values) => {
          Keyboard.dismiss();
          verifyCode({ code: values.code, email: verifyEmail });
        }}
        validate={(values) => {
          const errors = {};
          if (validation.isEmpty(values.code)) {
            // @ts-ignore
            errors.code = I18n.t('invalidInformation');
          }
          return errors;
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
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="always"
                  contentContainerStyle={styles.contentView}>
                  <View style={styles.content}>
                    <View style={styles.header}>
                      <Text style={styles.title}>{I18n.t('forgotPassword')}</Text>
                    </View>
                    <Input
                      reference={(c) => (input.code = c)}
                      onSubmitEditing={handleSubmit}
                      autoCorrect={false}
                      placeholder={I18n.t('verificationCode')}
                      returnKeyType="go"
                      ChangeText={(text) => {
                        setFieldValue('code', text);
                        reset();
                      }}
                      errorMessage={errors.code}
                      touched={touched.code}
                      onBlur={() => {
                        if (values.code !== '')
                          setFieldTouched('code', true);
                      }}
                      autoCapitalize="none"
                      blurOnSubmit={false}
                      icon="lock"
                      iconType="material-community"
                      hideErrorMsg={true}
                    />
                    <Text style={styles.error}>
                      {touched.code && errors.code && errors.code}
                      {verifyError && verifyError}
                    </Text>
                    <View style={styles.btnContainer}>
                      <AppButton
                        loading={isVerifing}
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
    fontSize: 14,
    fontFamily: 'Roboto',
    fontWeight: 'normal',
    fontStyle: 'normal',
    textAlign: 'center',
  },
  error: {
    color: '#eb4859',
    fontSize: 14,
  },
  btnContainer: { marginTop: 16 },
});
const mapStateToProps = (state: { user: { isVerifing: any; verifyError: any; verifyEmail: any; }; }) => ({
  isVerifing: state.user.isVerifing,
  verifyError: state.user.verifyError,
  verifyEmail: state.user.verifyEmail
});
export default connect(mapStateToProps, {
  verifyCode: userActions.verifyCode,
  reset: userActions.reset,
})(VerificationCode);
