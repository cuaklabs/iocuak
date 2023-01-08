import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./getBindingOrThrow');

import { Newable } from '@cuaklabs/iocuak-common';
import {
  BindingScope,
  BindOptions,
  TypeBinding,
} from '@cuaklabs/iocuak-models';

import { BindOptionsFixtures } from '../fixtures/BindOptionsFixtures';
import { TypeBindingFixtures } from '../fixtures/TypeBindingFixtures';
import { BindingService } from '../services/BindingService';
import { bind } from './bind';
import { getBindingOrThrow } from './getBindingOrThrow';

describe(bind.name, () => {
  let typeFixture: Newable;
  let bindingServiceMock: jest.Mocked<BindingService>;

  beforeAll(() => {
    typeFixture = class {};

    bindingServiceMock = {
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

        bind(typeFixture, bindOptionsFixture, bindingServiceMock);
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

        expect(bindingServiceMock.set).toHaveBeenCalledTimes(1);
        expect(bindingServiceMock.set).toHaveBeenCalledWith(
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

        bind(typeFixture, bindOptionsFixture, bindingServiceMock);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call getBindingOrThrow()', () => {
        expect(getBindingOrThrow).toHaveBeenCalledTimes(1);
        expect(getBindingOrThrow).toHaveBeenCalledWith(typeFixture);
      });

      it('should call containerService.binding.set()', () => {
        expect(bindingServiceMock.set).toHaveBeenCalledTimes(1);
        expect(bindingServiceMock.set).toHaveBeenCalledWith(bindingFixture);
      });
    });
  });
});
