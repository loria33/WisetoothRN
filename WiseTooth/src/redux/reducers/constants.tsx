import {GET_MEDICAL_CONDITIONS, GET_MANUFACTURES} from '../actions/types';

export default (
  state = {
    isLoading: false,
    medicalConditionsError: ''
  },
  action: { type: any; data: any; error: any; },
) => {
  switch (action.type) {
    case GET_MEDICAL_CONDITIONS.PENDING: {
      return {
        ...state,
        isLoading: true,
        medicalConditionsError: ''
      };
    }
    case GET_MEDICAL_CONDITIONS.SUCCESS: {
      return {
        ...state,
        isLoading: false,
        medicalConditionsError: '',
        medicalConditions: action.data
      };
    }
    case GET_MEDICAL_CONDITIONS.ERROR: {
      return {
        ...state,
        isLoading: false,
        medicalConditionsError: action.error,
        medicalConditions: undefined
      };
    }


    case GET_MANUFACTURES.PENDING: {
      return {
        ...state,
        isLoading: true,
        manufacturesError: ''
      };
    }
    case GET_MANUFACTURES.SUCCESS: {
      return {
        ...state,
        isLoading: false,
        manufacturesError: '',
        manufactures: action.data
      };
    }
    case GET_MANUFACTURES.ERROR: {
      return {
        ...state,
        isLoading: false,
        manufacturesError: action.error,
        manufactures: undefined
      };
    }
    default:
      return state;
  }
};
