import {
  LOGIN,
  FORGOT_PASSWORD,
  VERIFY_CODE,
  RESET_PASSWORD,
  RESET,
} from '../actions/types';

export default (
  state = {
    isLoggingIn: false,
    loggingInError: '',
  },
  action: { type: any; error: any; data: any },
) => {
  switch (action.type) {
    case LOGIN.PENDING: {
      return {
        ...state,
        isLoggingIn: true,
        loggingInError: '',
      };
    }
    case LOGIN.SUCCESS: {
      return {
        ...state,
        isLoggingIn: false,
        loggingInError: ''
      };
    }
    case LOGIN.ERROR: {
      return {
        ...state,
        isLoggingIn: false,
        loggingInError: action.error,
      };
    }
    case FORGOT_PASSWORD.PENDING: {
      return {
        ...state,
        isSending: true,
        sendError: '',
        verifyEmail: undefined,
        verifyToken: undefined,
      };
    }
    case FORGOT_PASSWORD.SUCCESS: {
      return {
        ...state,
        isSending: false,
        sendError: '',
        verifyEmail: action.data.email
      };
    }
    case FORGOT_PASSWORD.ERROR: {
      return {
        ...state,
        isSending: false,
        sendError: action.error,
        verifyEmail: undefined,
      };
    }

    case VERIFY_CODE.PENDING: {
      return {
        ...state,
        isVerifing: true,
        verifyError: '',
        verifyToken: undefined,

      };
    }
    case VERIFY_CODE.SUCCESS: {
      return {
        ...state,
        isVerifing: false,
        verifyError: '',
        verifyToken: action.data.token,
      };
    }
    case VERIFY_CODE.ERROR: {
      return {
        ...state,
        isVerifing: false,
        verifyError: action.error,
        verifyToken: undefined,
      };
    }

    case RESET_PASSWORD.PENDING: {
      return {
        ...state,
        isResiting: true,
        resetError: '',
      };
    }
    case RESET_PASSWORD.SUCCESS: {
      return {
        ...state,
        isResiting: false,
        resetError: '',
      };
    }
    case RESET_PASSWORD.ERROR: {
      return {
        ...state,
        isResiting: false,
        resetError: action.error,
      };
    }
    case RESET: {
      return {
        ...state,
        sendError: '',
        loggingInError: '',
        verifyError: '',
        resetError: '',
      };
    }
    default:
      return state;
  }
};
