/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import '@self/styles/normalize.css';

function IndexPage() {
  return (
    <div
      css={css`
        width: 960px;
        margin: 0 auto;
      `}
    >
      <h1>Index Page</h1>
    </div>
  );
}

export default IndexPage;
