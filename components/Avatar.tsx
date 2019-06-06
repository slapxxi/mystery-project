/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { Auth } from '@self/lib/types';
import ActiveLink from './ActiveLink';

interface Props {
  user: Auth.User;
}

function Avatar(props: Props) {
  let { user } = props;

  return (
    <ActiveLink href="/profile" passHref>
      <a
        css={css`
          display: block;
          border-radius: 50%;
          width: 30px;
          height: 30px;
          overflow: hidden;
          filter: grayscale(1) sepia(10%);

          :hover,
          &.active {
            filter: none;
          }
        `}
      >
        <img
          src={user.picture}
          alt="User photo"
          css={css`
            width: 30px;
            height: 30px;
          `}
        />
      </a>
    </ActiveLink>
  );
}

export default Avatar;
