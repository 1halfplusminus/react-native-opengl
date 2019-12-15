import {useRef} from 'react';

export const useStateRef = <T>(v: T) => {
  const ref = useRef(v);
  return [
    ref.current,
    (v: T) => {
      ref.current = v;
    },
  ] as const;
};
