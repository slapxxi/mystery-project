import { AppTheme } from '@self/lib/types';

let defaultTheme: AppTheme = {
  type: 'light',
  colors: { textLight: 'hsl(230, 10%, 30%)', textEm: 'hsl(219, 100%, 53%)' },
  sizes: {},
  fonts: {},
};

let darkTheme: AppTheme = {
  type: 'dark',
  colors: { textLight: 'hsl(230, 30%, 30%)' },
  sizes: {},
  fonts: {},
};

export { darkTheme, defaultTheme };
