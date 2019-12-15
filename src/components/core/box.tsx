import {ComponentType} from 'react';
import {ViewProps} from 'react-native';
import styled from 'styled-components/native';
import {
  color,
  ColorProps,
  display,
  DisplayProps,
  flexbox,
  FlexboxProps,
  fontSize,
  FontSizeProps,
  overflow,
  OverflowProps,
  space,
  SpaceProps,
  width,
  WidthProps,
} from 'styled-system';

export type BoxProps = SpaceProps &
  WidthProps &
  FontSizeProps &
  ColorProps &
  ViewProps &
  OverflowProps &
  FlexboxProps &
  DisplayProps & {
    container?: boolean;
  };

export const Box = styled.View<BoxProps>`
  ${space}
  ${width}
  ${fontSize}
  ${color}
  ${overflow}
  ${flexbox}
  ${display}
  flex-shrink: 1;
  display: flex;
`;

export const FlexRow = styled<ComponentType<BoxProps>>(Box)`
  flex-direction: row;
`;

export const FlexColumn = styled<ComponentType<BoxProps>>(Box)`
  flex-direction: column;
`;
