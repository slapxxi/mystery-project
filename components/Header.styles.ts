import { css } from '@emotion/core';
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
    width: 38px;

    @media ${mediaQueries.tablet} {
      width: 48px;
    }
  `,

  link: css`
    text-decoration: none;

    :link,
    :visited {
      color: slategrey;
    }

    :hover,
    :active {
      color: black;
    }
  `,
};
