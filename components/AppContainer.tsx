import { ComponentProps } from 'react';
import Layout from './Layout';

type Props = ComponentProps<'div'>;

function AppContainer(props: Props) {
  let { children } = props;

  return <Layout>{children}</Layout>;
}

export default AppContainer;
