import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('../../binding/utils/domain/getBindingOrThrow');

import { Newable } from '@cuaklabs/iocuak-common';

import { TypeBindingFixtures } from '../../binding/fixtures/domain/TypeBindingFixtures';
import { TypeBinding } from '../../binding/models/domain/TypeBinding';
import { BindingService } from '../../binding/services/domain/BindingService';
import { getBindingOrThrow } from '../../binding/utils/domain/getBindingOrThrow';
import { bind } from '../../container/utils/bind';

describe(bind.name, () => {
  let typeFixture: Newable;
  let containerBindingServiceMock: jestMock.Mocked<BindingService>;

  beforeAll(() => {
    typeFixture = class {};

    containerBindingServiceMock = {
      set: jest.fn(),
    } as Partial<
      jestMock.Mocked<BindingService>
    > as jestMock.Mocked<BindingService>;
  });

  describe('when called', () => {
    let bindingFixture: TypeBinding;

    beforeAll(() => {
      bindingFixture = TypeBindingFixtures.any;

      (
        getBindingOrThrow as jestMock.Mock<typeof getBindingOrThrow>
      ).mockReturnValueOnce(bindingFixture);

      bind(typeFixture, containerBindingServiceMock);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getBindingOrThrow()', () => {
      expect(getBindingOrThrow).toHaveBeenCalledTimes(1);
      expect(getBindingOrThrow).toHaveBeenCalledWith(typeFixture);
    });

    it('should call containerService.binding.set()', () => {
      expect(containerBindingServiceMock.set).toHaveBeenCalledTimes(1);
      expect(containerBindingServiceMock.set).toHaveBeenCalledWith(
        bindingFixture,
      );
    });
  });
});
