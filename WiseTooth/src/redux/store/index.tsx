import {combineReducers} from 'redux';
import configureStore from './createStore';
import rootSaga from '../sagas';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

/* ------------- Assemble The Reducers ------------- */
export const reducers = combineReducers({
  user: require('../reducers/user').default,
  visit: require('../reducers/visit').default,
  auth: require('../reducers/auth').default,
  statistics: require('../reducers/statistics').default,
  constants: require('../reducers/constants').default,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'],
};
export const persistRootReducer = persistReducer(persistConfig, reducers);

export default () => {
  let {store, sagasManager, sagaMiddleware} = configureStore(
    persistRootReducer,
    rootSaga,
  );
  const persistor = persistStore(store);

  if (module.hot) {
    module.hot.accept(() => {
      const nextRootReducer = require('./').persistRootReducer;
      store.replaceReducer(nextRootReducer);

      const newYieldedSagas = require('../sagas').default;
      sagasManager.cancel();
      sagasManager.done.then(() => {
        sagasManager = sagaMiddleware.run(newYieldedSagas);
      });
    });
  }

  return {store, persistor};
};
