import {GET_VISIT_LIST, SEARCH_ON_VISIT_LIST, SET_LIST_FLAG} from '../actions/types';

export default (
  state = {
    isLoading: false,
    visitListError: ''
  },
  action: { type: any; visits: any; error: any; },
) => {
  switch (action.type) {
    case GET_VISIT_LIST.PENDING: {
      return {
        ...state,
        isLoading: true,
        visitListError: '',
        visitsList: undefined,
        visitsListWithoutFilter: undefined,
        isSearchDone: false,
      };
    }
    case GET_VISIT_LIST.SUCCESS: {
      return {
        ...state,
        isLoading: false,
        visitListError: '',
        visitsList: action.visits,
        visitsListWithoutFilter: action.visits
      };
    }
    case GET_VISIT_LIST.ERROR: {
      return {
        ...state,
        isLoading: false,
        visitListError: action.error,
        visitsList: undefined,
        visitsListWithoutFilter: undefined
      };
    }

    case SEARCH_ON_VISIT_LIST.PENDING: {
      return {
        ...state,
        isLoading: true,
        visitListError: '',
        visitsList: undefined,
        isSearchDone: false,
      };
    }
    case SEARCH_ON_VISIT_LIST.SUCCESS: {
      return {
        ...state,
        isLoading: false,
        visitListError: '',
        visitsList: action.visits,
        isSearchDone: true,
      };
    }
    case SEARCH_ON_VISIT_LIST.ERROR: {
      return {
        ...state,
        isLoading: false,
        visitListError: action.error,
        visitsList: undefined,
        isSearchDone: false,
      };
    }
    case SET_LIST_FLAG: {
      return {
        ...state,
        visitListError: '',
        isSearchDone: true
      };
    }
    default:
      return state;
  }
};
