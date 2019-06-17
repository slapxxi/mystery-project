import { ServerRequest } from '../types';

/**
 * Determines if user is authenticated based on request data
 */
function userAuthenticated(req?: ServerRequest) {
  return !!(req && req.session && req.session.decodedToken);
}

export default userAuthenticated;
