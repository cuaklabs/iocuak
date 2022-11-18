import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/utils/getBaseType');
jest.mock('./injectFrom');

import { Newable } from '@cuaklabs/iocuak-common';

import { injectFromBase } from '../../classMetadata/decorators/injectFromBase';
import { ClassMetadataExtensionApi } from '../../classMetadata/models/api/ClassMetadataExtensionApi';
import { getBaseType } from '../../common/utils/getBaseType';
import { injectFrom } from './injectFrom';

describe(injectFromBase.name, () => {
  describe('when called, and getBaseType() returns undefined', () => {
    let typeFixture: Newable;

    beforeAll(() => {
      (getBaseType as jest.Mock<typeof getBaseType>).mockReturnValueOnce(
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
    let injectFromDecoratorMock: jest.Mock<ClassDecorator>;

    beforeAll(() => {
      baseTypeFixture = class {};

      (getBaseType as jest.Mock<typeof getBaseType>).mockReturnValueOnce(
        baseTypeFixture,
      );

      // eslint-disable-next-line @typescript-eslint/ban-types
      injectFromDecoratorMock = jest.fn<ClassDecorator>();

      (injectFrom as jest.Mock<typeof injectFrom>).mockReturnValueOnce(
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
