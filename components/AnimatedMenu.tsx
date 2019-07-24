/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Link } from '@self/i18n';
import { AppTheme } from '@self/lib/types';
import { useState } from 'react';

const nav = (theme: AppTheme) => css`
  box-sizing: border-box;
  overflow: hidden;
  display: inline-flex;
  position: relative;
  max-width: 100%;
  padding: 0 20px;
  background-color: ${theme.colors.bg};
  box-shadow: ${boxShadowCSS({})};
  border-radius: 40px;

  @media (max-width: 580px) {
    overflow: auto;
  }
`;

const link = (theme: AppTheme) => css`
  box-sizing: border-box;
  position: relative;
  z-index: 1;
  padding: 20px;
  margin: 0 6px;
  text-decoration: none;
  color: ${theme.colors.textLight};
  transition: 0.3s;

  &:before {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 100%;
    height: 5px;
    background-color: #dfe2ea;
    border-radius: 8px 8px 0 0;
    opacity: 0;
    transition: 0.3s;
  }

  :not(.active):hover:before {
    opacity: 1;
    bottom: 0;
  }

  :not(.active):hover {
    color: #333;
  }
`;

const indicator = (theme: AppTheme) => css`
  z-index: 1;
  position: absolute;
  left: 0;
  bottom: 0;
  transition: transform 0.4s;
  height: 5px;
  border-radius: 8px 8px 0 0;
  background: ${theme.colors.textEm};
  transform: translateX(0);
`;

function AnimatedMenu() {
  let [position, setPosition] = useState({ left: 0, width: 0 });

  function handleClick(e: React.MouseEvent<HTMLAnchorElement>) {
    let target = e.currentTarget;

    if (!target.classList.contains('active')) {
      setPosition({ left: target.offsetLeft, width: target.offsetWidth - 10 });
    }
  }

  return (
    <nav css={nav}>
      <Link href="/" passHref>
        <a css={link} onClick={handleClick}>
          Home
        </a>
      </Link>
      <Link href="/test" passHref>
        <a css={link} onClick={handleClick}>
          Testing
        </a>
      </Link>
      <Link href="/feed" passHref>
        <a css={link} onClick={handleClick}>
          Feed
        </a>
      </Link>
      <Link href="/settings" passHref>
        <a css={link} onClick={handleClick}>
          Settings
        </a>
      </Link>
      <span
        css={indicator}
        style={{ width: position.width, transform: `translateX(${position.left}px)` }}
      ></span>
    </nav>
  );
}

function boxShadowCSS(config: any) {
  config;
  return `0 10px 40px rgba(159, 162, 177, 0.8)`;
}

export default AnimatedMenu;
