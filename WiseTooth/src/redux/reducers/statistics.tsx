import {GET_IMPLANT_STATISTICS} from '../actions/types';

export default (
  state = {
    isLoading: false,
    statisticsError: ''
  },
  action: { type: any; res: any; error: any; },
) => {
  switch (action.type) {
    case GET_IMPLANT_STATISTICS.PENDING: {
      return {
        ...state,
        isLoading: true,
        statisticsError: '',
        statisticsList: undefined,
        filterOptions: undefined
      };
    }
    case GET_IMPLANT_STATISTICS.SUCCESS: {
      const {data, queryObj} = action.res;
      return {
        ...state,
        isLoading: false,
        statisticsError: '',
        statisticsList: data,
        filterOptions: queryObj
      };
    }
    case GET_IMPLANT_STATISTICS.ERROR: {
      return {
        ...state,
        isLoading: false,
        statisticsError: action.error,
        statisticsList: undefined,
        filterOptions: undefined
      };
    }
    default:
      return state;
  }
};
