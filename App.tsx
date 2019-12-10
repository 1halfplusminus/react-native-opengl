/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {
  createContext,
  useRef,
  PropsWithChildren,
  useEffect,
  useContext,
  useMemo,
  useState,
} from 'react';
import {View} from 'react-native';
import {GLView, ExpoWebGLRenderingContext} from 'expo-gl';
import * as THREE from 'three';
import {GLTFLoader, GLTF} from 'three/examples/jsm/loaders/GLTFLoader';
import {
  LoadingManager,
  WebGLRenderer,
  PerspectiveCamera,
  Object3D,
  AmbientLight,
  Camera,
} from 'three';
import {Asset} from 'react-native-unimodules';
import ExpoTextureLoader from './TextureLoader';
import * as option from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';

declare type CanvasContext = {
  renderer: WebGLRenderer;
  gl: ExpoWebGLRenderingContext;
  height: number;
  width: number;
  subscribers: Array<() => void>;
  renders: Array<[() => void, number]>;
};
declare type MaybeCanvasContext = CanvasContext | undefined;

const CanvasContext = createContext<MaybeCanvasContext>(undefined);

const useGLTF = (module: number) => {
  const gltf = useRef<option.Option<GLTF>>(option.none);
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
    const manager = new LoadingManager();
    manager.addHandler(/.png/, new ExpoTextureLoader(manager));
    new GLTFLoader(manager).load(Asset.fromModule(module).uri, assets => {
      gltf.current = option.some(assets);
      setLoaded(true);
    });
  }, []);
  return {
    fold: fold,
    isNone: useMemo(() => option.isNone(gltf.current), [
      option.isNone(gltf.current),
    ]),
    foldObjectByName: (name: string) => (
      callback: (object: Object3D) => void,
    ) =>
      pipe(
        gltf.current,
        option.map(glft => glft.scene),
        option.map(scene => option.fromNullable(scene.getObjectByName(name))),
        option.chain(o => o),
        option.fold(
          () => {},
          o => callback(o),
        ),
      ),
  };
};

const useCanvas = (): CanvasContext => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('Context not loaded');
  }
  return {
    ...context,
  };
};
const useRender = (cb: () => void, priority: number = 1) => {
  const {renders} = useCanvas();

  useEffect(() => {
    console.log('in use renderer');
    const index = renders.push([cb, priority]);
    return () => {
      renders.splice(index, 1);
    };
  }, []);
};
const MainScene = () => {
  const {height, width, renderer} = useCanvas();
  const {current: camera} = useRef(
    new PerspectiveCamera(45, width / height, 1, 1000),
  );
  const {fold, isNone, foldObjectByName} = useGLTF(require('./slotscene.gltf'));
  useEffect(() => {
    fold(glft => {
      camera.position.z = 4;
      glft.scene.add(new AmbientLight(0x404040, 2));
    });
    foldObjectByName('SlotMachine')(object => {
      camera.lookAt(object.position);
    });
  }, [isNone]);
  useRender(() => {
    fold(glft => {
      renderer.render(glft.scene, camera);
    });
  });
  return <></>;
};
const Canvas = ({children}: PropsWithChildren<{}>) => {
  const [loaded, setLoaded] = useState(false);
  const requestId = useRef<number>();
  const {current: renders} = useRef<Array<[() => void, number]>>([]);
  const ref = useRef<
    Pick<CanvasContext, 'gl' | 'height' | 'width' | 'renderer'>
  >();
  const renderMain = () => {
    renders.reduce(
      ([cb, p], [cb2, p2]) => {
        return p > p2 ? [cb, p] : [cb2, p2];
      },
      [() => {}, 0],
    )[0]();
  };
  const animate = () => {
    requestId.current = requestAnimationFrame(animate);
    renderMain();
    ref.current!.gl.endFrameEXP();
  };
  const onContextCreate = (
    gl: ExpoWebGLRenderingContext & {
      drawingBufferWidth: number;
      drawingBufferHeight: number;
    },
  ) => {
    const {drawingBufferWidth: width, drawingBufferHeight: height} = gl;
    const renderer = new THREE.WebGLRenderer({
      canvas: {
        width,
        height,
        style: {},
        addEventListener: () => {},
        removeEventListener: () => {},
        clientHeight: height,
      },
      context: gl,
    });
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 1);
    ref.current = {
      gl,
      width,
      height,
      renderer,
    };
    animate();
    setLoaded(true);
  };
  return (
    <>
      <GLView style={{flex: 1}} onContextCreate={onContextCreate} />
      {loaded ? (
        <CanvasContext.Provider
          value={{...ref.current!, renders, subscribers: []}}>
          {children}
        </CanvasContext.Provider>
      ) : null}
    </>
  );
};
const App = () => {
  return (
    <Canvas>
      <MainScene />
    </Canvas>
  );
};

export default App;
