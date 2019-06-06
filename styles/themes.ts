import { App } from '@self/lib/types';

let defaultTheme: App.Theme = {
  type: 'light',
  colors: { textLight: 'hsl(230, 10%, 30%)', textEm: 'hsl(0, 60%, 50%)' },
  sizes: {},
  fonts: {},
};

let darkTheme: App.Theme = {
  type: 'dark',
  colors: { textLight: 'hsl(230, 30%, 30%)' },
  sizes: {},
  fonts: {},
};

export { darkTheme, defaultTheme };
