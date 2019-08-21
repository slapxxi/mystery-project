import { AppTheme } from '@self/lib/types';
import { darkTheme, defaultTheme } from '@self/styles/themes';
import { ThemeProvider as EmotionThemeProvider } from 'emotion-theming';
import { createContext, useState } from 'react';

interface Props {
  children: React.ReactNode;
}

let ThemeContext = createContext({
  theme: defaultTheme,
  changeTheme: (type: AppTheme['type']) => {},
});
let { Provider, Consumer } = ThemeContext;

function ThemeProvider(props: Props) {
  let { children } = props;
  let [theme, setTheme] = useState(defaultTheme);

  function changeTheme(themeType: AppTheme['type']) {
    if (themeType === 'dark') {
      setTheme(darkTheme);
    } else {
      setTheme(defaultTheme);
    }
  }

  return (
    <Provider value={{ changeTheme, theme }}>
      <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>
    </Provider>
  );
}

export { ThemeContext };
export default ThemeProvider;
