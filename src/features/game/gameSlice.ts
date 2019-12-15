import {Action, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ThunkAction} from 'redux-thunk';
import {WheelValue} from '../../components/wheel/wheel';

export interface GameRoll {
  turn: number;
  value: WheelValue | number;
}

interface GameState {
  rolls: [GameRoll, GameRoll, GameRoll] | [];
  playing: boolean;
  loading: boolean;
  error: string | null;
  rolling: boolean;
}

const initialState: GameState = {
  rolls: [],
  playing: false,
  loading: false,
  rolling: false,
  error: null,
};

export const game = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startGame(state) {
      if (!state.loading && !state.rolling) {
        state.rolling = false;
        state.playing = true;
        state.loading = true;
        state.rolls = [];
      }
    },
    rollDice(state, action: PayloadAction<[GameRoll, GameRoll, GameRoll]>) {
      if (!state.rolling) {
        state.rolls = action.payload;
        state.loading = false;
        state.rolling = true;
      }
    },
    rollFinished(state) {
      state.rolling = false;
      state.loading = false;
      state.playing = false;
    },
  },
});

export const {startGame, rollDice, rollFinished} = game.actions;

export type GameThunk = ThunkAction<void, GameState, null, Action<string>>;

export default game.reducer;
