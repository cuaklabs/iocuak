import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('./createInstanceFromBinding');
jest.mock('./getBinding');

import { ServiceId } from '@cuaklabs/iocuak-common';
import { Binding } from '@cuaklabs/iocuak-models';

import { ValueBindingFixtures } from '../../../binding/fixtures/domain/ValueBindingFixtures';
import { TaskContext } from '../../models/domain/TaskContext';
import { createInstance } from './createInstance';
import { createInstanceFromBinding } from './createInstanceFromBinding';
import { getBinding } from './getBinding';

describe(createInstance.name, () => {
  let serviceIdFixture: ServiceId;
  let taskContextFixture: TaskContext;

  beforeAll(() => {
    serviceIdFixture = Symbol();
    taskContextFixture = { _type: Symbol() } as unknown as TaskContext;
  });

  describe('when called', () => {
    let bindingFixture: Binding;
    let instanceFixture: unknown;

    let result: unknown;

    beforeAll(() => {
      bindingFixture = ValueBindingFixtures.any;
      instanceFixture = Symbol();

      (getBinding as jestMock.Mock<typeof getBinding>).mockReturnValueOnce(
        bindingFixture,
      );

      (
        createInstanceFromBinding as jestMock.Mock<
          typeof createInstanceFromBinding
        >
      ).mockReturnValueOnce(instanceFixture);

      result = createInstance(serviceIdFixture, taskContextFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call getBinding()', () => {
      expect(getBinding).toHaveBeenCalledTimes(1);
      expect(getBinding).toHaveBeenCalledWith(
        serviceIdFixture,
        taskContextFixture,
      );
    });

    it('should call createInstanceFromBinding()', () => {
      expect(createInstanceFromBinding).toHaveBeenCalledTimes(1);
      expect(createInstanceFromBinding).toHaveBeenCalledWith(
        bindingFixture,
        taskContextFixture,
      );
    });

    it('should return an instance', () => {
      expect(result).toBe(instanceFixture);
    });
  });
});
