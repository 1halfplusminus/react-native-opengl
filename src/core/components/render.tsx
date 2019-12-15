import {useCanvas, mapRenderer, UseFrameCallback} from '../canvas';

import {useCamera} from '../camera';

import {useScene, SceneContext} from '../scene';

import {pipe} from 'fp-ts/lib/pipeable';

import * as option from 'fp-ts/lib/Option';

import React, {useEffect, PropsWithChildren, useState, useRef} from 'react';
import {useRender, RendererContext} from '../render';

const Renderer = () => {
  const {renderer, endFrame} = useCanvas();
  const {fold, scene} = useScene();
  const {camera, map} = useCamera();
  const renderScene = () =>
    fold(scene => {
      mapRenderer(renderer)(renderer => {
        map(camera => {
          renderer.render(scene, camera);
          endFrame();
        });
      });
    });
  useRender(renderScene);
  return <></>;
};
export const SceneRenderer = ({children}: PropsWithChildren<{}>) => {
  const [needUpdate, setNeedUpdate] = useState(false);
  const {camera, map} = useCamera();
  const {fold, scene} = useScene();
  const refSubscribers = useRef<UseFrameCallback[]>([]);
  useEffect(() => {
    fold(scene => {
      map(camera => {
        scene.add(camera);
        setNeedUpdate(true);
      });
    });
    return () => {
      fold(scene => {
        map(camera => {
          scene.remove(camera);
          setNeedUpdate(true);
        });
      });
    };
  }, [option.isNone(camera), option.isNone(scene)]);

  return (
    <RendererContext.Provider value={{subscribers: refSubscribers.current}}>
      <Renderer />
      {children}
    </RendererContext.Provider>
  );
};
