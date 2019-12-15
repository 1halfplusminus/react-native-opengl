import {GameThunk, rollDice, startGame} from './gameSlice';

export const playSaga = (): GameThunk => async (dispatch, getState) => {
  dispatch(startGame());
  setTimeout(() => {
    dispatch(
      rollDice([
        {turn: 1, value: Math.floor(Math.random() * 6) + 1},
        {turn: 2, value: Math.floor(Math.random() * 6) + 1},
        {turn: 3, value: Math.floor(Math.random() * 6) + 1},
      ]),
    );
  }, 5000);
};
