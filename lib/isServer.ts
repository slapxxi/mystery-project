import { Page } from "./types";

function isServer(context: Page.Context) {
  return !!context.req;
}

export default isServer;