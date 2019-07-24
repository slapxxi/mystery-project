import { AppTheme } from '@self/lib/types';

const defaultTheme: AppTheme = {
  type: 'light',
  colors: {
    text: 'hsl(1, 10%, 20%)',
    textLight: 'hsl(1, 10%, 40%)',
    textEm: 'hsl(1, 100%, 70%)',
    bg: 'hsl(1, 10%, 99%)',
  },
  sizes: {},
  fonts: {},
};

const darkTheme: AppTheme = {
  type: 'dark',
  colors: {
    text: 'hsl(1, 20%, 90%)',
    textLight: 'hsl(1, 10%, 30%)',
    textEm: 'hsl(1, 100%, 70%)',
    bg: 'hsl(1, 1%, 10%)',
  },
  sizes: {},
  fonts: {},
};

export { darkTheme, defaultTheme };
