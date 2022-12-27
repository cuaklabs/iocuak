import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('@cuaklabs/iocuak-core');

import { Newable } from '@cuaklabs/iocuak-common';
import { BindingService, getBindingOrThrow } from '@cuaklabs/iocuak-core';
import {
  BindingScope,
  BindOptions,
  TypeBinding,
} from '@cuaklabs/iocuak-models';

import { BindOptionsFixtures } from '../../fixtures/domain/BindOptionsFixtures';
import { TypeBindingFixtures } from '../../fixtures/domain/TypeBindingFixtures';
import { bind } from './bind';

describe(bind.name, () => {
  let typeFixture: Newable;
  let containerBindingServiceMock: jest.Mocked<BindingService>;

  beforeAll(() => {
    typeFixture = class {};

    containerBindingServiceMock = {
      set: jest.fn(),
    } as Partial<jest.Mocked<BindingService>> as jest.Mocked<BindingService>;
  });

  describe('having a BindOptions with defined scope', () => {
    let bindOptionsFixture: BindOptions;

    beforeAll(() => {
      bindOptionsFixture = BindOptionsFixtures.withScopeDefined;
    });

    describe('when called', () => {
      let bindingFixture: TypeBinding;

      beforeAll(() => {
        bindingFixture = TypeBindingFixtures.any;

        (
          getBindingOrThrow as jest.Mock<typeof getBindingOrThrow>
        ).mockReturnValueOnce(bindingFixture);

        bind(typeFixture, bindOptionsFixture, containerBindingServiceMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call getBindingOrThrow()', () => {
        expect(getBindingOrThrow).toHaveBeenCalledTimes(1);
        expect(getBindingOrThrow).toHaveBeenCalledWith(typeFixture);
      });

      it('should call containerService.binding.set()', () => {
        const expectedBindingFixture: TypeBinding = {
          ...bindingFixture,
          scope: bindOptionsFixture.scope as BindingScope,
        };

        expect(containerBindingServiceMock.set).toHaveBeenCalledTimes(1);
        expect(containerBindingServiceMock.set).toHaveBeenCalledWith(
          expectedBindingFixture,
        );
      });
    });
  });

  describe('having a BindOptions with undefined scope', () => {
    let bindOptionsFixture: BindOptions;

    beforeAll(() => {
      bindOptionsFixture = BindOptionsFixtures.withScopeUndefined;
    });

    describe('when called', () => {
      let bindingFixture: TypeBinding;

      beforeAll(() => {
        bindingFixture = TypeBindingFixtures.any;

        (
          getBindingOrThrow as jest.Mock<typeof getBindingOrThrow>
        ).mockReturnValueOnce(bindingFixture);

        bind(typeFixture, bindOptionsFixture, containerBindingServiceMock);
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
});
