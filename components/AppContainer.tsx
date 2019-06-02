import { defaultTheme } from '@self/styles/themes';
import { ThemeProvider } from 'emotion-theming';
import { ComponentProps } from 'react';
import Layout from './Layout';

type Props = ComponentProps<'div'>;

function AppContainer(props: Props) {
  let { children } = props;

  return (
    <ThemeProvider theme={defaultTheme}>
      <Layout>{children}</Layout>
    </ThemeProvider>
  );
}

export default AppContainer;
