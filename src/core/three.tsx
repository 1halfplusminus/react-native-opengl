import {Group} from 'three';
import {useRef} from 'react';

export const useGroup = () => {
  const {current: group} = useRef(new Group());
  return group;
};
