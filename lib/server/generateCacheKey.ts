import { ServerRequest } from '../types';

/**
 * Generates cache key based on request data
 */
function generateCacheKey(request: ServerRequest) {
  if (request.language) {
    return `${request.url}:${request.language}`;
  }

  return request.url;
}

export default generateCacheKey;
