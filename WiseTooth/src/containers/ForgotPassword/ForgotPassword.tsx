import React, {Fragment} from 'react';
import { StyleSheet, View, Keyboard,SafeAreaView, TouchableOpacity,ScrollView, Text,Platform } from 'react-native';
import I18n from '../../l18n/I18n';
import { Formik } from 'formik';
import Input from '../../components/Input';
import AppButton from '../../components/Buttons/AppButton';
// @ts-ignore
import Logo from '../../../assets/images/logo.svg';
import * as validation from '../../utils/validator';
import { connect } from 'react-redux';
import * as userActions from '../../redux/actions/user';
import LinearGradient from 'react-native-linear-gradient';
import { Colors } from '../../styles/StyleSheet';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { LoginStackParamList }  from "../../Models/AuthStackModel";
import { getStatusBarHeight} from 'react-native-status-bar-height';

interface ForgotPasswordProps {
  sendError: string;
  isSending: boolean;
  forgotPassword: (values: any) => void;
  reset: () => void;
  navigation: StackNavigationProp<LoginStackParamList, "Account">;
  route: RouteProp<LoginStackParamList, "Account">;
}

interface Inputs {
  email: any;
}
class ForgotPassword extends React.Component<ForgotPasswordProps> {
  constructor(props: any) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }
  componentWillUnmount() {
    this.props.reset();
  }
  goBack() {
    this.props.navigation.goBack();
  }
  render() {
    const input: Inputs = { email: undefined };
    const { isSending, sendError, reset, forgotPassword } = this.props;
    return (
      <Fragment>
      <SafeAreaView style={styles.saveAreaBackgrounColor} />
      <SafeAreaView style={styles.saveAreaView}>
      <Formik
        initialValues={{ email: '' }}
        onSubmit={(values) => {
            Keyboard.dismiss();
            forgotPassword(values);
        }}
        validate={(values) => {
          const errors = {};
          if (validation.isEmpty(values.email)) {
            // @ts-ignore
            errors.email = I18n.t('forgotPasswordError');
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
                      reference={(c) => (input.email = c)}
                      onSubmitEditing={handleSubmit}
                      autoCorrect={false}
                      placeholder={I18n.t('email')}
                      returnKeyType="go"
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
                    />
                    <Text style={styles.error}>
                      {touched.email && errors.email && errors.email}
                      {sendError && sendError}
                    </Text>
                    <View style={styles.btnContainer}>
                      <AppButton
                        loading={isSending}
                        title={I18n.t('send')}
                        submit={handleSubmit}
                      />
                    </View>
                  </View>
                </ScrollView>
                      <View style={{width: '100%',
                height: 70, 
                justifyContent: 'flex-start', 
                alignSelf: 'center',
                position: 'absolute', 
                bottom: 0, }}>
                <LinearGradient
                  colors={[Colors.whiteColor, '#e8e8e8']}
                  style={styles.footerLinearGradient}>
                  <View style={styles.footer}>
                    <TouchableOpacity onPress={this.goBack} style={[styles.footerContent]}><Text style={styles.back}>{I18n.t('back')}</Text></TouchableOpacity>
                    <View />
                  </View>
                    </LinearGradient>
                  </View>
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
    fontSize: 12,
    fontWeight: '300',
    fontStyle: 'normal',
    textAlign: 'center',
    color: Colors.blueColor,
    paddingLeft: 15
  },
  footerContent: {
    justifyContent: 'flex-start',
    alignSelf: 'center',
  },
  btnContainer: { marginTop: 16 },
});
const mapStateToProps = (state: { user: { isSending: any; sendError: any; }; }) => ({
  isSending: state.user.isSending,
  sendError: state.user.sendError,
});
export default connect(mapStateToProps, {
  forgotPassword: userActions.forgotPassword,
  reset: userActions.reset,
})(ForgotPassword);
