import React from 'react';
import styled, {css} from 'styled-components';
import {Box} from '../core/box';
import {Button} from '../core/button';
import {View} from 'react-native';
import * as option from 'fp-ts/lib/Option';
import {Object3D} from 'three';
import {use3DPopper} from '../../core/utils';

export interface HudProps {
  start: () => void;
  getObjectByName: (name: string) => option.Option<Object3D>;
}
const PlayButton = styled(Button)`
  border-radius: 100px;
  :hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
export const Hud = ({start, getObjectByName}: HudProps) => {
  const {css} = use3DPopper({
    object: getObjectByName('Empty'),
    mapPosition: ({x, y}) => ({x: x + 3, y}),
    height: 59,
    width: 95,
  });

  return (
    <View>
      <UpperLeft />
      <UpperRight></UpperRight>
      <LowerLeft />

      <LowerLeft justifyContent="center" alignItems="center" container={true}>
        <Button
          title={'Jouer'}
          onPress={() => {
            start();
          }}
        />
      </LowerLeft>
      {/*   <PlayButton
        title=""
        onPress={() => {
          start();
        }}
        css={css}
      /> */}
    </View>
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
