/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import { AuthUser } from '@self/lib/types';
import ActiveLink from './ActiveLink';

interface Props {
  user: AuthUser;
  size?: string;
}

function Avatar(props: Props) {
  let { user, size = '30px', ...rest } = props;

  return (
    <ActiveLink href="/profile" passHref>
      <a
        css={css`
          display: block;
          border-radius: 50%;
          width: ${size};
          height: ${size};
          overflow: hidden;
        `}
        {...rest}
      >
        {user.picture ? (
          <img
            src={user.picture}
            alt="User photo"
            css={css`
              width: ${size};
              height: ${size};
            `}
          />
        ) : (
          <svg width="100%" height="100%" viewBox="0 0 10 10" fill="pink">
            <circle cx="5" cy="5" r="10"></circle>
          </svg>
        )}
      </a>
    </ActiveLink>
  );
}

export default Avatar;
