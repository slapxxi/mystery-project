import IndexPage from '@self/pages/index';
import React from 'react';
import { render } from 'react-testing-library';

it('renders', () => {
  let { getByTestId } = render(<IndexPage />);
  let pageTitle = getByTestId('title');

  expect(pageTitle.textContent).toEqual('Index');
});
