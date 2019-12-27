import {useCanvas, UseFrameCallback} from '../canvas';
import {useCamera} from '../camera';
import React, {useEffect, PropsWithChildren, useRef, useState} from 'react';
import {
  useRender,
  RendererContext,
  useRendererScene,
  defaultProps,
} from '../render';
import addOption from '../scene/addOption';
import {SceneProps} from '../scene';
import removeOption from '../scene/removeOptions';

const Renderer = ({children}: PropsWithChildren<{}>) => {
  const {renderer, endFrame, gl, render, width, height} = useCanvas();
  const {scene} = useRendererScene();
  const {camera} = useCamera();
  const renderScene = () => {
    render(scene, camera);
    endFrame();
  };
  useRender(renderScene, [scene, camera, gl, renderer]);
  return <>{children}</>;
};
export const SceneRenderer = ({
  children,
  scene: defaultScene,
}: PropsWithChildren<SceneProps>) => {
  const {camera} = useCamera();
  const [scene, setScene] = useState(defaultScene);
  const refSubscribers = useRef<UseFrameCallback[]>([]);
  /*  useEffect(() => {
    console.log('add new camera');
    addOption(scene)(camera);
    return () => {
      removeOption(scene)(camera);
    };
  }, [camera, scene, defaultScene]); */
  /* useEffect(() => {
    setScene(scene);
  }, [scene]);
  useEffect(() => {
    setScene(defaultScene);
  }, [defaultScene]); */
  return (
    <RendererContext.Provider
      value={{
        subscribers: refSubscribers.current,
        scene,
      }}>
      <Renderer key="renderer">{children}</Renderer>
    </RendererContext.Provider>
  );
};

SceneRenderer.defaultProps = defaultProps;
