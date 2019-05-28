/** @jsx jsx */
import { jsx } from '@emotion/core';
import { ComponentProps } from 'react';
import Url from 'url-parse';
import styles from './Image.styles';

type ImageType = 'webp' | 'jpg' | 'png';

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
  return (['webp', 'jpg', 'png'] as ImageType[]).map((sourceType) => (
    <Source type={sourceType} src={src} key={`${src}-${sourceType}`} />
  ));
}

function Source(props: { type: ImageType; src: string }) {
  let { type, src } = props;

  return (
    <source
      data-testid={`source-${type}`}
      type={`image/${type === 'jpg' ? 'jpeg' : type}`}
      srcSet={generateSrcSet(type, src)}
    />
  );
}

function generateSrcSet(imageType: ImageType, src: string) {
  let url = new Url(src, {}, true);

  return [
    `${urlToSrcsetProperty(url, `$1-1x.${imageType}`)} 320w`,
    `${urlToSrcsetProperty(url, `$1-2x.${imageType}`)} 640w`,
    `${urlToSrcsetProperty(url, `$1-3x.${imageType}`)} 960w`,
    `${urlToSrcsetProperty(url, `$1-4x.${imageType}`)} 1280w`,
  ].join(', ');
}

function urlToSrcsetProperty(url: Url, name: string) {
  let result = new Url(url.toString(), {});
  result.set('pathname', url.pathname.replace(/(\w+)\.\S*/, name));

  return result.toString();
}

export default Image;
