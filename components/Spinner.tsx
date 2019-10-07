/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core';
import { AppTheme } from '@self/lib/types';

function Spinner(props: any) {
  let { width = 20, ...rest } = props;

  return (
    <svg
      width={width}
      stroke="#000"
      viewBox="0 0 100 100"
      css={(theme) => css`
        ${ringStyles};
        stroke: ${theme.type === 'dark' ? '#fff' : '#000'};
      `}
      {...rest}
    >
      <circle
        cx="50"
        cy="50"
        r="39.636"
        css={(theme: AppTheme) => css`
          fill: none;
          stroke-opacity: 0.5;
          stroke-width: 20;
        `}
      />
      <circle cx="50" cy="10.364" r="9.744" />
    </svg>
  );
}

let rotate = keyframes`
100% {
	transform: rotate(360deg);
}
`;

let ringStyles = css`
  transform-origin: center center;
  animation: ${rotate} 0.7s infinite;
`;

export default Spinner;
