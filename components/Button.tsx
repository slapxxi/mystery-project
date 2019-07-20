/** @jsx jsx */
import { css, jsx } from '@emotion/core';

interface Props extends React.ComponentProps<'button'> {}

function Button(props: Props) {
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
