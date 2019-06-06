import { Page } from './types';

function redirectTo(context: Page.Context, path: string) {
  context.res!.writeHead(302, { Location: path });
  context.res!.end();
}

export default redirectTo;
