import {Object3D, Vector3, PerspectiveCamera} from 'three';
import {pipe} from 'fp-ts/lib/pipeable';
import {useCanvas} from './canvas';
import {useCamera} from './camera';
import * as option from 'fp-ts/lib/Option';
import {useMemo, useCallback} from 'react';
import {ViewStyle} from 'react-native';
import {
  MathNode,
  OperatorNode,
  Vector2Node,
  TimerNode,
  UVNode,
} from 'three/examples/jsm/nodes/Nodes';

export function screenXY({
  object,
  camera,
  width,
  height,
}: {
  object: THREE.Object3D;
  camera: THREE.Camera;
  width: number;
  height: number;
}) {
  const vector = new Vector3();
  vector.setFromMatrixPosition(object.matrixWorld);
  const windowWidth = width;

  const widthHalf = windowWidth / 2;
  const heightHalf = height / 2;
  if (camera instanceof PerspectiveCamera) {
    camera.updateProjectionMatrix();
  }
  vector.project(camera);
  if (!isNaN(vector.x)) {
    vector.x = vector.x * widthHalf + widthHalf;
    vector.y = -(vector.y * heightHalf) + heightHalf;
    vector.z = 0;

    return vector;
  }
  vector.x = 0;
  vector.y = 0;
  console.log(vector);
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
  const getPositions = useCallback(
    () =>
      pipe(
        object,
        option.map(o => o),
        option.chain(o =>
          map(camera => screenXY({object: o, camera, height, width})),
        ),
        option.map(v => ({x: v.x, y: v.y})),
      ),
    [object, camera._tag, height, width],
  );
  const css = useMemo(
    () =>
      pipe(
        getPositions(),
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
    [camera._tag, height, width, object._tag],
  );
  const style = useMemo(
    () =>
      pipe(
        getPositions(),
        option.map(mapPosition),
        option.fold(
          () => ({top: 0, left: 0}),
          position => ({
            top: position.y,
            left: position.x,
          }),
        ),
      ),
    [camera, height, width, object._tag],
  );
  return {
    style,
    css,
  };
};

export const use3DPopper = ({
  object,
  height,
  width,
  mapPosition = p => p,
}: UseObject3DPositionProps & {height: number; width: number}) => {
  const {css, style} = useObject3DPosition({
    object,
    mapPosition: p =>
      pipe(p, p2 => ({x: p2.x - width / 2, y: p2.y - height / 2}), mapPosition),
  });
  const {height: cHeight, width: cWidth} = useCanvas();
  const {map, camera} = useCamera();
  const newCss = useMemo(
    () =>
      pipe(
        css,
        base => `
        ${base}
        height: ${height}px;
        width: ${width}px;
      `,
      ),
    [css],
  );
  const newStyle = useMemo(
    () =>
      ({
        height,
        width,
        position: 'absolute',
        zIndex: 9999999,
        backgroundColor: 'red',
        top: style.top,
        left: style.left,
      } as ViewStyle),
    [cHeight, cWidth, object._tag, camera._tag, style],
  );
  return {
    css: newCss,
    style: newStyle,
  };
};
export function createHorizontalSpriteSheetNode(
  hCount: number,
  speedParameter: number,
) {
  const speed = new Vector2Node(speedParameter, 0); // frame per second
  const scale = new Vector2Node(1 / hCount, 1); // 8 horizontal images in sprite-sheet
  const uvTimer = new OperatorNode(new TimerNode(), speed, OperatorNode.MUL);
  const uvIntegerTimer = new MathNode(uvTimer, MathNode.FLOOR);
  const uvFrameOffset = new OperatorNode(
    uvIntegerTimer,
    scale,
    OperatorNode.MUL,
  );
  const uvScale = new OperatorNode(new UVNode(), scale, OperatorNode.MUL);
  const uvFrame = new OperatorNode(uvScale, uvFrameOffset, OperatorNode.ADD);
  return uvFrame;
}
