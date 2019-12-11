import React, {
  createContext,
  useRef,
  PropsWithChildren,
  useEffect,
  useContext,
  useState,
} from 'react';
import {GLView, ExpoWebGLRenderingContext} from 'expo-gl';
import * as THREE from 'three';
import {WebGLRenderer} from 'three';
import {once} from 'lodash';

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

export const useCanvas = (): CanvasContext => {
  const context = useContext(CanvasContext);
  if (!context) {
    throw new Error('Context not loaded');
  }
  return {
    ...context,
  };
};

export const useRender = (
  cb: () => void,
  deps: any[] = [],
  priority: number = 1,
) => {
  const {renders} = useCanvas();
  useEffect(() => {
    renders.push([cb, priority]);
    console.log(renders.length);
    return () => {
      console.log('remove renderer');
      const index = renders.findIndex(c => c[0] === cb);
      renders.splice(index, 1);
    };
  }, deps);
};
export const useFrame = (cb: () => void) => {
  const {subscribers} = useCanvas();
  useEffect(() => {
    subscribers.push(cb);
    return () => {
      const index = subscribers.findIndex(c => c === cb);
      subscribers.splice(index, 1);
    };
  }, []);
};

export const Canvas = ({children}: PropsWithChildren<{}>) => {
  const [loaded, setLoaded] = useState(false);
  const requestId = useRef<number>();
  const {current: renders} = useRef<Array<[() => void, number]>>([]);
  const {current: subscribers} = useRef<Array<() => void>>([]);
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
    subscribers.forEach(cb => {
      cb();
    });
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
      {ref.current?.gl ? (
        <CanvasContext.Provider value={{...ref.current!, renders, subscribers}}>
          {children}
        </CanvasContext.Provider>
      ) : null}
    </>
  );
};
