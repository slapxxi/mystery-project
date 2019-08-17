import { ServerRequest } from '../types';

/**
 * Determines if user is authenticated
 *
 * @param req Server request object
 */
function userAuthenticated(req?: ServerRequest): req is ServerRequest {
  return !!(req && req.session && req.session.decodedToken);
}

export default userAuthenticated;
