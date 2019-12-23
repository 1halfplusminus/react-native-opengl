import {Scene, Object3D} from 'three';
import {createContext, useContext, useEffect, useState} from 'react';
import * as option from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';

export const defaultProps = {
  scene: option.none as option.Option<Scene>,
};

export type SceneProps = {} & typeof defaultProps;

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
  const {scene} = useContext(SceneContext);
  const map = (cb: (scene: Scene) => void) => pipe(scene, option.map(cb));
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
  const add = (...object: Object3D[]) => {
    return map(s => {
      s.add(...object);
    });
  };
  return {
    fold,
    getObjectByName,
    foldObjectByName,
    isNone: option.isNone(scene),
    scene: scene,
    loaded: !option.isNone(scene),
    add,
  };
};
