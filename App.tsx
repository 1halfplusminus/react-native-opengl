/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {StyleSheet, View} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {GLView, ExpoWebGLRenderingContext} from 'expo-gl';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader';
import {FBXLoader} from 'three/examples/jsm/loaders/FBXLoader';
import {Scene, AmbientLight, LoadingManager} from 'three';
import {Asset} from 'react-native-unimodules';
import ExpoTextureLoader from './TextureLoader';

const onContextCreate = (gl: ExpoWebGLRenderingContext) => {
  let requestId: number;
  //@ts-ignore
  const {drawingBufferWidth: width, drawingBufferHeight: height} = gl;
  const renderer = new THREE.WebGLRenderer({
    canvas: {
      width,
      height,
      style: {},
      addEventListener: () => {},
      removeEventListener: () => {},
      clientHeight: height,
    },
    context: gl,
  });
  renderer.setSize(width, height);
  renderer.setClearColor(0xffffff, 1);

  const camera = new THREE.PerspectiveCamera(75, width / height, 1, 1100);
  /*   const scene = new THREE.Scene(); */
  let cube: THREE.Mesh;
  let scene: Scene;
  console.log(Asset.fromModule(require('./slotscene.glb')).uri);
  const manager = new LoadingManager();
  manager.addHandler(/.png/, new ExpoTextureLoader(manager));
  new GLTFLoader(manager).load(
    Asset.fromModule(require('./slotscene.gltf')).uri,
    assets => {
      scene = new Scene();
      scene.add(new AmbientLight(0x404040, 2));
      scene.add(assets.scene);
      init();
      animate();
    },
  );
  function init() {
    camera.position.z = 2;
    const cube = scene.getObjectByName('SlotMachine');
    if (cube) {
      camera.lookAt(cube.position);
    }

    /*  let geometry = new THREE.BoxGeometry(200, 200, 200);
    for (let i = 0; i < geometry.faces.length; i += 2) {
      let hex = Math.random() * 0xffffff;
      geometry.faces[i].color.setHex(hex);
      geometry.faces[i + 1].color.setHex(hex);
    }
    let material = new THREE.MeshBasicMaterial({
      vertexColors: THREE.FaceColors,
    });
    cube = new THREE.Mesh(geometry, material);
    cube.position.y = 150;
    scene.add(cube);
    return cube; */
  }

  const animate = () => {
    requestId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
    const cube = scene.getObjectByName('Cube');
    if (cube) {
      cube.rotation.y += 0.05;
      cube.rotation.x += 0.02;
      cube.rotation.z += 0.03;
    }

    gl.endFrameEXP();
  };
};
const App = () => {
  console.log('here');

  return (
    <View style={{flex: 1}}>
      <GLView style={{flex: 1}} onContextCreate={onContextCreate} />
    </View>
  );
};

export default App;
