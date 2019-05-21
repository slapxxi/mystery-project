/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ComponentProps } from 'react';
import styles from './Image.styles';

interface Props extends ComponentProps<'img'> {}

function Image(props: Props) {
  let { src, ...rest } = props;

  return <img css={styles.image} src={src} {...rest} />;
}

export default Image;
