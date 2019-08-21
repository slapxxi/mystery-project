import { IndexPage } from '@self/pages/index';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { render } from 'react-testing-library';

let translation = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '..', 'static', 'locales', 'en', 'common.json'),
    'utf-8'
  )
);

let translate = jest.fn((key) => translation[key]);

it('renders', () => {
  // @ts-ignore
  let { getByTestId } = render(<IndexPage t={translate} user={null} />);
  let pageTitle = getByTestId('title');

  expect(pageTitle.textContent).toEqual('Home');
});
