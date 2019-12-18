import {useCanvas, mapRenderer, UseFrameCallback} from '../canvas';

import {useCamera} from '../camera';

import {useScene, SceneContext} from '../scene';

import {pipe} from 'fp-ts/lib/pipeable';

import * as option from 'fp-ts/lib/Option';

import React, {useEffect, PropsWithChildren, useState, useRef} from 'react';
import {useRender, RendererContext, useAnimationFrame} from '../render';

const Renderer = ({children}: PropsWithChildren<{}>) => {
  const {renderer, endFrame, gl, render} = useCanvas();
  const {scene} = useScene();
  const {camera} = useCamera();
  const renderScene = () => {
    render(scene, camera);
    endFrame();
  };
  useRender(renderScene, [scene, camera, gl, renderer]);
  return <>{children}</>;
};
export const SceneRenderer = ({children}: PropsWithChildren<{}>) => {
  const {camera, map} = useCamera();
  const {fold, scene} = useScene();
  const refSubscribers = useRef<UseFrameCallback[]>([]);
  useEffect(() => {
    fold(scene => {
      map(camera => {
        scene.add(camera);
      });
    });
    return () => {
      fold(scene => {
        map(camera => {
          scene.remove(camera);
        });
      });
    };
  }, [camera, scene]);
  return (
    <RendererContext.Provider
      value={{
        subscribers: refSubscribers.current,
        push: cb => {
          refSubscribers.current.push(cb);
        },
        reset: () => {
          refSubscribers.current.splice(0, refSubscribers.current.length);
        },
      }}>
      <Renderer key="renderer">{children}</Renderer>
    </RendererContext.Provider>
  );
};
