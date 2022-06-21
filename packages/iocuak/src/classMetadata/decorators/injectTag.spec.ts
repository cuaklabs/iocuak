import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

jest.mock('./injectBase');

import { BindingTag } from '../../binding/models/domain/BindingTag';
import { injectBase } from './injectBase';
import { injectTag } from './injectTag';

describe(injectTag.name, () => {
  let bindingTagFixture: BindingTag;

  beforeAll(() => {
    bindingTagFixture = Symbol();
  });

  describe('when called', () => {
    let decoratorFixture: ParameterDecorator & PropertyDecorator;

    let result: unknown;

    beforeAll(() => {
      decoratorFixture = {
        _type: Symbol(),
      } as unknown as ParameterDecorator & PropertyDecorator;

      (injectBase as jestMock.Mock<typeof injectBase>).mockReturnValueOnce(
        decoratorFixture,
      );

      result = injectTag(bindingTagFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call injectBase', () => {
      expect(injectBase).toHaveBeenCalledTimes(1);
      expect(injectBase).toHaveBeenCalledWith(
        bindingTagFixture,
        expect.any(Function),
      );
    });

    it('should return a decorator', () => {
      expect(result).toBe(decoratorFixture);
    });
  });
});
