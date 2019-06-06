import { Page } from './types';

function userAuthenticated(context: Page.Context) {
  return context.req && context.req.session && context.req.session.decodedToken;
}

export default userAuthenticated;
