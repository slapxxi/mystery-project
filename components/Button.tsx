/** @jsx jsx */
import { css, jsx } from '@emotion/core';

function Button(props) {
  return (
    <button
      css={css`
        border: 0;
        background: none;
      `}
      {...props}
    />
  );
}

export default Button;
