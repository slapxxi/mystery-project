/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import uuid from 'uuid';

interface Props extends React.ComponentProps<'input'> {}

function ButtonToggle(props: Props) {
  let { checked, children, onChange } = props;
  let id = uuid.v4();

  return (
    <label
      htmlFor={id}
      css={css`
        padding: 6px;
        border: 1px solid ${checked ? 'hotpink' : 'grey'};
        border-radius: 4px;
        background: ${checked ? 'hotpink' : 'none'};
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
        color: ${checked ? 'white' : 'grey'};

        &:hover {
          border-color: grey;
          color: ${checked ? 'white' : 'grey'};
          cursor: pointer;
        }

        &:active {
          transform: scale(0.8);
        }
      `}
    >
      {children}
      <input
        id={id}
        checked={checked}
        type="checkbox"
        css={css`
          display: none;
        `}
        onChange={onChange}
      />
    </label>
  );
}

export default ButtonToggle;
