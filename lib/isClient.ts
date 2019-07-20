/**
 * Determines if code is executed on the client.
 *
 */
function isClient() {
  return typeof window !== 'undefined';
}

export default isClient;
