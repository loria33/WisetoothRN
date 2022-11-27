import { call, all, takeLatest, put } from 'redux-saga/effects';
import {
  LOGIN,
  LOGOUT,
  //FACEBOOK_LOGIN,
  GOOGLE_LOGIN,
  LINKEDIN_LOGIN,
  TWITTER_LOGIN,
  FORGOT_PASSWORD,
  RESET_PASSWORD,
  VERIFY_CODE,
  UPDATE_ACCOUNT,
  UPDATE_PATIENT,
} from '../actions/types';
import * as userActions from '../actions/user';
import * as userApi from '../../api/user';
import navigationService from '../../navigation/navigationService';
import { showMessage } from "react-native-flash-message";
import * as visitActions from '../actions/visit';

function* logoutFlow() {
  yield put(userActions.logoutSuccess());
}

function* loginFlow(requestObj: { email: any; password: any; }) {
  try {
    const { email, password } = requestObj;
    debugger;
    const response = yield call(
      userApi.login,
      email.replace(/\s+/g, ''),
      password,
    );
    const { error } = response.data;
    if (error) {
      yield put(userActions.loginError(error));
    } else {
      const { token, user } = response.data;
      yield put(userActions.loginSuccess({ token, isNewUser: false, user }));
    }
  } catch (err:any) {
    const { error } = err.response.data;
    const errorObj = typeof error === 'string' ? error : (error.email || error.password)
    yield put(userActions.loginError(errorObj));
  }
}

function* facebookLoginFlow(requestObj: { accessToken: any; }) {
  try {
    const { accessToken } = requestObj
    const response = yield call(userApi.facebookLogin, accessToken);
    const { error } = response.data;
    if (error) {
      yield put(userActions.loginError(error));
    } else {
      const { token, user } = response.data;
      const { id, specialityId, experience, implantsPerYear } = user;
      const isNewUser = !specialityId || !experience || !implantsPerYear;
      yield put(userActions.loginSuccess({ token, isNewUser, user }));
      if (isNewUser) {
        navigationService.navigate('AccountDetails', { isToUpdateUser: true, id })
      }
    }
  } catch (err) {
    const { error } = err.response.data;
    yield put(userActions.loginError(error));
  }
}

function* googleLoginFlow(requestObj: { accessToken: any; }) {
  try {
    const { accessToken } = requestObj;
    const response = yield call(userApi.googleLogin, accessToken);
    const { error } = response.data;
    if (error) {
      yield put(userActions.loginError(error));
    } else {
      const { token, user } = response.data;
      const { id, specialityId, experience, implantsPerYear } = user;
      const isNewUser = !specialityId || !experience || !implantsPerYear;
      yield put(userActions.loginSuccess({ token, isNewUser, user }));
      if (isNewUser) {
        navigationService.navigate('AccountDetails', { isToUpdateUser: true, id })
      }
    }
  } catch (err) {
    const { error } = err.response.data;
    yield put(userActions.loginError(error));
  }
}

function* linkedinLoginFlow(requestObj: { accessToken: any; }) {
  try {
    const { accessToken } = requestObj;
    const response = yield call(userApi.linkedinLogin, accessToken);
    const { error } = response.data;
    if (error) {
      yield put(userActions.loginError(error));
    } else {
      const { token, user } = response.data;
      const { id, specialityId, experience, implantsPerYear } = user;
      const isNewUser = !specialityId || !experience || !implantsPerYear;
      yield put(userActions.loginSuccess({ token, isNewUser, user }));
      if (isNewUser) {
        navigationService.navigate('AccountDetails', { isToUpdateUser: true, id })
      }
    }
  } catch (err) {
    const { error } = err.response.data;
    yield put(userActions.loginError(error));
  }
}

function* twitterLoginFlow(requestObj: { authToken: any; secretToken: any; userId: any; }) {
  try {
    const { authToken, secretToken, userId } = requestObj;
    const response = yield call(
      userApi.twitterLogin,
      authToken,
      secretToken,
      userId,
    );
    const { error } = response.data;
    if (error) {
      yield put(userActions.loginError(error));
    } else {
      const { token, user } = response.data;
      const { id, specialityId, experience, implantsPerYear } = user;
      const isNewUser = !specialityId || !experience || !implantsPerYear;
      yield put(userActions.loginSuccess({ token, isNewUser, user }));
      if (isNewUser) {
        navigationService.navigate('AccountDetails', { isToUpdateUser: true, id })
      }
    }
  } catch (err) {
    const { error } = err.response.data;
    yield put(userActions.loginError(error));
  }
}

