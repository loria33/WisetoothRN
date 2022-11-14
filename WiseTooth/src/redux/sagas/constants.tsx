import { call, all, takeLatest, put, select } from 'redux-saga/effects';
import { GET_MEDICAL_CONDITIONS, GET_MANUFACTURES } from '../actions/types';
import * as userActions from '../actions/user';
import * as userApi from '../../api/user';

const getMedicalConditions = (state: { constants: any; }) => state.constants.medicalConditions;
const getManufactures = (state: { constants: any; }) => state.constants.manufactures;

function* getMedicalConditionsFlow() {
  const medicalConditions = yield select(getMedicalConditions);
  if (!medicalConditions) {
    try {
      const response = yield call(userApi.getMedicalConditions);
      const { error } = response.data;
      if (error) {
        yield put(userActions.getMedicalConditionsError(error));
      } else {
        yield put(userActions.getMedicalConditionsSuccess(response.data));
      }
    } catch (err) {
      if (err.response.data === 'Unauthorized' && err.response.status === 401) {
        yield put(userActions.logoutSuccess());
      } else {
        const { error } = err.response.data;
        yield put(userActions.getMedicalConditionsError(error));
      }
    }
  }
}

function* getManufacturesFlow() {
  const manufactures = yield select(getManufactures);
  if (!manufactures) {
    try {
      const response = yield call(userApi.getManufactures);
      const { error } = response.data;
      if (error) {
        yield put(userActions.getManufacturesError(error));
      } else {
        yield put(userActions.getManufacturesSuccess(response.data));
      }
    } catch (err) {
      if (err.response.data === 'Unauthorized' && err.response.status === 401) {
        yield put(userActions.logoutSuccess());
      } else {
        const { error } = err.response.data;
        yield put(userActions.getManufacturesError(error));
      }
    }
  }
}

export default function* constantsSaga() {
  return yield all([
    takeLatest(GET_MEDICAL_CONDITIONS.PENDING, getMedicalConditionsFlow),
    takeLatest(GET_MANUFACTURES.PENDING, getManufacturesFlow),
  ]);
}
