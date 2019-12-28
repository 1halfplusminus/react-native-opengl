import {useRef, useEffect, useState, useCallback} from 'react';
import {GLTFLoader, GLTF} from 'three/examples/jsm/loaders/GLTFLoader';
import {LoadingManager, Object3D, Scene, Cache} from 'three';

import {Asset, FileSystem} from 'react-native-unimodules';
import ExpoTextureLoader from './textureLoader';
import * as option from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';
import * as taskEither from 'fp-ts/lib/TaskEither';
import * as either from 'fp-ts/lib/Either';
import URLParse from 'url-parse';
//@ts-ignore
import * as mime from 'react-native-mime-types';
//@ts-ignore
import * as THREEModule from 'three/build/three.module';
import {decode} from 'base-64';

const mines: {[key: string]: string} = {
  gltf: 'application/json',
};

THREEModule.Cache.enabled = true;

export type AssetList = Array<{path: string; moduleId: string | number}>;

export const readBase64Data = async (key: string) => {
  const url = new URLParse(key);
  const paths = url.pathname.split('/');
  const last = paths[paths.length - 1];
  await Asset.fromModule(key).downloadAsync();
  const base64 = await FileSystem.readAsStringAsync(Asset.fromModule(key).uri, {
    encoding: 'base64',
  });
  const mine = mime.lookup(last) || mines[Asset.fromModule(key).type];
  if (!mine) {
    throw new Error(`no type for ${Asset.fromModule(key).type}, ${last}`);
  }
  return `data:${mine};base64,${base64}`;
};
function _base64ToArrayBuffer(base64: string) {
  var binary_string = decode(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}
const cacheAsset = async (path: string, moduleId: string | number) => {
  const asset = Asset.fromModule(moduleId);
  console.log('before download', asset);
  await asset.downloadAsync();
  if (path.match(/\.(jpeg|jpg|gif|png)$/)) {
    THREEModule.Cache.add(path, asset);
  } else if (path.match(/\.(txt|json|glft)$/)) {
    const data = await FileSystem.readAsStringAsync(
      asset.localUri || asset.uri,
      {encoding: FileSystem.EncodingType.UTF8},
    );
    THREEModule.Cache.add(path, data);
  } else {
    const data = await FileSystem.readAsStringAsync(
      asset.localUri || asset.uri,
      {encoding: FileSystem.EncodingType.Base64},
    );
    THREEModule.Cache.add(path, _base64ToArrayBuffer(data));
  }
};
export const cacheAssets = async (assets: AssetList) => {
  return Promise.all(
    assets.map(async ({moduleId, path}) => {
      await cacheAsset(path, moduleId);
    }),
  );
};
export const clearAssets = async (assets: AssetList) => {
  return Promise.all(
    assets.map(async ({moduleId, path}) => {
      THREEModule.Cache.remove(path);
    }),
  );
};
export const loadGLFT = (path: string) => {
  return taskEither.tryCatch<Error, GLTF>(
    () =>
      new Promise<GLTF>(async (resolve, reject) => {
        console.log('readAsStringAsync glft');
        const manager = new LoadingManager();
        manager.addHandler(/.png/, new ExpoTextureLoader(manager));
        new GLTFLoader(manager).load(
          path,
          assets => {
            resolve(assets);
          },
          undefined,
          e => {
            console.error(e);
            reject(e);
          },
        );
      }),
    () => new Error(`Unable to load module ${path}`),
  )();
};
export const useGLTF = (path: string, assets: AssetList) => {
  const [gltf, setGlft] = useState<option.Option<GLTF>>(option.none);
  const [scene, setScene] = useState<option.Option<Scene>>(option.none);
  const [loaded, setLoaded] = useState(false);
  const [object3D, setObject3D] = useState<{[key: string]: Object3D}>({});
  const fold = (callback: (glft: GLTF) => void) =>
    pipe(
      gltf,
      option.fold(
        () => {},
        glft => callback(glft),
      ),
    );
  useEffect(() => {
    if (!loaded) {
      cacheAssets(assets).then(() => {
        loadGLFT(path).then(r =>
          pipe(
            r,
            either.map(loaded => {
              setGlft(option.some(loaded));
              setScene(option.some(loaded.scene));
              setObject3D(
                loaded.scene.children.reduce((acc, object) => {
                  acc[object.name] = object;
                  return acc;
                }, {} as {[key: string]: Object3D}),
              );
              setLoaded(true);
              clearAssets(assets);
            }),
          ),
        );
      });
    }
  }, [loaded]);
  const getObjectByName = (name: string) =>
    pipe(
      object3D,
      a => {
        return a;
      },
      object3D => option.fromNullable(object3D[name]),
      /*       option.map(scene => option.fromNullable(scene.getObjectByName(name))),
  option.chain(o => o), */
    );
  const isNone = option.isNone(gltf);
  return {
    fold: fold,
    scene,
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
