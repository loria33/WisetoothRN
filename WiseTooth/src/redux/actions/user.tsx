import {
  LOGIN,
  LOGOUT,
  GOOGLE_LOGIN,
 // FACEBOOK_LOGIN,
  LINKEDIN_LOGIN,
  TWITTER_LOGIN,
  FORGOT_PASSWORD,
  VERIFY_CODE,
  RESET_PASSWORD,
  RESET,
  UPDATE_ACCOUNT,
  GET_MEDICAL_CONDITIONS,
  GET_MANUFACTURES,
  UPDATE_PATIENT
} from './types';

export const login = (requestObj: { email: any; password: any; }) => ({
  type: LOGIN.PENDING,
  email: requestObj.email,
  password: requestObj.password,
});
export const loginError = (error: string) => ({ type: LOGIN.ERROR, error });
export const loginSuccess = (data: object) => ({
  type: LOGIN.SUCCESS,
  data,
});

export const logout = () => ({ type: LOGOUT.PENDING });
export const logoutError = (error: string) => ({ type: LOGOUT.ERROR, error });
export const logoutSuccess = () => ({ type: LOGOUT.SUCCESS });

// export const facebookLogin = (accessToken: string) => ({
//   type: FACEBOOK_LOGIN.PENDING,
//   accessToken,
// });
export const googleLogin = (accessToken: string) => ({
  type: GOOGLE_LOGIN.PENDING,
  accessToken,
});
export const linkedinLogin = (accessToken: string) => ({
  type: LINKEDIN_LOGIN.PENDING,
  accessToken,
});
export const twitterLogin = (authToken: string, secretToken: string, userId: string) => ({
  type: TWITTER_LOGIN.PENDING,
  authToken,
  secretToken,
  userId,
});

export const forgotPassword = (requestObj: { email: any; }) => ({
  type: FORGOT_PASSWORD.PENDING,
  email: requestObj.email,
});
export const forgotPasswordError = (error: string) => ({
  type: FORGOT_PASSWORD.ERROR,
  error,
});
export const forgotPasswordSuccess = (data: object) => ({
  type: FORGOT_PASSWORD.SUCCESS,
  data,
});

export const verifyCode = (requestObj: { code: any; email: any }) => ({
  type: VERIFY_CODE.PENDING,
  code: requestObj.code,
  email: requestObj.email
});
export const verifyCodeError = (error: string) => ({
  type: VERIFY_CODE.ERROR,
  error,
});
export const verifyCodeSuccess = (data: object) => ({
  type: VERIFY_CODE.SUCCESS,
  data,
});
export const resetPassword = (requestObj: { password: any; token: any; email: any }) => ({
  type: RESET_PASSWORD.PENDING,
  password: requestObj.password,
  token: requestObj.token,
  email: requestObj.email,
});
export const resetPasswordError = (error: string) => ({
  type: RESET_PASSWORD.ERROR,
  error,
});
export const resetPasswordSuccess = (data: object) => ({
  type: RESET_PASSWORD.SUCCESS,
  data,
});
export const reset = () => ({
  type: RESET,
})

export const updateAccount = (data: object) => ({ type: UPDATE_ACCOUNT.PENDING, ...data });
export const updateAccountError = (error: string) => ({ type: UPDATE_ACCOUNT.ERROR, error });
export const updateAccountSuccess = (data: any) => ({ type: UPDATE_ACCOUNT.SUCCESS,  data });


export const getMedicalConditions = () => ({ type: GET_MEDICAL_CONDITIONS.PENDING });
export const getMedicalConditionsError = (error: string) => ({ type: GET_MEDICAL_CONDITIONS.ERROR, error });
export const getMedicalConditionsSuccess = (data: any) => ({ type: GET_MEDICAL_CONDITIONS.SUCCESS,  data });

export const getManufactures = () => ({ type: GET_MANUFACTURES.PENDING });
export const getManufacturesError = (error: string) => ({ type: GET_MANUFACTURES.ERROR, error });
export const getManufacturesSuccess = (data: any) => ({ type: GET_MANUFACTURES.SUCCESS,  data });

export const updatePatient = (data: object) => ({ type: UPDATE_PATIENT.PENDING, data });
export const updatePatientError = (error: string) => ({ type: UPDATE_PATIENT.ERROR, error });
export const updatePatientSuccess = () => ({ type: UPDATE_PATIENT.SUCCESS });
