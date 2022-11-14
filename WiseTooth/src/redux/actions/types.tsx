import createActionSet from '../../utils/action-helper';

export const LOGIN = createActionSet('LOGIN');
export const LOGOUT = createActionSet('LOGOUT');
export const FACEBOOK_LOGIN = createActionSet('FACEBOOK_LOGIN');
export const GOOGLE_LOGIN = createActionSet('GOOGLE_LOGIN');
export const LINKEDIN_LOGIN = createActionSet('LINKEDIN_LOGIN');
export const TWITTER_LOGIN = createActionSet('TWITTER_LOGIN');
export const FORGOT_PASSWORD = createActionSet('FORGOT_PASSWORD');
export const VERIFY_CODE = createActionSet('VERIFY_CODE');
export const RESET_PASSWORD = createActionSet('RESET_PASSWORD');
export const RESET = "RESET"
export const GET_VISIT_LIST = createActionSet("GET_VISIT_LIST");
export const SEARCH_ON_VISIT_LIST = createActionSet("SEARCH_ON_VISIT_LIST");
export const UPDATE_ACCOUNT = createActionSet("UPDATE_ACCOUNT");
export const CREATE_REPORT = createActionSet("CREATE_REPORT");
export const GET_IMPLANT_STATISTICS = createActionSet("GET_IMPLANT_STATISTICS");
export const GET_MEDICAL_CONDITIONS = createActionSet("GET_MEDICAL_CONDITIONS");
export const GET_MANUFACTURES = createActionSet("GET_MANUFACTURES");
export const UPDATE_PATIENT = createActionSet("UPDATE_PATIENT");
export const EDIT_REPORT = createActionSet("EDIT_REPORT");
export const SET_LIST_FLAG = "SET_LIST_FLAG";