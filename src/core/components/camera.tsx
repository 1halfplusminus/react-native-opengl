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
  const [needUpdate, setNeedUpdate] = useState(false);
  const camera = useRef<option.Option<PerspectiveCamera>>(
    option.some(new PerspectiveCamera(45, 1)),
  );
  const {fold, loaded} = useScene();
  const mapCamera = (cb: (camera: PerspectiveCamera) => void) =>
    pipe(camera.current, option.map(cb));

  useEffect(() => {
    console.log(PixelRatio.get());
    fold(scene => {
      mapCamera(camera => {
        scene.add(camera);
        setNeedUpdate(true);
      });
    });
    return () => {
      fold(scene => {
        mapCamera(camera => {
          scene.remove(camera);
          setNeedUpdate(true);
        });
      });
    };
  }, [loaded]);
  return (
    <CameraContext.Provider value={{camera: camera.current}}>
      {children}
    </CameraContext.Provider>
  );
};
