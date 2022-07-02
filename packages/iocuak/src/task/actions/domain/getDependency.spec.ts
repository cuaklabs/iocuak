import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

jest.mock('./getBinding');

import { ValueBindingFixtures } from '../../../binding/fixtures/domain/ValueBindingFixtures';
import { Binding } from '../../../binding/models/domain/Binding';
import { BindingService } from '../../../binding/services/domain/BindingService';
import { ClassElementMetadataType } from '../../../classMetadata/models/domain/ClassElementMetadataType';
import { ClassElementServiceIdMetadata } from '../../../classMetadata/models/domain/ClassElementServiceIdMetadata';
import { ClassElementTagMetadata } from '../../../classMetadata/models/domain/ClassElementTagMetadata';
import { TaskContext } from '../../models/domain/TaskContext';
import { TaskContextActions } from '../../models/domain/TaskContextActions';
import { TaskContextServices } from '../../models/domain/TaskContextServices';
import { getBinding } from './getBinding';
import { getDependency } from './getDependency';

describe(getDependency.name, () => {
  describe('having a ClassElementServiceIdMetadata', () => {
    let classElementServiceIdMetadataFixture: ClassElementServiceIdMetadata;

    beforeAll(() => {
      classElementServiceIdMetadataFixture = {
        type: ClassElementMetadataType.serviceId,
        value: Symbol(),
      };
    });

    describe('when called', () => {
      let bindingFixture: Binding;
      let instanceFixture: unknown;

      let createInstanceFromBindingMock: jestMock.Mock<
        (binding: Binding, context: TaskContext) => unknown
      >;

      let taskContextFixture: TaskContext;

      let result: unknown;

      beforeAll(() => {
        bindingFixture = ValueBindingFixtures.any;
        instanceFixture = Symbol();

        (getBinding as jestMock.Mock<typeof getBinding>).mockReturnValueOnce(
          bindingFixture,
        );

        createInstanceFromBindingMock = jest
          .fn()
          .mockReturnValueOnce(instanceFixture);

        taskContextFixture = {
          actions: {
            createInstanceFromBinding: createInstanceFromBindingMock,
          } as Partial<TaskContextActions> as TaskContextActions,
        } as Partial<TaskContext> as TaskContext;

        result = getDependency(
          classElementServiceIdMetadataFixture,
          taskContextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call getBinding()', () => {
        expect(getBinding).toHaveBeenCalledTimes(1);
        expect(getBinding).toHaveBeenCalledWith(
          classElementServiceIdMetadataFixture.value,
          taskContextFixture,
        );
      });

      it('should call context.actions.createInstanceFromBinding()', () => {
        expect(createInstanceFromBindingMock).toHaveBeenCalledTimes(1);
        expect(createInstanceFromBindingMock).toHaveBeenCalledWith(
          bindingFixture,
          taskContextFixture,
        );
      });

      it('should return an instance', () => {
        expect(result).toBe(instanceFixture);
      });
    });
  });

  describe('having a ClassElementTagMetadata', () => {
    let classElementTagMetadataFixture: ClassElementTagMetadata;

    beforeAll(() => {
      classElementTagMetadataFixture = {
        type: ClassElementMetadataType.tag,
        value: Symbol(),
      };
    });

    describe('when called', () => {
      let bindingFixture: Binding;
      let instanceFixture: unknown;

      let createInstanceFromBindingMock: jestMock.Mock<
        (binding: Binding, context: TaskContext) => unknown
      >;
      let bindingServiceMock: jestMock.Mocked<BindingService>;

      let taskContextFixture: TaskContext;

      let result: unknown;

      beforeAll(() => {
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

        result = getDependency(
          classElementTagMetadataFixture,
          taskContextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call context.services.bindingService.getByTag()', () => {
        expect(bindingServiceMock.getByTag).toHaveBeenCalledTimes(1);
        expect(bindingServiceMock.getByTag).toHaveBeenCalledWith(
          classElementTagMetadataFixture.value,
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
});
