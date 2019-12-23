import {Scene, Object3D} from 'three';
import {pipe} from 'fp-ts/lib/pipeable';
import * as option from 'fp-ts/lib/Option';
import traverseObject3D from './traverseObject3D';

export const removeOption = (scene: option.Option<Scene>) => (
  ...object: Array<option.Option<Object3D>>
) =>
  pipe(
    scene,
    option.map(scene =>
      traverseObject3D(...object)(objects => {
        scene.remove(...objects);
      }),
    ),
  );

export default removeOption;
