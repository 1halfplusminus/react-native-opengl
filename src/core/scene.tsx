import {Scene, Object3D} from 'three';
import {createContext, useContext, useEffect, useState} from 'react';
import * as option from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';

export const defaultProps = {
  scene: option.none as option.Option<Scene>,
};

export type SceneProps = {
  scene: option.Option<Scene>;
} & typeof defaultProps;

export declare type SceneContext = {
  scene: option.Option<Scene>;
  loaded: boolean;
};

export const SceneContext = createContext<SceneContext>({
  ...defaultProps,
  loaded: false,
});

export const useInit = (cb: () => void) => {
  const {isNone} = useScene();
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    if (!isNone && !loaded) {
      cb();
      setLoaded(true);
    }
  }, [isNone]);
};
export const useScene = () => {
  const context = useContext(SceneContext);
  const {scene} = context;
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
    scene: context.scene,
    loaded: !option.isNone(scene),
  };
};
