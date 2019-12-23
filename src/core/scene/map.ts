import {Scene} from 'three';
import {pipe} from 'fp-ts/lib/pipeable';
import * as option from 'fp-ts/lib/Option';

export const map = (scene: option.Option<Scene>) => (
  cb: (scene: Scene) => void,
) => pipe(scene, option.map(cb));

export default map;
