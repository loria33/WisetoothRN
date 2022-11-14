import { call, all, takeLatest, put, select } from 'redux-saga/effects';
import { GET_VISIT_LIST, SEARCH_ON_VISIT_LIST, CREATE_REPORT, GET_IMPLANT_STATISTICS, EDIT_REPORT } from '../actions/types';
import * as visitActions from '../actions/visit';
import * as visitApi from '../../api/visit';
import * as userActions from '../actions/user';
import { showMessage } from "react-native-flash-message";
import navigationService from '../../navigation/navigationService';
import { objToQueryString } from '../../utils/helpers';

const getToken = (state: { auth: any; }) => state.auth.token;

function* getVisitListFlow() {
  try {
    const response = yield call(visitApi.getVisitList);
    const { error } = response.data;
    if (error) {
      yield put(visitActions.getVisitListError(error));
    } else {
      yield put(visitActions.getVisitListSuccess(response.data));
    }
  } catch (err) {
    if (err.response.data === 'Unauthorized' && err.response.status === 401) {
      yield put(userActions.logoutSuccess());
    } else {
      const { error } = err.response.data;
      const errorObj = typeof error === 'string' ? error : '';
      yield put(visitActions.getVisitListError(errorObj));
    }
  }
}

function* searchOnVisitListFlow({ queryObj }: any) {
  try {
    const response = yield call(visitApi.searchOnVisitList, queryObj);
    const { error } = response.data;
    if (error) {
      yield put(visitActions.searchOnVisitListError(error));
    } else {
      yield put(visitActions.searchOnVisitListSuccess(response.data));
    }
  } catch (err) {
    if (err.response.data === 'Unauthorized' && err.response.status === 401) {
      yield put(userActions.logoutSuccess());
    } else {
      const { error } = err.response.data;
      const errorObj = typeof error === 'string' ? error : (error.toothNum || error.patientName || error.date)
      yield put(visitActions.searchOnVisitListError(errorObj));
    }
  }
}

function* createReportFlow({ reqObj }: any) {
  try {
    const { createReportObj, isBackToPatientInformation, routeParams} = reqObj;
    const response = yield call(visitApi.createReport, createReportObj);
    const { error } = response.data;
    if (error) {
      yield put(visitActions.createReportError(error));
      showMessage({ message: error, type: 'danger' })

    } else {
      yield put(visitActions.createReportSuccess());
      yield put(visitActions.getVisitList());
      yield put(visitActions.getImplantStatistics({
          timeline: 48,
          amount: { min: 0, max: 3000 },
                diameter: { min: 2, max: 999 },
                length: { min: 2, max: 999 }
        }, false
      ));
      if (isBackToPatientInformation) {
        const implants= routeParams.implants && routeParams.implants;
        const lastIndex = implants.length - 1;
        implants.splice(lastIndex, 1);
        navigationService.navigate('CreateImplantPatientInformation', {
          ...routeParams,
          implants: implants
        });
      } else {
        navigationService.navigate('Implants List');
      }
      showMessage({ message: 'Report Created Successfully', type: 'success' })
    }
  } catch (err) {
    if (err.response.data === 'Unauthorized' && err.response.status === 401) {
      yield put(userActions.logoutSuccess());
    } else {
      const { error } = err.response.data;
      const errorMsg = typeof error === 'object' ? 'Server Error' : error;
      yield put(visitActions.createReportError(errorMsg));
      showMessage({ message: errorMsg, type: 'danger' });
    }
  }
}

function* editReportFlow({ reqObj }: any) {
  try {
    const { visit, answerObj } = reqObj;
    const response = yield call(visitApi.editReport, answerObj);
    const { error } = response.data;
    if (error) {
      yield put(visitActions.editReportError(error));
      showMessage({ message: error, type: 'danger' })

    } else {
      const { message } = response.data;
      yield put(visitActions.editReportSuccess());
      yield put(visitActions.getVisitList());
      yield put(visitActions.getImplantStatistics({
          timeline: 48,
          amount: { min: 0, max: 3000 },
          diameter: { min: 2, max: 999 },
          length: { min: 2, max: 999 }
        }, false
      ));
      showMessage({ message, type: 'success' });
      if (visit.Installs[0].report) {
        visit.Installs[0].report.answers = { ...answerObj.answers };
      }
      navigationService.navigate(visit.pageName, { item: visit });

    }
  } catch (err) {
    if (err.response.data === 'Unauthorized' && err.response.status === 401) {
      yield put(userActions.logoutSuccess());
    } else {
      const { error } = err.response.data;
      const errorMsg = typeof error === 'object' ? 'Server Error' : error
      yield put(visitActions.editReportError(errorMsg));
      showMessage({ message: errorMsg, type: 'danger' });
    }
  }
}

function* getImplantStatisticsFlow({ queryObj, navigateToStatisticsView }: any) {
  try {
    let token = yield select(getToken);
    const response = yield call(visitApi.getImplantStatistics, token, objToQueryString(queryObj));
    const { error } = response.data;
    if (error) {
      yield put(visitActions.getImplantStatisticsError(error));
    } else {
      yield put(visitActions.getImplantStatisticsSuccess({ data: response.data, queryObj }));
      if (navigateToStatisticsView) {
        navigationService.navigate('Implants Statistics');
      }
    }
  } catch (err) {
    if (err.response.data === 'Unauthorized' && err.response.status === 401) {
      yield put(userActions.logoutSuccess());
    } else {
      const { error } = err.response.data;
      const errorMsg = typeof error === 'object' ? 'Server Error' : error
      yield put(visitActions.getImplantStatisticsError(errorMsg));
      showMessage({ message: errorMsg, type: 'danger' })

    }
  }
}


export default function* visitSaga() {
  return yield all([
    takeLatest(GET_VISIT_LIST.PENDING, getVisitListFlow),
    takeLatest(SEARCH_ON_VISIT_LIST.PENDING, searchOnVisitListFlow),
    takeLatest(CREATE_REPORT.PENDING, createReportFlow),
    takeLatest(GET_IMPLANT_STATISTICS.PENDING, getImplantStatisticsFlow),
    takeLatest(EDIT_REPORT.PENDING, editReportFlow),
  ]);
}
