import {PropsWithChildren, useEffect, useState} from 'react';
import * as option from 'fp-ts/lib/Option';
import React from 'react';
import {SceneProps, SceneContext, defaultProps} from '../scene';

export const SceneProvider = ({
  children,
  scene: defaultScene,
}: PropsWithChildren<SceneProps>) => {
  const [loaded, setLoaded] = useState();
  const [scene, setScene] = useState(defaultScene);
  useEffect(() => {
    if (!option.isNone(scene)) {
      setLoaded(true);
    }
  }, [option.isNone(scene)]);
  /*  useEffect(() => {
    setScene(scene);
  }, [scene]); */
  useEffect(() => {
    setScene(defaultScene);
  }, [defaultScene]);
  return (
    <SceneContext.Provider
      value={{
        scene,
        loaded: loaded,
      }}>
      {children}
    </SceneContext.Provider>
  );
};

SceneProvider.defaultProps = defaultProps;
