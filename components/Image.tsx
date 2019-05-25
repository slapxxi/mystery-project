/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ComponentProps } from 'react';
import styles from './Image.styles';

type SourceType = 'webp' | 'jpg' | 'png';

interface Props extends ComponentProps<'img'> {}

function Image(props: Props) {
  let { src, ...rest } = props;

  return (
    <picture>
      {src && generateSources(src)}
      <img css={styles.image} src={src} {...rest} />
    </picture>
  );
}

function generateSources(src: string) {
  return (['webp', 'jpg', 'png'] as SourceType[]).map((sourceType) =>
    generateSource(sourceType, src)
  );
}

function generateSource(type: SourceType, src: string) {
  return (
    <source
      key={`${src}-${type}`}
      data-testid={`source-${type}`}
      type={`image/${type === 'jpg' ? 'jpeg' : type}`}
      srcSet={generateSrcSet(type, src)}
    />
  );
}

function generateSrcSet(type: SourceType, src: string) {
  let { host, name } = parseURL(src);
  return [
    `${createURL(host, `${name}-1x`, type)} 320w`,
    `${createURL(host, `${name}-2x`, type)} 640w`,
    `${createURL(host, `${name}-3x`, type)} 960w`,
    `${createURL(host, `${name}-4x`, type)} 1280w`,
  ].join(', ');
}

function parseURL(url: string) {
  let parts = url.split('/');
  let host = parts.slice(0, -1).join('/');
  let [name, ext] = parts.slice(-1)[0].split('.');

  return { host, name, ext };
}

function createURL(host: string, name: string, ext: string) {
  return `${host}/${name}.${ext}`;
}

export default Image;
