import { ComponentProps } from 'react';

interface Props extends ComponentProps<'img'> {}

function Image(props: Props) {
  let { src, ...rest } = props;

  return <img src={src} {...rest} />;
}

export default Image;
