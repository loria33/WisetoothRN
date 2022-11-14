import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import Config from '../../config';
import Reactotron from '../../config/ReactotronConfig';
import httpMiddleware from '../middleware/httpMiddleware'
export default (rootReducer, rootSaga) => {
  const sagaMonitor = Config.useDev
    ? console.tron.createSagaMonitor()
    : null;
  const sagaMiddleware = createSagaMiddleware({ sagaMonitor });
  const store = createStore(
    rootReducer,
    compose(applyMiddleware(sagaMiddleware), applyMiddleware(httpMiddleware), Reactotron.createEnhancer()),
  );
  const sagasManager = sagaMiddleware.run(rootSaga);
  return {
    store,
    sagasManager,
    sagaMiddleware,
  };
};
