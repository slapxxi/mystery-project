import { PageContext } from '../types';

/**
 * Determines if user is authenticated
 *
 * @param req Server request object
 */
function userAuthenticated(context: PageContext) {
  return !!(context.req && context.req.session && context.req.session.decodedToken);
}

export default userAuthenticated;
