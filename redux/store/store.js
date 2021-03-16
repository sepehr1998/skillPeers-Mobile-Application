// Imports: Dependencies
import AsyncStorage from '@react-native-community/async-storage';
import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
// Imports: Redux
import allReducers from '../reducers/index';
import thunk from "redux-thunk";

// Middleware: Redux Persist Config
const persistConfig = {
  // Root
  key: 'root',
  // Storage Method (React Native)
  storage: AsyncStorage,
  // Whitelist (Save Specific Reducers)
//   whitelist: [
//     'authReducer',
//   ],
  // Blacklist (Don't Save Specific Reducers)
//   blacklist: [
//     'counterReducer',
//   ],
};
// Middleware: Redux Persist Persisted Reducer
const persistedReducer = persistReducer(persistConfig, allReducers);
// Redux: Store
const store = createStore(
  persistedReducer,
  applyMiddleware(
    thunk,
    createLogger(),
  ),
);
// Middleware: Redux Persist Persister
let persistor = persistStore(store);
// Exports
export {
  store,
  persistor,
};