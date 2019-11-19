/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { ComponentProps } from 'react';

interface Props extends ComponentProps<'img'> {
  width: number;
  height: number;
}

function ImageWithAspectRatio(props: Props) {
  let { width, height, ...rest } = props;
  let ratio = (height / width) * 100;

  return (
    <div css={containerStyles(ratio)}>
      <img css={imageStyles} {...rest} />
    </div>
  );
}

export const containerStyles = (ratio: number) => css`
  position: relative;
  overflow: hidden;
  padding-top: ${ratio}%;
  height: 0;
`;

export const imageStyles = css`
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
`;

export default ImageWithAspectRatio;
