import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./injectBase');

import { Tag } from '@cuaklabs/iocuak-common';

import { ParameterOrPropertyDecorator } from '../../common/models/ParameterOrPropertyDecorator';
import { injectBase } from './injectBase';
import { injectTag } from './injectTag';

describe(injectTag.name, () => {
  let tagFixture: Tag;

  beforeAll(() => {
    tagFixture = Symbol();
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

      result = injectTag(tagFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call injectBase', () => {
      expect(injectBase).toHaveBeenCalledTimes(1);
      expect(injectBase).toHaveBeenCalledWith(tagFixture, expect.any(Function));
    });

    it('should return a decorator', () => {
      expect(result).toBe(decoratorFixture);
    });
  });
});
