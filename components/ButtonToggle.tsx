/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import uuid from 'uuid';

interface Props extends React.ComponentProps<'input'> {}

function ButtonToggle(props: Props) {
  let { disabled, checked, children, onChange } = props;
  let id = uuid.v4();

  return (
    <label
      htmlFor={id}
      css={css`
        display: flex;
        align-items: center;
        padding: 6px;
        border: 1px solid ${disabled ? 'black' : checked ? 'hotpink' : 'grey'};
        border-radius: 4px;
        background: ${disabled ? 'black' : checked ? 'hotpink' : 'white'};
        box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
        color: ${checked ? 'white' : 'grey'};

        &:hover {
          border-color: ${disabled ? 'black' : checked ? 'pink' : 'lightgrey'};
          color: ${disabled ? 'grey' : checked ? 'white' : 'grey'};
          cursor: pointer;
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
        disabled={disabled}
      />
    </label>
  );
}

export default ButtonToggle;
