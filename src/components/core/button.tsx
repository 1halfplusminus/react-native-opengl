import {darken} from 'polished';
import {ViewProps} from 'react-native';
import styled, {css} from 'styled-components/native';
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

export type ButtonProps = SpaceProps &
  WidthProps &
  FontSizeProps &
  ColorProps &
  ViewProps &
  OverflowProps &
  DisplayProps &
  FlexboxProps;

const baseButton = css`
  transform: skew(5deg, 10deg);
  height: 60px;
  width: 200px;
  background: coral;
  text-transform: uppercase;
  font-weight: 900;
  color: indianred;
  border: 0px;
  :hover {
    background: ${darken(0.1)('coral')};
  }
  :focus {
    outline: 0;
  }
`;
export const Button = styled.Button<ButtonProps>`
  ${baseButton}
  ${space}
  ${width}
  ${fontSize}
  ${color}
  ${overflow}
  ${flexbox}
  ${display}
  flex-shrink: 1;
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
`;
