import React, {useRef, PropsWithChildren, useState} from 'react';
import {GLView, ExpoWebGLRenderingContext} from 'expo-gl';
import * as THREE from 'three';
import * as option from 'fp-ts/lib/Option';
import {CanvasContext, defaultContext} from '../canvas';

export const Canvas = ({children}: PropsWithChildren<{}>) => {
  const [needUpdate, setNeedUpdate] = useState(false);
  const ref = useRef<
    Pick<CanvasContext, 'gl' | 'height' | 'width' | 'renderer'> & {
      time?: number;
    }
  >(defaultContext);
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
    renderer.setPixelRatio(1);
    renderer.setSize(width, height);
    renderer.setClearColor(0xffffff, 1);
    ref.current = {
      gl: option.some(gl),
      width,
      height,
      renderer: option.some(renderer),
    };
    setNeedUpdate(true);
  };
  return (
    <>
      <GLView style={{flex: 1}} onContextCreate={onContextCreate} />
      <CanvasContext.Provider
        value={{
          ...ref.current,
        }}>
        {children}
      </CanvasContext.Provider>
    </>
  );
};
