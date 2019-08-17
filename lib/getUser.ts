import { PageContext } from './types';

function getUser(context: PageContext) {
  return context.req && context.req.session && context.req.session.decodedToken;
}

export default getUser;
