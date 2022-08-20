import { beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

import { BindingService } from '@cuaklabs/iocuak-core';
import { ValueBinding } from '@cuaklabs/iocuak-models';

import { ValueBindingFixtures } from '../../fixtures/domain/ValueBindingFixtures';
import { bindToValue } from './bindToValue';

describe(bindToValue.name, () => {
  describe('when called', () => {
    let valueBindingFixture: ValueBinding;
    let containerBindingServiceMock: jestMock.Mocked<BindingService>;

    beforeAll(() => {
      valueBindingFixture = ValueBindingFixtures.any;
      containerBindingServiceMock = {
        set: jest.fn(),
      } as Partial<
        jestMock.Mocked<BindingService>
      > as jestMock.Mocked<BindingService>;

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
