import {darken, transparentize} from 'polished';

export const theme = {
  colors: {
    white: '#ffffff',
    whiteHover: darken(0.05, '#ffffff'),
    whiteLight: '#d9d9d9',
    black: '#000000',
    gray: '#b8b8b8',
    grayDark: '#939393',
    green: '#00ae20',
    greenLight: '#00ff00',
    red: '#ff0000',
    redDark: '#b20000',
    blue: '#01e6ff',
    blueLight: '#c3f9ff',
  },
  spacings: {
    xs: '5px',
    sm: '10px',
    md: '15px',
    lg: '20px',
  },
  fontSizes: {
    base: '16px',
    xxs: '8px',
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '20px',
    xl: '28px',
  },
  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    bold: 600,
  },
  fontFamilies: {
    base: 'Arial, Helvetica, sans-serif',
  },
  gradients: {
    sphere: (color: string) =>
      `radial-gradient(circle at 40% 30%,#0000 4%,57%,#000 90%) ${color}`,
  },
  shadows: {
    raised1: `1px 1px 0 ${transparentize(0.75, 'black')}`,
    raised2: `2px 2px 0 ${transparentize(0.75, 'black')}`,
    raised3: `3px 3px 0 ${transparentize(0.5, 'black')}`,
    lowered1: `
      inset 2px 2px 0 ${transparentize(0.75, 'black')},
      inset -1px -1px 0 ${transparentize(0.75, 'black')}
    `,
    lowered2: `
      inset 3px 3px 0 ${transparentize(0.75, 'black')},
      inset -2px -2px 0 ${transparentize(0.75, 'black')}
    `,
    lowered3: `
      inset 4px 4px 0 ${transparentize(0.75, 'black')},
      inset -2px -2px 0 ${transparentize(0.75, 'black')}
    `,
    textThin: `
      0.5px 0.5px 0 ${transparentize(0.2, 'black')},
      -0.5px 0.5px 0 ${transparentize(0.2, 'black')},
      -0.5px -0.5px 0 ${transparentize(0.2, 'black')},
      0.5px -0.5px 0 ${transparentize(0.2, 'black')};
    `,
    textThinNearTransparent: `
      0.5px 0.5px 0 ${transparentize(0.9, 'black')},
      -0.5px 0.5px 0 ${transparentize(0.9, 'black')},
      -0.5px -0.5px 0 ${transparentize(0.9, 'black')},
      0.5px -0.5px 0 ${transparentize(0.9, 'black')};
    `,
    text: `
      1px 1px 0 ${transparentize(0.2, 'black')},
      -1px 1px 0 ${transparentize(0.2, 'black')},
      -1px -1px 0 ${transparentize(0.2, 'black')},
      1px -1px 0 ${transparentize(0.2, 'black')};
    `,
  },
  breakpoints: {},
  zindexes: {},
};
