import { createStore, applyMiddleware, compose } from 'redux';
import { persistStore } from 'redux-persist';

import rootReducer from './root-reducer';


const middlewares = [];
const enhancers = [applyMiddleware(...middlewares)]

const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line no-undef
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) // eslint-disable-line no-undef
      : compose
export const store = createStore(rootReducer, composeEnhancers(...enhancers));

export const persistor = persistStore(store);

export default { store, persistor };
