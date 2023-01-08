import { beforeAll, describe, expect, it } from '@jest/globals';

import { Newable } from '../models/Newable';
import { ServiceId } from '../models/ServiceId';
import { stringifyServiceId } from './stringifyServiceId';

describe(stringifyServiceId.name, () => {
  describe('having a string', () => {
    let serviceIdFixture: string;
    let result: unknown;

    beforeAll(() => {
      serviceIdFixture = 'service-id';

      result = stringifyServiceId(serviceIdFixture);
    });

    it('should return a string', () => {
      expect(result).toBe(serviceIdFixture);
    });
  });

  describe('having a symbol', () => {
    let serviceIdFixture: symbol;
    let result: unknown;

    beforeAll(() => {
      serviceIdFixture = Symbol('service-id');

      result = stringifyServiceId(serviceIdFixture);
    });

    it('should return a string', () => {
      expect(result).toBe('Symbol(service-id)');
    });
  });

  describe('having a function', () => {
    let serviceIdFixture: Newable;
    let result: unknown;

    beforeAll(() => {
      serviceIdFixture = class Foo {};

      result = stringifyServiceId(serviceIdFixture);
    });

    it('should return a string', () => {
      expect(result).toBe(serviceIdFixture.name);
    });
  });

  describe('having something else', () => {
    let serviceIdFixture: number;
    let result: unknown;

    beforeAll(() => {
      serviceIdFixture = 3;

      try {
        stringifyServiceId(serviceIdFixture as unknown as ServiceId);
      } catch (err: unknown) {
        result = err;
      }
    });

    it('should return a string', () => {
      const expectedError: Partial<Error> = {
        message: 'Unexpected number service id type',
      };

      expect(result).toBeInstanceOf(Error);
      expect(result).toStrictEqual(expect.objectContaining(expectedError));
    });
  });
});
