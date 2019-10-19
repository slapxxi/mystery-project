/** @jsx jsx */
import { css, Global, jsx } from '@emotion/core';
import { AppTheme } from '@self/lib/types';
import '@self/styles/layout.css';
import { ComponentProps } from 'react';
import Header from './Header';

type Props = ComponentProps<any>;

function Layout(props: Props) {
  let { children } = props;

  return (
    <div
      css={(theme: AppTheme) => css`
        max-width: 960px;
        margin: 0 auto;
        background: ${theme.colors.bg};
      `}
    >
      <Global
        styles={(theme: AppTheme) => css`
          :root {
            color-scheme: light dark;
          }

          html {
            background: ${theme.colors.bg};
            color: ${theme.colors.text};
          }

          a:link,
          a:visited {
            color: hsl(200, 70%, 50%);
            text-decoration: none;
          }

          a:hover,
          a:active {
            color: hsl(200, 60%, 40%);
          }
        `}
      ></Global>
      <Header />
      <main>{children}</main>
      <footer>
        <a href="https://github.com/slavapavlutin">@slavapavlutin</a>
      </footer>
    </div>
  );
}

export default Layout;
