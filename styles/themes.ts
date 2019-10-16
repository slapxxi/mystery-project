import { AppTheme } from '@self/lib/types';

const defaultTheme: AppTheme = {
  type: 'light',
  colors: {
    text: 'hsl(0, 10%, 20%)',
    textLight: 'hsl(0, 0%, 70%)',
    textEm: 'hsl(0, 100%, 70%)',
    itemBg: 'hsl(0, 0%, 100%)',
    bg: 'hsl(0, 0%, 96%)',

    headerBg: 'hsl(0, 0%, 20%)',
    headerLink: 'hsl(0, 0%, 75%)',
    headerLinkActive: 'hsl(0, 0%, 95%)',
  },
  sizes: {},
  fonts: {},
};

const darkTheme: AppTheme = {
  type: 'dark',
  colors: {
    text: 'hsl(1, 20%, 90%)',
    textLight: 'hsl(0, 1%, 50%)',
    textEm: 'hsl(1, 100%, 70%)',
    itemBg: 'hsl(1, 1%, 20%)',
    bg: 'hsl(1, 1%, 10%)',

    headerBg: 'hsl(0, 0%, 25%)',
    headerLink: 'hsl(0, 1%, 60%)',
    headerLinkActive: 'hsl(0, 1%, 70%)',
  },
  sizes: {},
  fonts: {},
};

export { darkTheme, defaultTheme };
