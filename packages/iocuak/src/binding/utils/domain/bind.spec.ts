import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('@cuaklabs/iocuak-core');

import { Newable } from '@cuaklabs/iocuak-common';
import { BindingService, getBindingOrThrow } from '@cuaklabs/iocuak-core';
import { TypeBinding } from '@cuaklabs/iocuak-models';

import { TypeBindingFixtures } from '../../fixtures/domain/TypeBindingFixtures';
import { bind } from './bind';

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
