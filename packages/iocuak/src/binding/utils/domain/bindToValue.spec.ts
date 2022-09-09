import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

import { BindingService } from '@cuaklabs/iocuak-core';
import { ValueBinding } from '@cuaklabs/iocuak-models';

import { ValueBindingFixtures } from '../../fixtures/domain/ValueBindingFixtures';
import { bindToValue } from './bindToValue';

describe(bindToValue.name, () => {
  describe('when called', () => {
    let valueBindingFixture: ValueBinding;
    let containerBindingServiceMock: jest.Mocked<BindingService>;

    beforeAll(() => {
      valueBindingFixture = ValueBindingFixtures.any;
      containerBindingServiceMock = {
        set: jest.fn(),
      } as Partial<jest.Mocked<BindingService>> as jest.Mocked<BindingService>;

      bindToValue(
        valueBindingFixture.id,
        valueBindingFixture.tags,
        valueBindingFixture.value,
        containerBindingServiceMock,
      );
    });

    it('should call containerBindingService.set()', () => {
      expect(containerBindingServiceMock.set).toHaveBeenCalledTimes(1);
      expect(containerBindingServiceMock.set).toHaveBeenCalledWith(
        valueBindingFixture,
      );
    });
  });
});