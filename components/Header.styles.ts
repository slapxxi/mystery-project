import { css } from '@emotion/core';
import { App } from '@self/lib/types';
import mediaQueries from '@self/styles/mediaQueries';

export default {
  header: css`
    padding: 0.5rem;
  `,

  nav: css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    list-style: none;
    margin: 0;
    padding: 0;
  `,

  menu: css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    list-style: none;
    margin: 0;
    padding: 0;

    > li {
      margin-right: 1rem;
    }
  `,

  logo: css`
    width: 22px;

    @media ${mediaQueries.tablet} {
      width: 24px;
    }
  `,

  link: (theme: App.Theme) => css`
    position: relative;
    text-decoration: none;

    :link,
    :visited {
      color: ${theme.colors.textLight};
    }

    :hover,
    :active {
      color: ${theme.colors.textEm};
    }

    &::after {
      content: '';
      position: absolute;
      height: 2px;
      top: 100%;
      top: calc(100% + 0.3rem);
      left: -1px;
      right: -1px;
      background: ${theme.colors.textEm};
      transform: scaleX(0);
      transition: transform 0.25s ease-out;
    }

    &.active::after {
      transform: scaleX(1);
    }
  `,
};
