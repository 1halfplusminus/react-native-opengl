import {Action, configureStore} from '@reduxjs/toolkit';
import {ThunkAction} from 'redux-thunk';
import rootReducer, {RootState} from './rootReducer';

export const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

/* //@ts-ignore
if (process.env.NODE_ENV === 'development' && module.hot) {
  //@ts-ignore
  module.hot.accept('./rootReducer', () => {
    const newRootReducer = require('./rootReducer').default;
    store.replaceReducer(newRootReducer);
  });
}
 */
export type AppDispatch = typeof store.dispatch;

export type AppThunk = ThunkAction<void, RootState, null, Action<string>>;

export default store;
