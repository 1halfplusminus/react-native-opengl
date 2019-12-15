import {useEffect, useMemo, useState} from 'react';
import {GameRoll} from '../../features/game/gameSlice';
import {WheelValue} from './wheel';

const useWheel = (
  {
    value: defaultValue,
  }: {
    value: WheelValue | number;
  } = {value: 0},
) => {
  const [value, setValue] = useState<WheelValue | number>(defaultValue);
  const [finished, setFinished] = useState(false);
  const [touched, setTouched] = useState(false);
  const [{numberOfTurn, value: goToValue}, setGo] = useState<{
    numberOfTurn: number;
    value: WheelValue | number;
  }>({
    numberOfTurn: 0,
    value: 0,
  });
  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);
  return {
    finished,
    numberOfTurn,
    goToValue,
    value,
    goTo: ({
      value: sgoToValue,
      numberOfTurn: shadowNumberOfTurn,
    }: {
      value: WheelValue | number;
      numberOfTurn: number;
    }) => {
      if (!touched) {
        setTouched(true);
        setFinished(false);
        setGo({
          numberOfTurn: shadowNumberOfTurn,
          value: sgoToValue,
        });
      }
    },
    handleFinish: () => {
      setFinished(true);
      setValue(goToValue);
    },
    reset: () => {
      setFinished(false);
      setTouched(false);
    },
  };
};
interface UseWeelsProps<
  G extends WheelValue | number = number,
  T extends {
    [key: number]: G;
  } = {
    [key: number]: G;
  }
> {
  onRollFinish: () => void;
  wheels: T;
  rolls: GameRoll[];
  rolling: boolean;
  loading: boolean;
}
export function useWheels({
  wheels,
  onRollFinish,
  rolls,
  rolling,
  loading,
}: UseWeelsProps) {
  const [touched, setTouched] = useState(false);
  const states = Object.values(wheels).reduce(
    (p, c, index) => {
      p[index] = useWheel({value: c});
      return p;
    },
    {} as {
      [key: number]: ReturnType<typeof useWheel>;
    },
  );
  const finished = useMemo(() => {
    return Object.values(states).map(s => s.finished);
  }, [states]);
  useEffect(() => {
    if (finished.every(f => f)) {
      Object.values(states).forEach(s => {
        s.reset();
      });
      onRollFinish();
    }
  }, [finished]);

  useEffect(() => {
    if (rolling) {
      rolls.forEach((roll, index) => {
        if (roll.turn > 0) {
          states[index].goTo({
            numberOfTurn: roll.turn,
            value: roll.value,
          });
        }
      });
    }
  }, [rolls, rolling]);
  return {
    ...states,
    goTo: (p: keyof typeof states | number) => {
      setTouched(true);
      return states[p].goTo;
    },
    get: (p: keyof typeof states | number) => {
      return states[p];
    },
    bind: (p: keyof typeof states | number) => {
      return {
        index: p,
        goTo: {
          value: states[p].goToValue,
          numberOfTurn: states[p].numberOfTurn,
        },
        value: states[p].value,
        onFinish: () => {
          states[p].handleFinish();
        },
        finished: states[p].finished,
        rolling,
        loading,
      };
    },
    touched,
  };
}
