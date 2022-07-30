import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

jest.mock('./createInstancesByTag');
jest.mock('./getBinding');

import {
  Binding,
  ClassElementMetadataType,
  ClassElementServiceIdMetadata,
  ClassElementTagMetadata,
} from '@cuaklabs/iocuak-models';

import { ValueBindingFixtures } from '../../../binding/fixtures/domain/ValueBindingFixtures';
import { TaskContext } from '../../models/domain/TaskContext';
import { TaskContextActions } from '../../models/domain/TaskContextActions';
import { createInstancesByTag } from './createInstancesByTag';
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
      let instancesFixture: unknown[];

      let taskContextFixture: TaskContext;

      let result: unknown;

      beforeAll(() => {
        instancesFixture = [Symbol()];

        taskContextFixture = {
          [Symbol()]: Symbol(),
        } as Partial<TaskContext> as TaskContext;

        (
          createInstancesByTag as jestMock.Mock<typeof createInstancesByTag>
        ).mockReturnValueOnce(instancesFixture);

        result = getDependency(
          classElementTagMetadataFixture,
          taskContextFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call createInstancesByTag()', () => {
        expect(createInstancesByTag).toHaveBeenCalledTimes(1);
        expect(createInstancesByTag).toHaveBeenCalledWith(
          classElementTagMetadataFixture.value,
          taskContextFixture,
        );
      });

      it('should return an array of instances', () => {
        expect(result).toStrictEqual(instancesFixture);
      });
    });
  });
});
