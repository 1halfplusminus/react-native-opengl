import {Text} from './text';

export const Title1 = Text.withComponent('h1');

Title1.defaultProps = {
  fontSize: 8,
  m: 0,
  fontFamily: 'sans-serif',
  color: 'h1',
  fontWeight: 8,
};

export const Title2 = Text.withComponent('h2');

Title2.defaultProps = {
  fontSize: 4,
  lineHeight: 1.5,
  m: 0,
  fontFamily: 'sans-serif',
  color: 'black',
  fontWeight: 8,
};

export const Title3 = Text.withComponent('h3');

Title3.defaultProps = {
  fontSize: 3,
  lineHeight: 1.5,
  m: 0,
  fontFamily: 'sans-serif',
  color: 'black',
};
