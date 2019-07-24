import { css } from '@emotion/core';
import { AppTheme } from '@self/lib/types';
import mediaQueries from '@self/styles/mediaQueries';

const logo = css`
  width: 32px;

  @media ${mediaQueries.tablet} {
    width: 32px;
  }
`;

const link = (theme: AppTheme) => css`
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

  &.active {
    color: ${theme.colors.textEm};
  }
`;

const header = css`
  padding: 0.5rem;
`;

const signinLink = (theme: AppTheme) => css`
  text-decoration: none;
  padding: 5px;
  border: 1px solid ${theme.colors.textLight};
  border-radius: 3px;

  :link,
  :visited {
    color: ${theme.colors.textLight};
  }

  :hover,
  :active {
    border-color: ${theme.colors.textEm};
    color: ${theme.colors.textEm};
  }

  &.active {
    background-color: ${theme.colors.textEm};
    border-color: ${theme.colors.textEm};
    color: white;
  }
`;

const nav = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const menu = css`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  list-style: none;
  margin: 0;
  padding: 0;

  > li {
    margin-right: 1rem;
  }
`;

export default {
  header,
  link,
  logo,
  menu,
  nav,
  signinLink,
};
