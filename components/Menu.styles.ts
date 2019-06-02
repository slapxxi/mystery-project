import { css } from '@emotion/core';

let button = (theme: Theme) => css`
  border: 0;
  padding: 0;
  background: transparent;
  line-height: 0;
  fill: ${theme.colors.textLight};
`;

export default {
  button,

  global: css`
    html {
      overflow: hidden !important;
      height: 100% !important;
    }

    body {
      overflow: hidden !important;
      height: 100% !important;
    }
  `,

  container: css`
    line-height: 0;
  `,

  nav: css`
    box-sizing: border-box;
    overflow: scroll;
    position: fixed;
    padding: calc(0.5rem + 12px) 0.5rem;
    background-color: #c22a30;
    top: 0;
    height: 100vh;
    width: 100%;
    color: white;
    transform: translateY(-100%);
    transition: transform 0.3s ease-in-out;

    &.active {
      transform: translateY(0);
    }
  `,

  navHeader: css`
    text-align: right;
  `,

  list: css`
    list-style: none;
    padding: 0;

    > li {
      margin: 1rem 0;
      text-align: center;
    }

    a {
      font-size: 1.4em;
      padding: 1rem;
      text-decoration: none;
      color: white;

      :hover {
        color: grey;
      }
    }
  `,

  menuButton: (theme: Theme) => css`
    ${button(theme)}
    fill: white;
  `,

  icon: css`
    width: 16px;
  `,
};
