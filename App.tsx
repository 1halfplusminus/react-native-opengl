/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, {useRef, useEffect} from 'react';
import {PerspectiveCamera, SpotLight, Vector, AmbientLight} from 'three';
import {useCanvas, mapRenderer, mapGL} from './src/core/canvas';
import {useGLTF, cacheAssets} from './src/core/loaders';
import * as option from 'fp-ts/lib/Option';
import {pipe} from 'fp-ts/lib/pipeable';
import {useScene} from './src/core/scene';
import {useGame} from './src/features/game/hook';
import {useWheels} from './src/components/wheel/useWheel';
import {Hud} from './src/components/hud/hud';
import {YellowBox} from 'react-native';
import {Canvas} from './src/core/components/canvas';
import {SceneProvider} from './src/core/components/scene';
import {PerspectiveCameraProvider} from './src/core/components/camera';
import {SlotMachineGL} from './src/components/slotmachinegl/slotmachinegl';
import {Provider} from 'react-redux';
import store from './src/app/store';
import {SceneRenderer} from './src/core/components/render';
import {TestTree} from './src/example/tree-fiber';
YellowBox.ignoreWarnings([
  'ode of type atrule not supported as an inline style',
  'Node of type rule not supported as an inline style',
  '',
]);

type SubType<Base, Condition> = Pick<
  Base,
  {
    [Key in keyof Base]: Base[Key] extends Condition ? Key : never;
  }[keyof Base]
>;
/* const SceneRenderer = () => {
  const {renderer, endFrame} = useCanvas();
  const {camera} = useCamera();
  const {fold, scene} = useScene();
  const {animate, endAnimate} = useAnimationFrame();
  const renderScene = () =>
    fold(scene => {
      mapRenderer(renderer)(renderer => {
        mapCamera(camera => {
          logOnce();
          renderer.render(scene, camera);
          endFrame();
        });
      });
    });

  const mapCamera = (cb: (camera: THREE.Camera) => void) =>
    pipe(camera, option.map(cb));
  const logOnce = once(() => {});
  useEffect(() => {
    fold(scene => {
      mapCamera(camera => {
        camera.position.z = 3;
        camera.position.x = -0.01;
        scene.add(camera);
        console.log('add camera');
      });
    });
    return () => {
      fold(scene => {
        mapCamera(camera => {
          console.log('remove camera');
          scene.remove(camera);
        });
      });
    };
  }, [option.isNone(camera), option.isNone(scene)]);
  useEffect(() => {
    animate(renderScene);
    return () => {
      endAnimate();
    };
  }, []);
  return <></>;
}; */
const Light = (
  props: Partial<SubType<SpotLight, string | number | Vector>>,
) => {
  const {current: spotLight} = useRef(new AmbientLight(0xffffff));
  const {fold, isNone} = useScene();
  useEffect(() => {
    fold(scene => {
      spotLight.position.x = 20;
      spotLight.position.y = 50;
      spotLight.position.z = 100;
      scene.add(spotLight);
    });
    return () => {
      fold(scene => {
        scene.remove(spotLight);
      });
    };
  }, [isNone]);
  return <></>;
};
const App = () => {
  const {scene, getObjectByName} = useGLTF('./slotscene.gltf', [
    {
      path: './slotscene.gltf',
      moduleId: require('./slotscene.gltf'),
    },
    {
      path: './slotscene_img2.png',
      moduleId: require('./slotscene_img2.png'),
    },
    {
      path: './slotscene_img1.png',
      moduleId: require('./slotscene_img1.png'),
    },
    {
      path: './slotscene_img0.png',
      moduleId: require('./slotscene_img0.png'),
    },
    {
      path: './slotscene_data.bin',
      moduleId: require('./slotscene_data.bin'),
    },
  ]);
  const {rolls, rollFinished, rolling, loading, start} = useGame();
  const wheels = useWheels({
    wheels: {
      0: 0,
      1: 0,
      2: 0,
    },
    onRollFinish: () => {
      rollFinished();
    },
    rolls,
    rolling,
    loading,
  });
  const {bind} = wheels;
  return (
    <Canvas>
      <SceneProvider scene={scene}>
        <PerspectiveCameraProvider>
          <SceneRenderer>
            <SlotMachineGL
              wheels={[bind(0), bind(1), bind(2)]}
              rows={[
                getObjectByName('Row1'),
                getObjectByName('Row2'),
                getObjectByName('Row3'),
              ]}
            />
          </SceneRenderer>
        </PerspectiveCameraProvider>
        <Light />
      </SceneProvider>
      {
        <Hud
          start={() => {
            if (!loading && !rolling) {
              start();
            }
          }}
        />
      }
    </Canvas>
  );
};

/* const TestApp = () => {
  const {scene} = useGLTF(require('./slotscene.gltf'));
  return (
    <Canvas>
      <SceneProvider scene={scene}>
        <PerspectiveCameraProvider>
          <SceneRenderer />
          <Light />
        </PerspectiveCameraProvider>
      </SceneProvider>
    </Canvas>
  );
}; */
const ConnectedApp = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
export default ConnectedApp;
