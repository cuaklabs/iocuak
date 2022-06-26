import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

import { TypeBindingFixtures } from '../../../binding/fixtures/domain/TypeBindingFixtures';
import { ValueBindingFixtures } from '../../../binding/fixtures/domain/ValueBindingFixtures';
import { Binding } from '../../../binding/models/domain/Binding';
import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { ValueBinding } from '../../../binding/models/domain/ValueBinding';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { CreateInstanceTaskKindFixtures } from '../../fixtures/domain/CreateInstanceTaskKindFixtures';
import { ServiceDependenciesFixtures } from '../../fixtures/domain/ServiceDependenciesFixtures';
import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
import { CreateInstanceTask } from './CreateInstanceTask';

class InstanceTest {
  constructor(public readonly foo?: string) {}
}

describe(CreateInstanceTask.name, () => {
  let containerRequestServiceMock: jestMock.Mocked<ContainerRequestService>;
  let containerSingletonServiceMock: jestMock.Mocked<ContainerSingletonService>;

  beforeAll(() => {
    containerRequestServiceMock = {
      get: jest.fn(),
      set: jest.fn(),
    } as Partial<
      jestMock.Mocked<ContainerRequestService>
    > as jestMock.Mocked<ContainerRequestService>;

    containerSingletonServiceMock = {
      get: jest.fn(),
      set: jest.fn(),
    } as Partial<
      jestMock.Mocked<ContainerSingletonService>
    > as jestMock.Mocked<ContainerSingletonService>;
  });

  describe('.perform()', () => {
    describe('having a CreateInstanceTaskKind with binding TypeBinding with scope request', () => {
      let bindingFixture: TypeBinding<InstanceTest, []>;
      let taskKindFixture: CreateInstanceTaskKind;

      beforeAll(() => {
        const instanceConstructorCallMock: jestMock.Mock<
          (foo?: string) => InstanceTest
        > = jest
          .fn<(foo?: string) => InstanceTest>()
          .mockImplementation((foo?: string) => new InstanceTest(foo));

        bindingFixture = {
          ...TypeBindingFixtures.withScopeRequest,
          type: instanceConstructorCallMock,
        };
        taskKindFixture = {
          ...CreateInstanceTaskKindFixtures.any,
          binding: bindingFixture,
        };
      });

      describe('when called, and containerService.request.get() returns no instance', () => {
        let createInstanceTask: CreateInstanceTask<
          Binding,
          InstanceTest,
          [] | [string]
        >;

        let result: unknown;

        beforeAll(() => {
          containerRequestServiceMock.get.mockReturnValueOnce(undefined);

          createInstanceTask = new CreateInstanceTask(
            taskKindFixture,
            containerRequestServiceMock,
            containerSingletonServiceMock,
          );

          result = createInstanceTask.perform(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerRequestServiceMock.get()', () => {
          expect(containerRequestServiceMock.get).toHaveBeenCalledTimes(1);
          expect(containerRequestServiceMock.get).toHaveBeenCalledWith(
            taskKindFixture.requestId,
            taskKindFixture.binding.id,
          );
        });

        it('should call bindingFixture.type()', () => {
          expect(bindingFixture.type).toHaveBeenCalledTimes(1);
          expect(bindingFixture.type).toHaveBeenCalledWith(
            ...ServiceDependenciesFixtures.withConstructorArgumentsAndProperties
              .constructorArguments,
          );
        });

        it('should call containerRequestServiceMock.set()', () => {
          expect(containerRequestServiceMock.set).toHaveBeenCalledTimes(1);
          expect(containerRequestServiceMock.set).toHaveBeenCalledWith(
            taskKindFixture.requestId,
            taskKindFixture.binding.id,
            expect.any(InstanceTest),
          );
          Object.entries(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties
              .properties,
          ).map(([key, value]: [string, unknown]): void => {
            expect(containerSingletonServiceMock.set).toHaveBeenCalledWith(
              taskKindFixture.requestId,
              taskKindFixture.binding.id,
              expect.objectContaining({ [key]: value }),
            );
          });
        });

        it('should return an instance of InstanceTest with properties set', () => {
          expect(result).toBeInstanceOf(InstanceTest);

          Object.entries(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties
              .properties,
          ).map(([key, value]: [string, unknown]): void => {
            expect(result).toHaveProperty(key);
            expect((result as Record<string, unknown>)[key]).toBe(value);
          });
        });
      });

      describe('when called, and containerService.request.get() returns an instance', () => {
        let instanceTestFixture: InstanceTest;
        let createInstanceTask: CreateInstanceTask<
          Binding,
          InstanceTest,
          [] | [string]
        >;

        let result: unknown;

        beforeAll(() => {
          instanceTestFixture = new InstanceTest();

          containerRequestServiceMock.get.mockReturnValueOnce(
            instanceTestFixture,
          );

          createInstanceTask = new CreateInstanceTask(
            taskKindFixture,
            containerRequestServiceMock,
            containerSingletonServiceMock,
          );

          result = createInstanceTask.perform(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerRequestServiceMock.get()', () => {
          expect(containerRequestServiceMock.get).toHaveBeenCalledTimes(1);
          expect(containerRequestServiceMock.get).toHaveBeenCalledWith(
            taskKindFixture.requestId,
            taskKindFixture.binding.id,
          );
        });

        it('should not call bindingFixture.type()', () => {
          expect(bindingFixture.type).not.toHaveBeenCalled();
        });

        it('should return an instance of InstanceTest', () => {
          expect(result).toBe(instanceTestFixture);
        });
      });
    });

    describe('having a CreateInstanceTaskKind with binding TypeBinding with scope singleton', () => {
      let bindingFixture: TypeBinding<InstanceTest>;
      let taskKindFixture: CreateInstanceTaskKind;

      beforeAll(() => {
        const instanceConstructorCallMock: jestMock.Mock<() => InstanceTest> =
          jest
            .fn<() => InstanceTest>()
            .mockImplementation((foo?: string) => new InstanceTest(foo));

        bindingFixture = {
          ...TypeBindingFixtures.withScopeSingleton,
          type: instanceConstructorCallMock,
        };
        taskKindFixture = {
          ...CreateInstanceTaskKindFixtures.any,
          binding: bindingFixture,
        };
      });

      describe('when called, and containerService.singleton.get() returns no instance', () => {
        let createInstanceTask: CreateInstanceTask<
          Binding,
          InstanceTest,
          [] | [string]
        >;

        let result: unknown;

        beforeAll(() => {
          containerSingletonServiceMock.get.mockReturnValueOnce(undefined);

          createInstanceTask = new CreateInstanceTask(
            taskKindFixture,
            containerRequestServiceMock,
            containerSingletonServiceMock,
          );

          result = createInstanceTask.perform(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerSingletonServiceMock.get()', () => {
          expect(containerSingletonServiceMock.get).toHaveBeenCalledTimes(1);
          expect(containerSingletonServiceMock.get).toHaveBeenCalledWith(
            taskKindFixture.binding.id,
          );
        });

        it('should call bindingFixture.type()', () => {
          expect(bindingFixture.type).toHaveBeenCalledTimes(1);
          expect(bindingFixture.type).toHaveBeenCalledWith(
            ...ServiceDependenciesFixtures.withConstructorArgumentsAndProperties
              .constructorArguments,
          );
        });

        it('should call containerSingletonService.set()', () => {
          expect(containerSingletonServiceMock.set).toHaveBeenCalledTimes(1);
          expect(containerSingletonServiceMock.set).toHaveBeenCalledWith(
            taskKindFixture.binding.id,
            expect.any(InstanceTest),
          );
          Object.entries(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties
              .properties,
          ).map(([key, value]: [string, unknown]): void => {
            expect(containerSingletonServiceMock.set).toHaveBeenCalledWith(
              taskKindFixture.binding.id,
              expect.objectContaining({ [key]: value }),
            );
          });
        });

        it('should return an instance of InstanceTest with properties set', () => {
          expect(result).toBeInstanceOf(InstanceTest);

          Object.entries(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties
              .properties,
          ).map(([key, value]: [string, unknown]): void => {
            expect(result).toHaveProperty(key);
            expect((result as Record<string, unknown>)[key]).toBe(value);
          });
        });
      });

      describe('when called, and containerService.singleton.get() returns an instance', () => {
        let instanceTestFixture: InstanceTest;
        let createInstanceTask: CreateInstanceTask<
          Binding,
          InstanceTest,
          [] | [string]
        >;

        let result: unknown;

        beforeAll(() => {
          instanceTestFixture = new InstanceTest();

          containerSingletonServiceMock.get.mockReturnValueOnce(
            instanceTestFixture,
          );

          createInstanceTask = new CreateInstanceTask(
            taskKindFixture,
            containerRequestServiceMock,
            containerSingletonServiceMock,
          );

          result = createInstanceTask.perform(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerSingletonServiceMock.get()', () => {
          expect(containerSingletonServiceMock.get).toHaveBeenCalledTimes(1);
          expect(containerSingletonServiceMock.get).toHaveBeenCalledWith(
            taskKindFixture.binding.id,
          );
        });

        it('should not call bindingFixture.type()', () => {
          expect(bindingFixture.type).not.toHaveBeenCalled();
        });

        it('should return an instance of InstanceTest', () => {
          expect(result).toBe(instanceTestFixture);
        });
      });
    });

    describe('having a CreateInstanceTaskKind with binding TypeBinding with scope transient', () => {
      let bindingFixture: TypeBinding<InstanceTest>;
      let taskKindFixture: CreateInstanceTaskKind;

      beforeAll(() => {
        const instanceConstructorCallMock: jestMock.Mock<() => InstanceTest> =
          jest
            .fn<() => InstanceTest>()
            .mockImplementation((foo?: string) => new InstanceTest(foo));

        bindingFixture = {
          ...TypeBindingFixtures.withScopeTransient,
          type: instanceConstructorCallMock,
        };
        taskKindFixture = {
          ...CreateInstanceTaskKindFixtures.any,
          binding: bindingFixture,
        };
      });

      describe('when called', () => {
        let createInstanceTask: CreateInstanceTask<
          Binding,
          InstanceTest,
          [] | [string]
        >;

        let result: unknown;

        beforeAll(() => {
          createInstanceTask = new CreateInstanceTask(
            taskKindFixture,
            containerRequestServiceMock,
            containerSingletonServiceMock,
          );

          result = createInstanceTask.perform(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call bindingFixture.type()', () => {
          expect(bindingFixture.type).toHaveBeenCalledTimes(1);
          expect(bindingFixture.type).toHaveBeenCalledWith(
            ...ServiceDependenciesFixtures.withConstructorArgumentsAndProperties
              .constructorArguments,
          );
        });

        it('should return an instance of InstanceTest with properties set', () => {
          expect(result).toBeInstanceOf(InstanceTest);

          Object.entries(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties
              .properties,
          ).map(([key, value]: [string, unknown]): void => {
            expect(result).toHaveProperty(key);
            expect((result as Record<string, unknown>)[key]).toBe(value);
          });
        });
      });
    });

    describe('having a CreateInstanceTaskKind with binding ValueBinding', () => {
      let bindingFixture: ValueBinding;
      let taskKindFixture: CreateInstanceTaskKind;

      beforeAll(() => {
        bindingFixture = {
          ...ValueBindingFixtures.any,
          value: new InstanceTest('fooValue'),
        };
        taskKindFixture = {
          ...CreateInstanceTaskKindFixtures.any,
          binding: bindingFixture,
        };
      });

      describe('when called', () => {
        let createInstanceTask: CreateInstanceTask<
          Binding,
          InstanceTest,
          [] | [string]
        >;

        let result: unknown;

        beforeAll(() => {
          createInstanceTask = new CreateInstanceTask(
            taskKindFixture,
            containerRequestServiceMock,
            containerSingletonServiceMock,
          );

          result = createInstanceTask.perform(
            ServiceDependenciesFixtures.withConstructorArgumentsEmptyAndPropertiesEmpty,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should return an instance', () => {
          expect(result).toBe(bindingFixture.value);
        });
      });
    });
  });
});
