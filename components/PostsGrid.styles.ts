import { css } from '@emotion/core';
import { AppTheme } from '@self/lib/types';

export const container = css`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 20px;
  list-style: none;
  margin: 20px;
  padding: 0;
`;

export const item = (theme: AppTheme) => css`
  padding: 10px;
  position: relative;
  background: ${theme.colors.itemBg};
  border-radius: 2px;
  box-shadow: 0 2px 2px 1px rgba(0, 0, 0, 0.05);
  overflow: hidden;

  &:hover header {
    transform: none;
  }
`;

export const header = css`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateY(100%);
  transition: transform 0.3s;
  padding: 10px;

  & button:first-of-type {
    margin-right: 5px;
  }
`;

export const footer = css`
  text-align: right;
  color: grey;
`;

export const title = css`
  padding: 0;
  margin: 0;
  font-size: 1em;
  font-weight: 600;

  & > a:link,
  & > a:visited {
    text-decoration: none;
    color: black;
  }
`;

export const image = css`
  width: 100%;
`;

export const time = (theme: AppTheme) => css`
  font-size: 0.9em;
  color: ${theme.colors.textLight};
`;
