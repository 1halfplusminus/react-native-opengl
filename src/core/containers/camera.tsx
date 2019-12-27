import {useCanvas} from '../canvas';
import React, {useEffect, PropsWithChildren, useState} from 'react';
import {PerspectiveCamera} from 'three';
import * as option from 'fp-ts/lib/Option';
import {CameraContext} from '../camera';
import {useRendererScene} from '../render';
import removeOption from '../scene/removeOptions';
import {pipe} from 'fp-ts/lib/pipeable';
import {size} from 'styled-system';
import {Dimensions} from 'react-native';

export const PerspectiveCameraProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const {height, width, renderer} = useCanvas();
  const [camera, setCamera] = useState<option.Option<PerspectiveCamera>>(
    option.some(new PerspectiveCamera(75, width / height, 0.1, 1000)),
  );
  const {scene} = useRendererScene();
  useEffect(() => {
    const window = Dimensions.get('window');
    removeOption(scene)(camera);

    /*     removeOption(scene)(camera);
    const newCamera = new PerspectiveCamera(75, width / height, 0.1, 1000); */
    pipe(
      camera,
      option.map(c => {
        pipe(
          renderer,
          option.map(r => {
            pipe(
              renderer,
              option.map(r => {
                c.aspect = width / height;
                c.updateProjectionMatrix();
                /* const newCamera = new PerspectiveCamera(70, width / height, 0.01, 1000);
                setCamera(option.some(newCamera)); */
                r.setSize(width * window.scale, height * window.scale, true);
                /*    r.setSize(width, height); */
              }),
            );
          }),
        );
      }),
    );
    /*     removeOption(scene)(camera);
    const newCamera = new PerspectiveCamera(75, width / height, 0.1, 1000); */
    /*     newCamera.updateProjectionMatrix();
    setCamera(option.some(newCamera)); */
  }, [height, width, renderer]);

  return (
    <CameraContext.Provider value={{camera: camera}}>
      {children}
    </CameraContext.Provider>
  );
};
