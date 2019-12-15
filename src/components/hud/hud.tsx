import React from 'react';
import styled, {css} from 'styled-components';
import {Box} from '../core/box';
import {Button} from '../core/button';
import {Text} from '../core/text';
import {View} from 'react-native';

export interface HudProps {
  start: () => void;
}
export const Hud = ({start}: HudProps) => {
  return (
    <View>
      <UpperLeft />
      <UpperRight></UpperRight>
      <LowerLeft />

      <LowerRight justifyContent="center" alignItems="center" container={true}>
        <Button
          title={'Jouer'}
          onPress={() => {
            start();
          }}
        />
      </LowerRight>
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
  left: 50px;
  transform: skew(-5deg, -10deg);
  width: 200px;
  & > h1 {
    margin: 0;
  }
  & > h2 {
    margin: 0;
  }
  @media only screen and (max-width: 900px) {
    bottom: 30px;
    & > h1 {
    }
    & > h2 {
    }
  }
`;

const LowerRight = styled(Box)`
  ${base}
  bottom: 70px;
  right: 50px;
  @media only screen and (max-width: 900px) {
    bottom: 50px;
    height: 40px;
    width: 150px;
  }
`;
