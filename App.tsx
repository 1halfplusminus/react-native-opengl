/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useRef, useEffect, forwardRef} from 'react';
import {PerspectiveCamera, SpotLight, Scene, Vector} from 'three';
import {useCanvas, useRender, Canvas, useFrame} from './src/src/core/canvas';
import {useGLTF, loadGLFT} from './src/src/core/loaders';
import * as option from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';
import {SceneProvider, useScene} from './src/src/core/Scene';
import {View} from 'react-native';

const MainScene = () => {
  const {height, width, renderer} = useCanvas();
  const {current: camera} = useRef(
    new PerspectiveCamera(45, width / height, 1, 1000),
  );
  const {current: spotLight} = useRef(new SpotLight(0xffffff));
  const {fold, isNone, getObjectByName} = useGLTF(require('./slotscene.gltf'));
  useFrame(() => {
    pipe(
      getObjectByName('Row1'),
      option.fold(
        () => {},
        r => {
          r.position.x += 0.1;
        },
      ),
    );
  });
  useEffect(() => {
    fold(glft => {
      camera.position.z = 3;
      camera.position.x = -0.01;
      spotLight.position.x = 20;
      spotLight.position.y = 50;
      spotLight.position.z = 100;
      glft.scene.add(spotLight);
    });
  }, [isNone]);
  useRender(() => {
    fold(glft => {
      renderer.render(glft.scene, camera);
    });
  });
  return <></>;
};
type SubType<Base, Condition> = Pick<
  Base,
  {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
  }[keyof Base]
>;
const Camera = () => {
  const {renderer, height, width} = useCanvas();
  const {current: camera} = useRef(new PerspectiveCamera(45, width / height));
  const {fold, isNone} = useScene();
  useRender(() => {
    fold(scene => {
      renderer.render(scene, camera);
    });
  }, [isNone]);
  useEffect(() => {
    fold(scene => {
      camera.position.z = 3;
      camera.position.x = -0.01;
      scene.add(camera);
    });
  }, [isNone]);
  return <></>;
};
const Light = (
  props: Partial<SubType<SpotLight, string | number | Vector>>,
) => {
  const {current: spotLight} = useRef(new SpotLight(0xffffff));
  const {fold, isNone} = useScene();
  useEffect(() => {
    if (!isNone) {
      fold(scene => {
        spotLight.position.x = 20;
        spotLight.position.y = 50;
        spotLight.position.z = 100;
        scene.add(spotLight);
      });
    }
  }, [isNone]);
  return <></>;
};
const App = () => {
  const {scene} = useGLTF(require('./slotscene.gltf'));
  return (
    <Canvas>
      <SceneProvider scene={scene}>
        <Camera />
        <Light />
      </SceneProvider>
    </Canvas>
  );
};

export default App;
