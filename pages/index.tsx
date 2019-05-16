/** @jsx jsx */
import { jsx } from '@emotion/core';
import Image from '@self/components/Image';

const URL =
  'https://cdn.dribbble.com/users/3178178/screenshots/6487916/hunter-10_000-bc.jpg';

function IndexPage() {
  return (
    <div>
      <h1>Index Page</h1>
      <Image src={URL} />
    </div>
  );
}

export default IndexPage;
