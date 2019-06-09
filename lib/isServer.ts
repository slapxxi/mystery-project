import { PageContext } from './types';

function isServer(context: PageContext) {
  return !!context.req;
}

export default isServer;
