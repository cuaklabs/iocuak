import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./createInstanceFromBinding');
jest.mock('../../binding/actions/getBinding');

import { ServiceId } from '@cuaklabs/iocuak-common';
import { Binding } from '@cuaklabs/iocuak-models';

import { getBinding } from '../../binding/actions/getBinding';
import { ValueBindingFixtures } from '../../binding/fixtures/ValueBindingFixtures';
import { CreateInstanceTaskContext } from '../models/CreateInstanceTaskContext';
import { createInstance } from './createInstance';
import { createInstanceFromBinding } from './createInstanceFromBinding';

describe(createInstance.name, () => {
  let serviceIdFixture: ServiceId;
  let taskContextFixture: CreateInstanceTaskContext;

  beforeAll(() => {
    serviceIdFixture = Symbol();
    taskContextFixture = {
      _type: Symbol(),
    } as unknown as CreateInstanceTaskContext;
  });

  describe('when called', () => {
    let bindingFixture: Binding;
    let instanceFixture: unknown;

    let result: unknown;

    beforeAll(() => {
      bindingFixture = ValueBindingFixtures.any;
      instanceFixture = Symbol();

      (getBinding as jest.Mock<typeof getBinding>).mockReturnValueOnce(
        bindingFixture,
      );

      (
        createInstanceFromBinding as jest.Mock<typeof createInstanceFromBinding>
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
