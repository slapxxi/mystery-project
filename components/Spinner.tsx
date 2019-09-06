/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core';

function Spinner() {
  return (
    <svg width="20" height="20" stroke="#000" viewBox="0 0 38 38" css={ringStyles}>
      <g strokeWidth="2" fill="none" fillRule="evenodd" transform="translate(1 1)">
        <circle strokeOpacity=".5" cx="18" cy="18" r="18" />
        <path d="M36 18c0-9.94-8.06-18-18-18" />
      </g>
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
