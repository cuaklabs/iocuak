import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../common/utils/getBaseType');
jest.mock('./injectFrom');

import { Newable } from '@cuaklabs/iocuak-common';

import { injectFromBase } from '../../classMetadata/decorators/injectFromBase';
import { ClassMetadataExtensionApi } from '../../classMetadata/models/api/ClassMetadataExtensionApi';
import { getBaseType } from '../../common/utils/getBaseType';
import { BaseClassMetadataExtensionApi } from '../models/api/BaseClassMetadataExtensionApi';
import { injectFrom } from './injectFrom';

describe(injectFromBase.name, () => {
  describe('having baseClassMetadataExtensionApi', () => {
    let baseClassMetadataExtensionApiFixture: BaseClassMetadataExtensionApi;

    beforeAll(() => {
      baseClassMetadataExtensionApiFixture = {
        extendConstructorArguments: true,
        extendProperties: true,
      };
    });

    describe('when called, and getBaseType() returns a base type', () => {
      let baseTypeFixture: Newable;
      let typeFixture: Newable;
      let injectFromDecoratorMock: jest.Mock<ClassDecorator>;

      beforeAll(() => {
        baseTypeFixture = class {};

        (getBaseType as jest.Mock<typeof getBaseType>).mockReturnValueOnce(
          baseTypeFixture,
        );

        injectFromDecoratorMock = jest.fn<ClassDecorator>();

        (injectFrom as jest.Mock<typeof injectFrom>).mockReturnValueOnce(
          injectFromDecoratorMock as ClassDecorator,
        );

        @injectFromBase(baseClassMetadataExtensionApiFixture)
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
            ...baseClassMetadataExtensionApiFixture,
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
    let injectFromDecoratorMock: jest.Mock<ClassDecorator>;

    beforeAll(() => {
      baseTypeFixture = class {};

      (getBaseType as jest.Mock<typeof getBaseType>).mockReturnValueOnce(
        baseTypeFixture,
      );

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
