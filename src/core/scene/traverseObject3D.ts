import {Scene, Object3D} from 'three';
import {pipe} from 'fp-ts/lib/pipeable';
import * as option from 'fp-ts/lib/Option';
import {array} from 'fp-ts/lib/Array';

export const traverseObject3D = (...object: Array<option.Option<Object3D>>) => (
  cb: (objects: Object3D[]) => void,
) =>
  pipe(
    array.traverse(option.option)(object, o => o),
    option.map(cb),
  );

export default traverseObject3D;
