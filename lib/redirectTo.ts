import { PageContext } from './types';

function redirectTo(context: PageContext, path: string) {
  context.res!.writeHead(302, { Location: path });
  context.res!.end();
}

export default redirectTo;
