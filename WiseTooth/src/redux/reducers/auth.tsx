import { LOGIN, LOGOUT, UPDATE_ACCOUNT } from '../actions/types';

export default (
  state = {
    isAuthenticated: false,
    token: '',
    userData: {}
  },
  action: { type: any; data: any },
) => {
  switch (action.type) {
    case LOGIN.PENDING: {
      return {
        ...state,
        isAuthenticated: false,
        token: '',
      };
    }
    case LOGIN.SUCCESS: {
      return {
        ...state,
        isAuthenticated: action.data.isNewUser ? false : true,
        token: action.data.token,
        userData: action.data.user || {}
      };
    }
    case LOGIN.ERROR: {
      return {
        ...state,
        isAuthenticated: false,
        token: '',
      };
    }
    case LOGOUT.SUCCESS: {
      return { ...state, isAuthenticated: false, token: '' };
    }
    case UPDATE_ACCOUNT.SUCCESS: {
      return {
        ...state,
        isAuthenticated: action.data.isNewUser ? false : true,
      };
    }
    default:
      return state;
  }
};
