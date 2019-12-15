import React, {PropsWithChildren} from 'react';
import styled from 'styled-components';
import {Hud} from '../../../components/hud/hud';
import {useGame} from '../hook';

const PlayButton = styled.div`
  cursor: pointer;
  border-radius: 100px;
  :hover {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

export const ConnectedHud = (props: PropsWithChildren<{}>) => {
  const {start, loading, rolling} = useGame();
  /*   const {css} = use3DPopper({
    key: 'Empty',
    mapPosition: ({x, y}) => ({x: x + 3, y}),
    height: 59,
    width: 95,
  }); */
  return (
    <>
      <Hud
        {...props}
        start={() => {
          if (!loading && !rolling) {
            start();
          }
        }}
      />
      <PlayButton
        onClick={() => {
          if (!loading && !rolling) {
            start();
          }
        }}
        /*         css={css} */
      />
    </>
  );
};
