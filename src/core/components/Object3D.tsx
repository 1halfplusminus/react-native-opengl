import {Object3D} from 'three';
import * as option from 'fp-ts/lib/Option';
import {useRendererScene} from '../render';
import React, {useEffect} from 'react';
import addOption from '../scene/addOption';
import removeOption from '../scene/removeOptions';

export const MeshComponent = ({object}: {object: option.Option<Object3D>}) => {
  const {scene} = useRendererScene();
  useEffect(() => {
    addOption(scene)(object);
    return () => {
      removeOption(scene)(object);
    };
  }, [scene, object]);
  return <></>;
};
