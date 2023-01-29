import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('node:crypto');

// eslint-disable-next-line import/order
import crypto from 'node:crypto';

import { hashString } from './hashString';

describe(hashString.name, () => {
  let valueFixture: string;

  beforeAll(() => {
    valueFixture = 'value fixture';
  });

  describe('when called', () => {
    let hashMock: jest.Mocked<crypto.Hash>;
    let hashFixture: string;

    let result: unknown;

    beforeAll(() => {
      hashFixture = 'hash fixture';

      hashMock = {
        digest: jest.fn().mockReturnValueOnce(hashFixture),
        update: jest.fn(),
      } as unknown as jest.Mocked<crypto.Hash>;

      (
        crypto.createHash as jest.Mock<typeof crypto.createHash>
      ).mockReturnValueOnce(hashMock);

      result = hashString(valueFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call crypto.createHash()', () => {
      expect(crypto.createHash).toHaveBeenCalledTimes(1);
      expect(crypto.createHash).toHaveBeenCalledWith('sha256');
    });

    it('should call hash.update()', () => {
      expect(hashMock.update).toHaveBeenCalledTimes(1);
      expect(hashMock.update).toHaveBeenCalledWith(valueFixture);
    });

    it('should call hash.digest()', () => {
      expect(hashMock.digest).toHaveBeenCalledTimes(1);
      expect(hashMock.digest).toHaveBeenCalledWith('hex');
    });

    it('should return a string', () => {
      expect(result).toBe(hashFixture);
    });
  });
});
