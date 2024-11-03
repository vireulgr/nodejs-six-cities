import * as crypto from 'node:crypto';

export function createSHA256(data: string, salt: string) {
  const hmac = crypto.createHmac('sha256', salt);
  return hmac.update(data).digest('hex');
}
