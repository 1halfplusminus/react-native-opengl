import {combineReducers} from '@reduxjs/toolkit';
import gameReducer from '../features/game/gameSlice';

const rootReducer = combineReducers({
  game: gameReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
