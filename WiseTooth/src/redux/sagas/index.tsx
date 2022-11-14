import { all } from 'redux-saga/effects';
import userSaga from './user';
import visitSaga from './visit';
import constantsSaga from './constants';

function* rootSaga() {
  return yield all([userSaga(), visitSaga(), constantsSaga()]);
}
export default rootSaga;
