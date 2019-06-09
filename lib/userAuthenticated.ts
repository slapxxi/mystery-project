import { PageContext } from './types';

function userAuthenticated(context: PageContext) {
  return context.req && context.req.session && context.req.session.decodedToken;
}

export default userAuthenticated;
