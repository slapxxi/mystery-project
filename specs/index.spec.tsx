import '@self/i18n';
import IndexPage from '@self/pages/index';
import fs from 'fs';
import path from 'path';
import React from 'react';
import { render } from 'react-testing-library';

jest.mock('@self/i18n');

let translation = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '..', 'static', 'locales', 'en', 'common.json'),
    'utf-8'
  )
);

let translate = jest.fn((key) => translation[key]);

it('renders', () => {
  let { getByTestId } = render(<IndexPage t={translate} />);
  let pageTitle = getByTestId('title');

  expect(pageTitle.textContent).toEqual('Main');
});
