import { ApiRequest, ApiResponse } from '@self/lib/types';

function handler(req: ApiRequest, res: ApiResponse) {
  if (req.session) {
    return res.json({ status: req.session.decodedToken });
  }
  return res.json({ status: 'error', error: 'session not found' });
}

export default handler;
