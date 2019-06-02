interface Theme {
  colors: {
    textLight: string;
  };
  sizes: {};
  fonts: {};
}

interface I18nProps {
  t: (key: string) => string;
}
