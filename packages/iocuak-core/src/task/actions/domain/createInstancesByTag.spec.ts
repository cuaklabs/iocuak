import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('./getBinding');

import { Tag } from '@cuaklabs/iocuak-common';
import { Binding } from '@cuaklabs/iocuak-models';

import { ValueBindingFixtures } from '../../../binding/fixtures/domain/ValueBindingFixtures';
import { BindingService } from '../../../binding/services/domain/BindingService';
import { TaskContext } from '../../models/domain/TaskContext';
import { TaskContextActions } from '../../models/domain/TaskContextActions';
import { TaskContextServices } from '../../models/domain/TaskContextServices';
import { createInstancesByTag } from './createInstancesByTag';

describe(createInstancesByTag.name, () => {
  describe('when called', () => {
    let tagFixture: Tag;

    let bindingFixture: Binding;
    let instanceFixture: unknown;

    let createInstanceFromBindingMock: jestMock.Mock<
      (binding: Binding, context: TaskContext) => unknown
    >;
    let bindingServiceMock: jestMock.Mocked<BindingService>;

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
      } as Partial<
        jestMock.Mocked<BindingService>
      > as jestMock.Mocked<BindingService>;

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
