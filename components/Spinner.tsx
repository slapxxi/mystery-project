/** @jsx jsx */
import { css, jsx, keyframes } from '@emotion/core';

function Spinner() {
  return (
    <svg width="20" height="20" stroke="#000" viewBox="0 0 100 100" css={ringStyles}>
      <circle
        cx="50"
        cy="50"
        r="39.636"
        style={{ fill: 'none', stroke: '#000', strokeOpacity: 0.501961, strokeWidth: 20 }}
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
