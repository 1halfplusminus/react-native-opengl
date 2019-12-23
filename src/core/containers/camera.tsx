import {useCanvas} from '../canvas';
import React, {useEffect, PropsWithChildren, useState} from 'react';
import {PerspectiveCamera} from 'three';
import * as option from 'fp-ts/lib/Option';
import {CameraContext} from '../camera';
import {useRendererScene} from '../render';
import removeOption from '../scene/removeOptions';

export const PerspectiveCameraProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const {height, width} = useCanvas();
  const [camera, setCamera] = useState<option.Option<PerspectiveCamera>>(
    option.none,
  );
  const {scene} = useRendererScene();
  useEffect(() => {
    console.log('new camera', height, width);
    removeOption(scene)(camera);
    setCamera(
      option.some(new PerspectiveCamera(75, width / height, 0.1, 1000)),
    );
  }, [height, width]);
  /*   useEffect(() => {
    setCamera(camera);
  }, [camera]); */
  return (
    <CameraContext.Provider value={{camera: camera}}>
      {children}
    </CameraContext.Provider>
  );
};
