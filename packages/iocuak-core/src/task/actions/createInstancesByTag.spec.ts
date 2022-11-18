import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('./getBinding');

import { Tag } from '@cuaklabs/iocuak-common';
import { Binding } from '@cuaklabs/iocuak-models';

import { ValueBindingFixtures } from '../../binding/fixtures/ValueBindingFixtures';
import { BindingService } from '../../binding/services/BindingService';
import { TaskContext } from '../models/TaskContext';
import { TaskContextActions } from '../models/TaskContextActions';
import { TaskContextServices } from '../models/TaskContextServices';
import { createInstancesByTag } from './createInstancesByTag';

describe(createInstancesByTag.name, () => {
  describe('when called', () => {
    let tagFixture: Tag;

    let bindingFixture: Binding;
    let instanceFixture: unknown;

    let createInstanceFromBindingMock: jest.Mock<
      (binding: Binding, context: TaskContext) => unknown
    >;
    let bindingServiceMock: jest.Mocked<BindingService>;

    let taskContextFixture: TaskContext;

    let result: unknown;

    beforeAll(() => {
      tagFixture = Symbol();

      bindingFixture = ValueBindingFixtures.any;
      instanceFixture = Symbol();

      createInstanceFromBindingMock = jest
        .fn()
        .mockReturnValueOnce(instanceFixture);

      bindingServiceMock = {
        getByTag: jest
          .fn<BindingService['getByTag']>()
          .mockReturnValueOnce([bindingFixture]),
      } as Partial<jest.Mocked<BindingService>> as jest.Mocked<BindingService>;

      taskContextFixture = {
        actions: {
          createInstanceFromBinding: createInstanceFromBindingMock,
        } as Partial<TaskContextActions> as TaskContextActions,
        services: {
          bindingService: bindingServiceMock,
        } as Partial<TaskContextServices> as TaskContextServices,
      } as Partial<TaskContext> as TaskContext;

      result = createInstancesByTag(tagFixture, taskContextFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call context.services.bindingService.getByTag()', () => {
      expect(bindingServiceMock.getByTag).toHaveBeenCalledTimes(1);
      expect(bindingServiceMock.getByTag).toHaveBeenCalledWith(
        tagFixture,
        true,
      );
    });

    it('should call context.actions.createInstanceFromBinding()', () => {
      expect(createInstanceFromBindingMock).toHaveBeenCalledTimes(1);
      expect(createInstanceFromBindingMock).toHaveBeenCalledWith(
        bindingFixture,
        taskContextFixture,
      );
    });

    it('should return an array of instances', () => {
      expect(result).toStrictEqual([instanceFixture]);
    });
  });
});
