import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./injectBase');

import { ServiceId } from '@cuaklabs/iocuak-common';

import { ParameterOrPropertyDecorator } from '../../common/models/ParameterOrPropertyDecorator';
import { inject } from './inject';
import { injectBase } from './injectBase';

describe(inject.name, () => {
  let serviceIdFixture: ServiceId;

  beforeAll(() => {
    serviceIdFixture = Symbol();
  });

  describe('when called', () => {
    let decoratorFixture: ParameterOrPropertyDecorator;

    let result: unknown;

    beforeAll(() => {
      decoratorFixture = {
        _type: Symbol(),
      } as unknown as ParameterOrPropertyDecorator;

      (injectBase as jest.Mock<typeof injectBase>).mockReturnValueOnce(
        decoratorFixture,
      );

      result = inject(serviceIdFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call injectBase', () => {
      expect(injectBase).toHaveBeenCalledTimes(1);
      expect(injectBase).toHaveBeenCalledWith(
        serviceIdFixture,
        expect.any(Function),
      );
    });

    it('should return a decorator', () => {
      expect(result).toBe(decoratorFixture);
    });
  });
});
