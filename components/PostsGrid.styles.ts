import { css } from '@emotion/core';
import { AppTheme } from '@self/lib/types';

export const container = css`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 20px;
  list-style: none;
  margin: 20px;
  padding: 0;

  @media screen and (min-width: 640px) {
    grid-template-columns: 1fr 1fr;
  }

  @media screen and (min-width: 960px) {
    grid-template-columns: 1fr 1fr 1fr;
  }
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

export const header = (theme: AppTheme) => css`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${theme.colors.itemBg};
  left: 0;
  right: 0;
  bottom: 0;
  transform: translateY(100%);
  transition: transform 0.3s;
  padding: 10px;
  z-index: 1;

  & button:first-of-type {
    margin-right: 5px;
  }
`;

export const footer = css`
  margin-left: auto;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding-top: 10px;
  text-align: right;
  color: grey;

  & > span {
    margin-right: 0.5rem;
  }

  & > span:last-child {
    margin-right: 0;
  }
`;

export const title = (theme: AppTheme) => css`
  padding: 0;
  margin: 0;
  font-size: 1em;
  font-weight: 600;

  & > a:link,
  & > a:visited {
    text-decoration: none;
    color: ${theme.colors.text};
  }
`;

export const imageContainer = css`
  padding-top: 75%;
  height: 0;
  position: relative;
  overflow: hidden;
`;

export const image = css`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
`;

export const time = (theme: AppTheme) => css`
  font-size: 0.9em;
  color: ${theme.colors.textLight};
`;

export const icon = (theme: AppTheme) => css`
  height: 0.8em;
  margin-right: 0.2rem;
  fill: ${theme.colors.textLight};
`;

export const iconContainer = (theme: AppTheme) => css`
  display: flex;
  align-items: center;
`;
