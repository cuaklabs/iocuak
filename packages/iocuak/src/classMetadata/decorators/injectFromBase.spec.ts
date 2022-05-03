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
      (getBaseType as jest.Mock<Newable | undefined>).mockReturnValueOnce(
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
    let injectFromDecoratorMock: jest.Mock<void | Function, [Function]>;

    beforeAll(() => {
      baseTypeFixture = class {};

      (getBaseType as jest.Mock<Newable | undefined>).mockReturnValueOnce(
        baseTypeFixture,
      );

      // eslint-disable-next-line @typescript-eslint/ban-types
      injectFromDecoratorMock = jest.fn<void | Function, [Function]>();

      (injectFrom as jest.Mock<ClassDecorator>).mockReturnValueOnce(
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
      expect(injectFrom).toHaveBeenCalledTimes(1);
      expect(injectFrom).toHaveBeenCalledWith<[ClassMetadataExtensionApi]>({
        type: baseTypeFixture,
      });
    });

    it('should call injectFromDecoratorMock()', () => {
      expect(injectFromDecoratorMock).toHaveBeenCalledTimes(1);
      expect(injectFromDecoratorMock).toHaveBeenCalledWith(typeFixture);
    });
  });
});
