import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

jest.mock('../../classMetadata/utils/getClassMetadata');

import { ServiceId } from '@cuaklabs/iocuak-common';
import {
  TypeBinding,
  BindingScope,
  BindingType,
  ClassMetadata,
} from '@cuaklabs/iocuak-models';

import { TypeBindingFixtures } from '../../binding/fixtures/TypeBindingFixtures';
import { ClassMetadataFixtures } from '../../classMetadata/fixtures/ClassMetadataFixtures';
import { getClassMetadata } from '../../classMetadata/utils/getClassMetadata';
import { ServiceDependencies } from '../models/ServiceDependencies';
import { TaskContext } from '../models/TaskContext';
import { TaskContextActions } from '../models/TaskContextActions';
import { createInstanceInTransientScope } from './createInstanceInTransientScope';

describe(createInstanceInTransientScope.name, () => {
  describe('when called, and context.servicesInstantiatedSet.has returns true', () => {
    let typeBindingFixture: TypeBinding;
    let servicesInstantiatedSetMock: jest.Mocked<Set<ServiceId>>;
    let taskContextFixture: TaskContext;

    let result: unknown;

    beforeAll(() => {
      try {
        typeBindingFixture = TypeBindingFixtures.any;

        servicesInstantiatedSetMock = {
          has: jest.fn().mockReturnValueOnce(true),
        } as Partial<jest.Mocked<Set<ServiceId>>> as jest.Mocked<
          Set<ServiceId>
        >;

        taskContextFixture = {
          servicesInstantiatedSet: servicesInstantiatedSetMock,
        } as Partial<TaskContext> as TaskContext;

        createInstanceInTransientScope(typeBindingFixture, taskContextFixture);
      } catch (error: unknown) {
        result = error;
      }
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call context.servicesInstantiatedSet.has()', () => {
      expect(servicesInstantiatedSetMock.has).toHaveBeenCalledTimes(1);
      expect(servicesInstantiatedSetMock.has).toHaveBeenCalledWith(
        typeBindingFixture.id,
      );
    });

    it('should throw an Error', () => {
      const expectedError: Partial<Error> = {
        message: 'Circular dependency found!',
      };

      expect(result).toBeInstanceOf(Error);
      expect(result).toStrictEqual(expect.objectContaining(expectedError));
    });
  });

  describe('when called, and context.servicesInstantiatedSet.has returns false', () => {
    let typeBindingFixture: TypeBinding;
    let getDependenciesMock: jest.Mock<
      (
        classMetadata: ClassMetadata,
        context: TaskContext,
      ) => ServiceDependencies
    >;
    let servicesInstantiatedSetMock: jest.Mocked<Set<ServiceId>>;
    let taskContextFixture: TaskContext;

    let classMetadataFixture: ClassMetadata;
    let serviceDependenciesFixture: ServiceDependencies;
    let instanceFixture: Record<string | symbol, unknown>;

    let result: unknown;

    beforeAll(() => {
      instanceFixture = { [Symbol()]: Symbol() };

      typeBindingFixture = {
        bindingType: BindingType.type,
        id: Symbol(),
        scope: BindingScope.transient,
        tags: [],
        type: jest.fn().mockReturnValueOnce({ ...instanceFixture }),
      };

      classMetadataFixture =
        ClassMetadataFixtures.withConstructorArgumentsServiceAndPropertiesService;

      (
        getClassMetadata as jest.Mock<typeof getClassMetadata>
      ).mockReturnValueOnce(classMetadataFixture);

      serviceDependenciesFixture = {
        constructorArguments: classMetadataFixture.constructorArguments.map(
          () => Symbol(),
        ),
        properties: new Map([[Symbol(), Symbol()]]),
      };

      getDependenciesMock = jest
        .fn<TaskContextActions['getDependencies']>()
        .mockReturnValueOnce(serviceDependenciesFixture);

      servicesInstantiatedSetMock = {
        add: jest.fn().mockReturnThis(),
        delete: jest.fn(),
        has: jest.fn().mockReturnValueOnce(false),
      } as Partial<jest.Mocked<Set<ServiceId>>> as jest.Mocked<Set<ServiceId>>;

      taskContextFixture = {
        actions: {
          getDependencies: getDependenciesMock,
        } as Partial<TaskContextActions> as TaskContextActions,
        servicesInstantiatedSet: servicesInstantiatedSetMock,
      } as Partial<TaskContext> as TaskContext;

      result = createInstanceInTransientScope(
        typeBindingFixture,
        taskContextFixture,
      );
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call context.servicesInstantiatedSet.has()', () => {
      expect(servicesInstantiatedSetMock.has).toHaveBeenCalledTimes(1);
      expect(servicesInstantiatedSetMock.has).toHaveBeenCalledWith(
        typeBindingFixture.id,
      );
    });

    it('should call context.servicesInstantiatedSet.add()', () => {
      expect(servicesInstantiatedSetMock.add).toHaveBeenCalledTimes(1);
      expect(servicesInstantiatedSetMock.add).toHaveBeenCalledWith(
        typeBindingFixture.id,
      );
    });

    it('should call getClassMetadata()', () => {
      expect(getClassMetadata).toHaveBeenCalledTimes(1);
      expect(getClassMetadata).toHaveBeenCalledWith(typeBindingFixture.type);
    });

    it('should call context.actions.getDependencies()', () => {
      expect(getDependenciesMock).toHaveBeenCalledTimes(1);
      expect(getDependenciesMock).toHaveBeenCalledWith(
        classMetadataFixture,
        taskContextFixture,
      );
    });

    it('should call context.servicesInstantiatedSet.delete()', () => {
      expect(servicesInstantiatedSetMock.delete).toHaveBeenCalledTimes(1);
      expect(servicesInstantiatedSetMock.delete).toHaveBeenCalledWith(
        typeBindingFixture.id,
      );
    });

    it('should call binding.type()', () => {
      expect(typeBindingFixture.type).toHaveBeenCalledTimes(1);
      expect(typeBindingFixture.type).toHaveBeenCalledWith(
        ...serviceDependenciesFixture.constructorArguments,
      );
    });

    it('should set instance properties', () => {
      expect(result).toStrictEqual(
        expect.objectContaining({ ...instanceFixture }),
      );

      for (const [
        propertyKey,
        propertyValue,
      ] of serviceDependenciesFixture.properties.entries()) {
        expect((result as Record<string | symbol, unknown>)[propertyKey]).toBe(
          propertyValue,
        );
      }
    });
  });
});
