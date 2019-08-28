/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { AppTheme } from '@self/lib/types';
import { useState } from 'react';

interface Props {
  assets: string[];
}

function Carousel(props: Props) {
  let { assets } = props;
  let [selected, setSelected] = useState(0);

  return (
    <div>
      <img src={assets[selected]} alt="" css={imageStyles} />
      <ul css={listStyles}>
        {assets.map((asset, index) => (
          <li css={listItemStyles} key={`${asset}+${index}`}>
            <input
              id={`image-${index}`}
              type="radio"
              name="image"
              defaultChecked={selected === index}
              onChange={() => setSelected(index)}
              css={inputStyles}
            />
            <label htmlFor={`image-${index}`} css={labelStyles}>
              <img src={asset} alt="Image" key={index} css={imageStyles} />
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

const listStyles = css`
  display: flex;
  padding: 0;
  margin: 0;
  list-style: none;
`;

const listItemStyles = css`
  flex: 1 auto;
`;

const imageStyles = css`
  width: 100%;
`;

const inputStyles = (theme: AppTheme) => css`
  display: none;

  &[checked] + label {
    border-color: ${theme.colors.textEm};
  }
`;

const labelStyles = css`
  display: inline-block;
  line-height: 0;
  border: 2px solid transparent;
  border-radius: 4px;
  overflow: hidden;
`;

export default Carousel;
