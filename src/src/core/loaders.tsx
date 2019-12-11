import {useRef, useEffect, useMemo, useState, useCallback} from 'react';
import {GLTFLoader, GLTF} from 'three/examples/jsm/loaders/GLTFLoader';
import {LoadingManager, Object3D, Scene} from 'three';
import {Asset} from 'react-native-unimodules';
import ExpoTextureLoader from './TextureLoader';
import * as option from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';
import * as taskEither from 'fp-ts/lib/TaskEither';
import * as either from 'fp-ts/lib/Either';

export const loadGLFT = (moduleId: number) => {
  return taskEither.tryCatch<Error, GLTF>(
    () =>
      new Promise<GLTF>((resolve, reject) => {
        const manager = new LoadingManager();
        manager.addHandler(/.png/, new ExpoTextureLoader(manager));
        new GLTFLoader(manager).load(
          Asset.fromModule(moduleId).uri,
          assets => {
            resolve(assets);
          },
          undefined,
          e => {
            reject(e);
          },
        );
      }),
    () => new Error(`Unable to load module ${Asset.fromModule(moduleId).name}`),
  )();
};
export const useGLTF = (moduleId: number) => {
  const gltf = useRef<option.Option<GLTF>>(option.none);
  const scene = useRef<option.Option<Scene>>(option.none);
  const [loaded, setLoaded] = useState(false);
  const fold = (callback: (glft: GLTF) => void) =>
    pipe(
      gltf.current,
      option.fold(
        () => {},
        glft => callback(glft),
      ),
    );
  useEffect(() => {
    if (!loaded) {
      loadGLFT(moduleId).then(r =>
        pipe(
          r,
          either.map(assets => {
            gltf.current = option.some(assets);
            scene.current = option.some(assets.scene);
            setLoaded(true);
            console.log('scene loaded');
          }),
        ),
      );
    }
  }, [loaded]);
  const getObjectByName = useCallback(
    (name: string) =>
      pipe(
        gltf.current,
        option.map(glft => glft.scene),
        option.map(scene => option.fromNullable(scene.getObjectByName(name))),
        option.chain(o => o),
      ),
    [loaded],
  );
  const isNone = useMemo(() => option.isNone(gltf.current), [loaded]);
  return {
    fold: fold,
    scene: scene.current,
    isNone,
    getObjectByName: getObjectByName,
    foldObjectByName: (name: string) => (
      callback: (object: Object3D) => void,
    ) =>
      pipe(
        getObjectByName(name),
        option.fold(
          () => {},
          o => callback(o),
        ),
      ),
  };
};
