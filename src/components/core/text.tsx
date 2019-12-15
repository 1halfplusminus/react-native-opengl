import styled from 'styled-components/native';
import {
  color,
  fontFamily,
  FontFamilyProps,
  fontSize,
  FontSizeProps,
  fontWeight,
  FontWeightProps,
  lineHeight,
  LineHeightProps,
  margin,
  MarginProps,
  space,
  SpaceProps,
  textAlign,
  TextAlignProps,
  textStyle,
  TextStyleProps,
} from 'styled-system';
import {TextColorProps} from '../../theme';

export type TextProps = FontSizeProps &
  SpaceProps &
  FontWeightProps &
  LineHeightProps &
  MarginProps &
  TextAlignProps &
  TextStyleProps &
  FontFamilyProps &
  TextColorProps;

export const Text = styled.Text<TextProps>`
  ${space}
  ${fontSize}
  ${fontWeight}
  ${lineHeight}
  ${color}
  ${margin}
  ${textAlign}
  ${textStyle}
  ${fontFamily}
`;

export const Link = styled(Text.withComponent('a'))`
  text-decoration: none;
  :hover {
    color: ${props => props.theme.colors.black};
  }
`;

Link.defaultProps = {
  color: 'black',
};

export default Text;
