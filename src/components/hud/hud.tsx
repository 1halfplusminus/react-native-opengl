import React, {useCallback} from 'react';
import styled, {css} from 'styled-components';
import {Box} from '../core/box';

import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  GestureResponderEvent,
} from 'react-native';
import * as option from 'fp-ts/lib/Option';
import {Object3D, Vector2} from 'three';
import {useCanvas} from '../../core/canvas';
import {Vector3, Raycaster} from 'three';
import {useCamera} from '../../core/camera';
import {useRendererScene} from '../../core/render';
import {pipe} from 'fp-ts/lib/pipeable';
import {use3DPopper} from '../../core/utils';
export interface HudProps {
  start: () => void;
  getObjectByName: (name: string) => option.Option<Object3D>;
}
const PlayButton = styled(TouchableOpacity)`
  border-radius: 100px;
  :hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
export const Hud = ({start, getObjectByName}: HudProps) => {
  /* const {style} = use3DPopper({
    object: getObjectByName('Empty'),
    mapPosition: ({x, y}) => ({x: x + 3, y}),
    height: 59,
    width: 95,
  }); */
  /*   console.log(style); */
  const {width, height} = useCanvas();
  const {map, camera} = useCamera();
  const {scene} = useRendererScene();
  const onPress = (e: GestureResponderEvent) => {
    const x = e.nativeEvent.pageX;
    const y = e.nativeEvent.pageY;
    const raycaster = new Raycaster();
    const mouse = new Vector2();
    mouse.x = (x / width) * 2 - 1;
    mouse.y = -(y / height) * 2 + 1;
    pipe(
      scene,
      option.map(scene => {
        map(camera => {
          raycaster.setFromCamera(mouse, camera);
          pipe(
            getObjectByName('Empty'),
            option.map(object => {
              // calculate objects intersecting the picking ray
              var intersects = raycaster.intersectObjects(scene.children);
              for (var i = 0; i < intersects.length; i++) {
                start();
                break;
              }
            }),
          );
        });
      }),
    );
  };
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View
        style={{
          flex: 1,
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          position: 'absolute',
        }}>
        <UpperLeft />
        <UpperRight></UpperRight>
        <TouchableOpacity
          onPress={() => {
            start();
          }}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
const base = css`
  position: absolute;
  text-transform: uppercase;
  font-weight: 900;
  color: indianred;
`;

const UpperLeft = styled(Box)`
  ${base}
  top: 40px;
  left: 50px;
  font-size: 15px;
  transform: skew(5deg, 10deg);
  @media only screen and (max-width: 900px) {
    font-size: 1.5em;
  }
`;

const UpperRight = styled(Box)`
  ${base}
  text-align: right;
  top: 40px;
  right: 50px;
  font-size: 50px;
  transform: skew(-5deg, -10deg);
  & > a {
    color: indianred;
    text-decoration: none;
  }
  @media only screen and (max-width: 900px) {
    font-size: 40px;
  }
`;

const LowerLeft = styled(Box)`
  ${base}
  bottom: 5px;
  left: 0px;
  width: 200px;
  background-color: transparent;
  & > h1 {
    margin: 0;
  }
  & > h2 {
    margin: 0;
  }
  @media only screen and (max-width: 900px) {
    bottom: 5px;
  }
`;

const LowerRight = styled(Box)`
  ${base}
  bottom: 5px;
  right: 50px;
  @media only screen and (max-width: 900px) {
    bottom: 50px;
    height: 40px;
    width: 150px;
  }
`;
