import IndexPage from '@self/pages/index';
import React from 'react';
import { render } from 'react-testing-library';

it('renders', () => {
  let { container } = render(<IndexPage />);
  expect(container.firstChild).toMatchSnapshot();
});
