import {useCanvas} from '../canvas';

import React, {useRef, useEffect, PropsWithChildren, useState} from 'react';

import {PerspectiveCamera} from 'three';

import * as option from 'fp-ts/lib/Option';

import {useScene} from '../scene';

import {pipe} from 'fp-ts/lib/pipeable';
import {CameraContext} from '../camera';
import {PixelRatio} from 'react-native';

export const PerspectiveCameraProvider = ({
  children,
}: PropsWithChildren<{}>) => {
  const {height, width} = useCanvas();
  const [camera, setCamera] = useState<option.Option<PerspectiveCamera>>(
    option.none,
  );
  const {fold, loaded} = useScene();
  const mapCamera = (cb: (camera: PerspectiveCamera) => void) =>
    pipe(camera, option.map(cb));
  useEffect(() => {
    fold(scene => {
      mapCamera(camera => {
        scene.add(camera);
      });
    });
    return () => {
      fold(scene => {
        mapCamera(camera => {
          scene.remove(camera);
        });
      });
    };
  }, [loaded]);
  useEffect(() => {
    console.log('change camera');
    setCamera(
      option.some(new PerspectiveCamera(75, width / height, 0.1, 1000)),
    );
  }, [height, width]);
  useEffect(() => {
    setCamera(camera);
  }, [camera]);
  return (
    <CameraContext.Provider value={{camera: camera}}>
      {children}
    </CameraContext.Provider>
  );
};