function* forgotPasswordFlow(requestObj: { email: any; }) {
  try {
    const { email } = requestObj;
    const response = yield call(userApi.forgotPassword, email);
    const { error } = response.data;
    if (error) {
      yield put(userActions.forgotPasswordError(error));
    } else {
      const { email, message } = response.data;
      yield put(userActions.forgotPasswordSuccess({ email }));
      showMessage({ message: message, type: 'success' })
      navigationService.navigate('VerificationCode');
    }
  } catch (err) {
    const { error } = err.response.data;
    const errorObj = typeof error === 'string' ? error : error.email
    yield put(userActions.forgotPasswordError(errorObj));
  }
}

function* verifyCodeFlow(requestObj: { code: any; email: any }) {
  try {
    const { code, email } = requestObj;
    const response = yield call(userApi.verifyCode, code, email);
    const { error } = response.data;
    if (error) {
      yield put(userActions.verifyCodeError(error));
    } else {
      const { token } = response.data;
      yield put(userActions.verifyCodeSuccess({ token }));
      navigationService.navigate('ResetPassword');
    }
  } catch (err) {
    const { error } = err.response.data;
    const errorObj = typeof error === 'string' ? error : (error.code || error.email)
    yield put(userActions.verifyCodeError(errorObj));
  }
}

function* resetPasswordFlow(requestObj: { email: string, password: string, token: string }) {
  try {
    const { password, token, email } = requestObj;
    const response = yield call(
      userApi.resetPassword,
      email,
      password,
      token
    );
    const { error } = response.data;
    if (error) {
      yield put(userActions.resetPasswordError(error));
    } else {
      const { message } = response.data;
      yield put(userActions.resetPasswordSuccess({ message }));
      showMessage({ message: message, type: 'success' })
      navigationService.navigate('Login');
    }
  } catch (err) {
    const { error } = err.response.data;
    const errorObj = typeof error === 'string' ? error : error.email
    yield put(userActions.resetPasswordError(errorObj));
  }
}

function* updateAccountFlow(requestObj: {
  id: string, specialityId: string,
  experience: string, implantsPerYear: string
}) {
  try {
    const { id, specialityId, experience, implantsPerYear } = requestObj;
    const response = yield call(
      userApi.updateAccount,
      id,
      specialityId,
      experience,
      implantsPerYear
    );
    const { error } = response.data;
    if (error) {
      yield put(userActions.updateAccountError(error));
    } else {
      const { message } = response.data;
      yield put(userActions.updateAccountSuccess({ isNewUser: false }));
      showMessage({ message: message, type: 'success' })
    }
  } catch (err) {
    const { error } = err.response.data;
    yield put(userActions.updateAccountError(error));
  }
}

function* updatePatientFlow({ data }: any) {
  try {
    const { patientFullName, gender, patientAge, medicalCondition, id } = data;
    const response = yield call(
      userApi.updatePatient,
      id,
      {
        gender,
        medicalCondition,
        age: patientAge,
        name: patientFullName
      }
    );
    const { error } = response.data;
    if (error) {
      yield put(userActions.updatePatientError(error));
    } else {
      const { message } = response.data;
      yield put(visitActions.getVisitList());
      yield put(userActions.updatePatientSuccess());
      showMessage({ message, type: 'success' });
      navigationService.navigate('PatientInformation', {
        item: {
          ...data, Patient: {
            id,
            age: patientAge,
            gender,
            medicalConditionId: medicalCondition,
            name: patientFullName
          }
        }
      });
    }
  } catch (err) {
    if (err.response.data === 'Unauthorized' && err.response.status === 401) {
      yield put(userActions.logoutSuccess());
    } else {
      const { error } = err.response.data;
      const errorMsg = typeof error === 'object' ? 'Server Error' : error
      yield put(userActions.updatePatientError(errorMsg));
      showMessage({ message: errorMsg, type: 'danger' })
    }
  }
}
export default function* userSaga() {
  return yield all([
    takeLatest(LOGIN.PENDING, loginFlow),
    takeLatest(LOGOUT.PENDING, logoutFlow),
  //  takeLatest(FACEBOOK_LOGIN.PENDING, facebookLoginFlow),
    takeLatest(GOOGLE_LOGIN.PENDING, googleLoginFlow),
    takeLatest(LINKEDIN_LOGIN.PENDING, linkedinLoginFlow),
    takeLatest(TWITTER_LOGIN.PENDING, twitterLoginFlow),
    takeLatest(FORGOT_PASSWORD.PENDING, forgotPasswordFlow),
    takeLatest(VERIFY_CODE.PENDING, verifyCodeFlow),
    takeLatest(RESET_PASSWORD.PENDING, resetPasswordFlow),
    takeLatest(UPDATE_ACCOUNT.PENDING, updateAccountFlow),
    takeLatest(UPDATE_PATIENT.PENDING, updatePatientFlow),
  ]);
}
