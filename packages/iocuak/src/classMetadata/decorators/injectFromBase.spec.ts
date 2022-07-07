import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('../../utils/getBaseType');
jest.mock('./injectFrom');

import { injectFrom } from '../../classMetadata/decorators/injectFrom';
import { injectFromBase } from '../../classMetadata/decorators/injectFromBase';
import { ClassMetadataExtensionApi } from '../../classMetadata/models/api/ClassMetadataExtensionApi';
import { Newable } from '../../common/models/domain/Newable';
import { getBaseType } from '../../utils/getBaseType';

describe(injectFromBase.name, () => {
  describe('when called, and getBaseType() returns undefined', () => {
    let typeFixture: Newable;

    beforeAll(() => {
      (getBaseType as jestMock.Mock<typeof getBaseType>).mockReturnValueOnce(
        undefined,
      );

      @injectFromBase()
      class TypeFixture {}

      typeFixture = TypeFixture;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getBaseType()', () => {
      expect(getBaseType).toHaveBeenCalledTimes(1);
      expect(getBaseType).toHaveBeenCalledWith(typeFixture);
    });

    it('should not call injectFrom()', () => {
      expect(injectFrom).not.toHaveBeenCalled();
    });
  });

  describe('when called, and getBaseType() returns a base type', () => {
    let baseTypeFixture: Newable;
    let typeFixture: Newable;
    // eslint-disable-next-line @typescript-eslint/ban-types
    let injectFromDecoratorMock: jestMock.Mock<ClassDecorator>;

    beforeAll(() => {
      baseTypeFixture = class {};

      (getBaseType as jestMock.Mock<typeof getBaseType>).mockReturnValueOnce(
        baseTypeFixture,
      );

      // eslint-disable-next-line @typescript-eslint/ban-types
      injectFromDecoratorMock = jest.fn<ClassDecorator>();

      (injectFrom as jestMock.Mock<typeof injectFrom>).mockReturnValueOnce(
        injectFromDecoratorMock as ClassDecorator,
      );

      @injectFromBase()
      class TypeFixture {}

      typeFixture = TypeFixture;
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getBaseType()', () => {
      expect(getBaseType).toHaveBeenCalledTimes(1);
      expect(getBaseType).toHaveBeenCalledWith(typeFixture);
    });

    it('should call injectFrom()', () => {
      const expected: [ClassMetadataExtensionApi] = [
        {
          type: baseTypeFixture,
        },
      ];

      expect(injectFrom).toHaveBeenCalledTimes(1);
      expect(injectFrom).toHaveBeenCalledWith(...expected);
    });

    it('should call injectFromDecoratorMock()', () => {
      expect(injectFromDecoratorMock).toHaveBeenCalledTimes(1);
      expect(injectFromDecoratorMock).toHaveBeenCalledWith(typeFixture);
    });
  });
});
