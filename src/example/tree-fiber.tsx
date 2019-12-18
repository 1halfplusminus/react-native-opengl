import * as THREE from 'three';
import React, {useEffect, useRef, useState} from 'react';
import {Canvas} from '../core/components/canvas';
import {SceneProvider} from '../core/components/scene';
import {PerspectiveCameraProvider} from '../core/components/camera';
import {SceneRenderer} from '../core/components/render';
import {
  Light,
  Scene,
  Mesh,
  TorusBufferGeometry,
  MeshBasicMaterial,
  TorusKnotBufferGeometry,
} from 'three';
import * as option from 'fp-ts/lib/Option';
import {useAnimationFrame, useRender} from '../core/render';
import {useCanvas} from '../core/canvas';
import {useScene} from '../core/scene';
import {useCamera} from '../core/camera';

let subscribers: Array<() => void> = [];

function TorusKnot() {
  const {render, endFrame, gl, renderer} = useCanvas();
  const {scene, fold} = useScene();
  const {camera, map, fold: foldCamera, update} = useCamera();
  let ref = useRef<THREE.Mesh>(
    new Mesh(
      new TorusKnotBufferGeometry(10, 3, 100, 16),
      new MeshBasicMaterial({color: 'hotpink'}),
    ),
  );
  let t = 0;
  useEffect(() => {
    fold(s => {
      s.add(ref.current);
    });
  }, [option.isSome(scene)]);
  useEffect(() => {
    fold(scene => {
      map(camera => {
        scene.add(camera);
        camera.position.z = 35;
      });
    });
    return () => {
      fold(scene => {
        map(camera => {
          scene.remove(camera);
        });
      });
    };
  }, [option.isSome(camera), option.isSome(scene)]);
  /* const {animate} = useRender(() => {
    if (
      option.isSome(scene) &&
      option.isSome(camera) &&
      option.isSome(gl) &&
      option.isSome(renderer)
    ) {
      render(scene, camera);
      endFrame();
    }
  }); */

  const {animate, endAnimate} = useAnimationFrame();
  useEffect(() => {
    animate(() => {
      render(scene, camera);
      endFrame();
    });
    return () => {
      endAnimate();
    };
  }, [scene, camera, gl, renderer]);
  return <></>;
}
const scene = new THREE.Scene();
export function TestTree() {
  return (
    <Canvas>
      <SceneProvider scene={option.some(scene)}>
        <PerspectiveCameraProvider>
          <TorusKnot />
        </PerspectiveCameraProvider>
      </SceneProvider>
    </Canvas>
  );
}
