import {createContext, useContext} from 'react';
import {ExpoWebGLRenderingContext} from 'expo-gl';

import {WebGLRenderer, Camera, Scene} from 'three';

import * as option from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';

export declare type CanvasContext = {
  renderer: option.Option<WebGLRenderer>;
  gl: option.Option<ExpoWebGLRenderingContext>;
  height: number;
  width: number;
};
export declare type MaybeCanvasContext = CanvasContext;

export const defaultContext = {
  renderer: option.none,
  gl: option.none,
  height: 0,
  width: 0,
};

export const CanvasContext = createContext<MaybeCanvasContext>(defaultContext);

export declare type UseFrameCallback = ({delta}: {delta: number}) => void;

export const mapRenderer = (renderer: option.Option<WebGLRenderer>) => (
  cb: (renderer: WebGLRenderer) => void,
) => pipe(renderer, option.map(cb));

export const mapGL = (gl: option.Option<ExpoWebGLRenderingContext>) => (
  cb: (gl: ExpoWebGLRenderingContext) => void,
) => pipe(gl, option.map(cb));

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  return {
    ...context,
    endFrame: () =>
      pipe(
        context.gl,
        option.map(gl => {
          gl.endFrameEXP();
        }),
      ),
    render: (scene: option.Option<Scene>, camera: option.Option<Camera>) =>
      pipe(
        camera,
        option.map(camera =>
          pipe(
            scene,
            option.map(scene =>
              pipe(
                context.renderer,
                option.map(renderer => {
                  renderer.render(scene, camera);
                }),
              ),
            ),
          ),
        ),
      ),
  };
};
