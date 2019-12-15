import {Camera} from 'three';
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useImperativeHandle,
  useRef,
} from 'react';
import * as option from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';

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
  const [needUpdate, setNeedUpdate] = useState(false);
  const context = useContext(CameraContext);
  const {current: map} = useRef((cb: <T>(camera: Camera) => T | void) =>
    pipe(context.camera, option.map(cb)),
  );
  useEffect(() => {
    if (!option.isNone(context.camera)) {
      if (cb) {
        console.log('in use use effect useCamera');
        map(c => {
          cb(c);
          setNeedUpdate(true);
          console.log('after update', c.position.x, c.position.z);
        });
      }
    }
  }, [option.isNone(context.camera)]);

  return {
    camera: context.camera,
    map: map,
    getCamera: () => {
      return context.camera;
    },
  };
};
