import React, {PropsWithChildren, useState} from 'react';
import {GLView, ExpoWebGLRenderingContext} from 'expo-gl';
import * as THREE from 'three';
import * as option from 'fp-ts/lib/Option';
import {CanvasContext} from '../canvas';
import {WebGLRenderer} from 'three';

export const Canvas = ({children}: PropsWithChildren<{}>) => {
  const [size, setSize] = useState({height: 0, width: 0});
  const [gl, setGL] = useState<option.Option<ExpoWebGLRenderingContext>>(
    option.none,
  );
  const [renderer, setRenderer] = useState<option.Option<WebGLRenderer>>(
    option.none,
  );

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
    renderer.setClearColor(0x000000, 1);
    setSize({height: height, width: width});
    setGL(option.some(gl));
    setRenderer(option.some(renderer));
    console.log('context created');
  };
  return (
    <>
      <GLView style={{flex: 1}} onContextCreate={onContextCreate} />
      <CanvasContext.Provider
        value={{
          gl: gl,
          height: size.height,
          width: size.width,
          renderer: renderer,
        }}>
        {children}
      </CanvasContext.Provider>
    </>
  );
};
