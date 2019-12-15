import {useDispatch, useSelector} from 'react-redux';
import {RootState} from './../../app/rootReducer';
import {playSaga} from './actions';
import {rollFinished} from './gameSlice';

export const useGame = () => {
  const {rolls, rolling, loading} = useSelector((state: RootState) => ({
    rolls: state.game.rolls,
    rolling: state.game.rolling,
    loading: state.game.loading,
  }));
  const dispatch = useDispatch();
  return {
    rolls,
    start: () => {
      dispatch(playSaga());
    },
    rollFinished: () => {
      dispatch(rollFinished());
    },
    rolling,
    loading,
  };
};
