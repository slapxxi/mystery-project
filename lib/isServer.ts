import { PageContext } from './types';

/**
 * Determines if code is executed on the server.
 *
 * @param context Next.js page context
 */
function isServer(context: PageContext) {
  return !!context.req;
}

export default isServer;
