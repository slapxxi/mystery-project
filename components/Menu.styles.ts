import { css } from '@emotion/core';

export default {
  nav: css`
    overflow: scroll;
    position: fixed;
    padding: 2rem;
    background-color: #c22a30;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    color: white;
  `,

  list: css`
    list-style: none;
    margin: 0;
    padding: 0;

    > li {
      margin: 1rem 0;
    }

    a {
      text-decoration: none;
      color: white;

      :hover {
        color: grey;
      }
    }
  `,

  button: css`
    border: 0;
    padding: 0;
    background: transparent;
  `,
};
