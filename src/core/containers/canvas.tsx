import React, {PropsWithChildren, useState, useEffect} from 'react';
import {GLView, ExpoWebGLRenderingContext} from 'expo-gl';
import * as THREE from 'three';
import * as option from 'fp-ts/lib/Option';
import {CanvasContext} from '../canvas';
import {WebGLRenderer, PerspectiveCamera} from 'three';
import {ScaledSize, Dimensions} from 'react-native';
import {height} from 'styled-system';
import {pipe} from 'fp-ts/lib/pipeable';

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
  useEffect(() => {
    const handler = ({
      window,
      screen,
    }: {
      window: ScaledSize;
      screen: ScaledSize;
    }) => {
      setSize({height: window.height, width: window.width});
    };
    Dimensions.addEventListener('change', handler);
    return () => {
      Dimensions.removeEventListener('change', handler);
    };
  }, [gl]);
  useEffect(() => {
    pipe(
      renderer,
      option.map(r => {
        r.setSize(size.width, size.height);
      }),
    );
  }, [size]);
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
