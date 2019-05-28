import React from 'react';
import { render } from 'react-testing-library';
import Image from './Image';

it('orders source elements by efficiency', async () => {
  let { findAllByTestId } = render(<Image src="/test/image.jpg" />);
  let sourceElements = (await findAllByTestId(/^source/)) as HTMLSourceElement[];

  expect(sourceElements.length).toEqual(3);
  expect(sourceElements[0].type).toEqual('image/webp');
  expect(sourceElements[1].type).toEqual('image/jpeg');
  expect(sourceElements[2].type).toEqual('image/png');
});

test.each(['webp', 'jpg', 'png'])('appends source for %s format', async (type) => {
  let { findByTestId } = render(<Image src="/test/image.jpg?w=300" />);
  let source = (await findByTestId(`source-${type}`)) as HTMLSourceElement;
  let srcset = source.srcset.split(',').map((i) => i.trim());

  // JPEG MIME type doesn't match file extension
  expect(source.type).toEqual(`image/${type === 'jpg' ? 'jpeg' : type}`);
  expect(srcset[0]).toEqual(`/test/image-1x.${type}?w=300 320w`);
  expect(srcset[1]).toEqual(`/test/image-2x.${type}?w=300 640w`);
  expect(srcset[2]).toEqual(`/test/image-3x.${type}?w=300 960w`);
  expect(srcset[3]).toEqual(`/test/image-4x.${type}?w=300 1280w`);
});
