/** @jsx jsx */
import { css, jsx } from '@emotion/core';

interface Props extends React.ComponentProps<'button'> {}

function Button(props: Props) {
  return (
    <button
      css={css`
        padding: 6px;
        border: 1px solid lightgrey;
        border-radius: 4px;
        background: none;
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
        color: grey;
        vertical-align: middle;

        &:hover {
          border-color: grey;
          color: black;
        }
      `}
      {...props}
    />
  );
}

export default Button;
