import { AuthUser, Maybe, PageContext } from './types';

function getUser(context: PageContext): Maybe<AuthUser> {
  if (context.req && context.req.session) {
    return context.req.session.decodedToken;
  }
}

export default getUser;
