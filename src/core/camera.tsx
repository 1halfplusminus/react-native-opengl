import {Camera, PerspectiveCamera} from 'three';
import {createContext, useContext, useEffect, useState} from 'react';
import * as option from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';
import {useCanvas} from './canvas';

export const defaultProps = {
  camera: option.none as option.Option<Camera>,
  needUpdate: false,
};

export type CameraProps = {
  camera: option.Option<Camera>;
} & typeof defaultProps;

export declare type CameraContext = {
  camera: option.Option<Camera>;
};

export const CameraContext = createContext<CameraContext>({
  ...defaultProps,
});

export const useCamera = (cb?: (camera: Camera) => void) => {
  const context = useContext(CameraContext);
  const [needUpdate, setNeedUpdate] = useState(false);
  const {height, width} = useCanvas();
  function map<T>(cb: (camera: Camera) => T) {
    return pipe(
      context.camera,
      option.map(c => {
        setNeedUpdate(true);
        const result = cb(c);
        if (c instanceof PerspectiveCamera) {
          c.updateProjectionMatrix();
        }
        return result;
      }),
    );
  }
  function fold<T>(cb: (camera: Camera) => T) {
    pipe(
      context.camera,
      option.fold(
        () => {},
        c => {
          cb(c);
        },
      ),
    );
  }
  useEffect(() => {
    if (!option.isNone(context.camera)) {
      if (cb) {
        console.log('in use use effect useCamera');
        map(c => {
          cb(c);
          if (c instanceof PerspectiveCamera) {
            c.updateProjectionMatrix();
          }
          console.log('after update', c.position.x, c.position.z);
        });
      }
    }
  }, [context.camera, height, width]);

  return {
    camera: context.camera,
    map: map,
    getCamera: () => {
      return context.camera;
    },
    fold: fold,
    update: needUpdate,
  };
};
