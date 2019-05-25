/** @jsx jsx */
import { jsx } from '@emotion/core';
import Image from '@self/components/Image';

const URL = '/static/img/camping.jpg';

function IndexPage() {
  return (
    <div>
      <h1 data-testid="title">Index</h1>
      <Image src={URL} />
    </div>
  );
}

export default IndexPage;
