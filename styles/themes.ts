import { AppTheme } from '@self/lib/types';

const defaultTheme: AppTheme = {
  type: 'light',
  colors: {
    textLight: 'hsl(230, 10%, 30%)',
    textEm: 'hsl(1, 100%, 70%)',
    bg: 'hsl(1, 10%, 99%)',
  },
  sizes: {},
  fonts: {},
};

const darkTheme: AppTheme = {
  type: 'dark',
  colors: {
    textLight: 'hsl(1, 10%, 30%)',
    textEm: 'hsl(1, 100%, 70%)',
    bg: 'hsl(1, 1%, 20%)',
  },
  sizes: {},
  fonts: {},
};

export { darkTheme, defaultTheme };
