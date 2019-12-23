import {Object3D} from 'three';
import {pipe} from 'fp-ts/lib/pipeable';
import {useCanvas} from './canvas';
import {useCamera} from './camera';
import * as option from 'fp-ts/lib/Option';
import {useMemo, useCallback, useState, useEffect} from 'react';

export function screenXY({
  position3D,
  camera,
  width,
  height,
}: {
  position3D: THREE.Vector3;
  camera: THREE.Camera;
  width: number;
  height: number;
}) {
  const vector = position3D.clone();
  const windowWidth = width;

  const widthHalf = windowWidth / 2;
  const heightHalf = height / 2;

  vector.project(camera);

  vector.x = vector.x * widthHalf + widthHalf;
  vector.y = -(vector.y * heightHalf) + heightHalf;
  vector.z = 0;

  return vector;
}

interface UseObject3DPositionProps {
  object: option.Option<Object3D>;
  mapPosition?: ({x, y}: {x: number; y: number}) => {x: number; y: number};
}
export const useObject3DPosition = ({
  object,
  mapPosition = p => p,
}: UseObject3DPositionProps) => {
  const {height, width} = useCanvas();
  const {map, camera} = useCamera();
  const [position, setPosition] = useState<
    option.Option<{x: number; y: number}>
  >(option.none);
  const getPositions = () =>
    pipe(
      object,
      option.map(o => {
        console.log(o.position, camera);
        return o.position;
      }),
      option.chain(p =>
        map(camera => screenXY({position3D: p, camera, height, width})),
      ),
      option.map(v => ({x: v.x, y: v.y})),
    );
  useEffect(() => {
    setPosition(getPositions());
    console.log(
      pipe(
        position,
        option.map(mapPosition),
        option.fold(
          () => ``,
          position => `
          position: absolute;
          top: ${position.y}px;
          left: ${position.x}px;
          z-index: 99999;
        `,
        ),
      ),
    );
  }, [object, camera]);
  return {
    position: position,
    style: () =>
      pipe(
        position,
        option.map(position => ({top: position.y, left: position.x})),
      ),
    css: () =>
      pipe(
        position,
        option.map(mapPosition),
        option.fold(
          () => ``,
          position => `
          position: absolute;
          top: ${position.y}px;
          left: ${position.x}px;
          z-index: 99999;
        `,
        ),
      ),
  };
};

export const use3DPopper = ({
  object,
  height,
  width,
  mapPosition = p => p,
}: UseObject3DPositionProps & {height: number; width: number}) => {
  const {css} = useObject3DPosition({
    object,
    mapPosition: p =>
      pipe(p, p2 => ({x: p2.x - width / 2, y: p2.y - height / 2}), mapPosition),
  });

  return {
    css: pipe(
      css(),
      base => `
          ${base}
          height: ${height}px;
          width: ${width}px;
        `,
    ),
  };
};
