import crypto from 'node:crypto';

const SHA_256_HASH_ALGORITH: string = 'sha256';
const HEX_ENCODING: crypto.BinaryToTextEncoding = 'hex';

export function hashString(value: string): string {
  const hashFunction: crypto.Hash = crypto.createHash(SHA_256_HASH_ALGORITH);

  hashFunction.update(value);

  return hashFunction.digest(HEX_ENCODING);
}
