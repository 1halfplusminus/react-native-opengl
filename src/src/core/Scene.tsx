import {Scene, Object3D} from 'three';
import {
  createContext,
  PropsWithChildren,
  useContext,
  useCallback,
  useRef,
} from 'react';
import * as option from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';
import React from 'react';

const defaultProps = {
  scene: option.none as option.Option<Scene>,
};

type SceneProps = {
  scene: option.Option<Scene>;
} & typeof defaultProps;

declare type SceneContext = {
  scene: option.Option<Scene>;
};

const SceneContext = createContext<SceneContext>({
  scene: option.none,
});
export const useScene = () => {
  const {scene} = useContext(SceneContext);
  const getObjectByName = (name: string) =>
    pipe(
      scene,
      option.map(scene => option.fromNullable(scene.getObjectByName(name))),
      option.chain(o => o),
    );
  const foldObjectByName = (name: string) => (
    callback: (object: Object3D) => void,
  ) =>
    pipe(
      getObjectByName(name),
      option.fold(
        () => {},
        o => callback(o),
      ),
    );
  const fold = (callback: (scene: Scene) => void) =>
    pipe(
      scene,
      option.fold(
        () => {},
        s => callback(s),
      ),
    );
  return {
    fold,
    getObjectByName,
    foldObjectByName,
    isNone: option.isNone(scene),
  };
};
export const SceneProvider = ({
  children,
  scene,
}: PropsWithChildren<SceneProps>) => {
  return (
    <SceneContext.Provider
      value={{
        scene: scene,
      }}>
      {children}
    </SceneContext.Provider>
  );
};

SceneProvider.defaultProps = defaultProps;
