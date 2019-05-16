/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import '@self/styles/layout.css';
import { ComponentProps } from 'react';
import Header from './Header';

type Props = ComponentProps<any>;

function Layout(props: Props) {
  let { children } = props;

  return (
    <div
      css={css`
        max-width: 960px;
        margin: 0 auto;
      `}
    >
      <Header />
      <main>{children}</main>
      <footer>Footer</footer>
    </div>
  );
}

export default Layout;
