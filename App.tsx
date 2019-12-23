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
import {SpotLight, Vector, AmbientLight} from 'three';
import * as option from 'fp-ts/lib/Option';
import {useGame} from './src/features/game/hook';
import {useWheels} from './src/components/wheel/useWheel';
import {Hud} from './src/components/hud/hud';
import {YellowBox} from 'react-native';
import {Canvas} from './src/core/containers/canvas';
import {PerspectiveCameraProvider} from './src/core/containers/camera';
import {SlotMachineGL} from './src/components/slotmachinegl/slotmachinegl';
import {Provider} from 'react-redux';
import store from './src/app/store';
import {SceneRenderer} from './src/core/containers/render';
import {useRendererScene} from './src/core/render';
import addOption from './src/core/scene/addOption';
import removeOption from './src/core/scene/removeOptions';
import Orientation from 'react-native-orientation-locker';
import {useGLTF} from './src/core/loaders';

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
  const {scene, isSome} = useRendererScene();
  useEffect(() => {
    if (isSome) {
      addOption(scene)(option.some(spotLight));
    }
    return () => {
      removeOption(scene)(option.some(spotLight));
    };
  }, [option.isSome(scene)]);
  return <></>;
};
const App = () => {
  const {scene, getObjectByName} = useGLTF('./slotscene.gltf', [
    {
      path: './slotscene.gltf',
      moduleId: require('./src/components/slotmachinegl/slotscene.gltf'),
    },
    {
      path: './slotscene_img2.png',
      moduleId: require('./src/components/slotmachinegl/slotscene_img2.png'),
    },
    {
      path: './slotscene_img1.png',
      moduleId: require('./src/components/slotmachinegl/slotscene_img1.png'),
    },
    {
      path: './slotscene_img0.png',
      moduleId: require('./src/components/slotmachinegl/slotscene_img0.png'),
    },
    {
      path: './slotscene_data.bin',
      moduleId: require('./src/components/slotmachinegl/slotscene_data.bin'),
    },
  ]);
  const {rolls, rollFinished, rolling, loading, start} = useGame();
  const wheels = useWheels({
    wheels: {
      0: 0,
      1: 1,
      2: 2,
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
      <PerspectiveCameraProvider>
        <SceneRenderer>
          <Light />
          <SlotMachineGL
            getObjectByName={getObjectByName}
            wheels={[bind(0), bind(1), bind(2)]}
          />
        </SceneRenderer>
      </PerspectiveCameraProvider>

      {
        <Hud
          getObjectByName={getObjectByName}
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
  /*   Orientation.lockToLandscape(); */
  useEffect(() => {
    Orientation.lockToLandscape();
  }, []);
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};
export default ConnectedApp;
