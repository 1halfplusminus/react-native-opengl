import {PropsWithChildren, useEffect, useState} from 'react';
import * as option from 'fp-ts/lib/Option';
import React from 'react';
import {SceneProps, SceneContext, defaultProps} from '../scene';

export const SceneProvider = ({
  children,
  scene,
}: PropsWithChildren<SceneProps>) => {
  const [loaded, setLoaded] = useState();
  useEffect(() => {
    if (!option.isNone(scene)) {
      setLoaded(true);
    }
  }, [option.isNone(scene)]);
  return (
    <SceneContext.Provider
      value={{
        scene: scene ? scene : option.none,
        loaded: loaded,
      }}>
      {children}
    </SceneContext.Provider>
  );
};

SceneProvider.defaultProps = defaultProps;
