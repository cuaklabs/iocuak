import { ContainerInternalService } from '../../../container/services/ContainerInternalService';
import { ServiceDependenciesFixtures } from '../../fixtures/domain/ServiceDependenciesFixtures';
import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
import { TaskKindType } from '../domain/TaskKindType';
import { CreateInstanceTask } from './CreateInstanceTask';

class InstanceTest {
  constructor(public readonly foo?: string) {}
}

describe(CreateInstanceTask.name, () => {
  describe('.perform()', () => {
    describe('having a task', () => {
      let taskKindFixture: CreateInstanceTaskKind;

      beforeAll(() => {
        taskKindFixture = {
          id: 'sample-task-kind-id',
          type: TaskKindType.createInstance,
        };
      });

      describe('when called and containerInternalService.singleton.get() returns no instance', () => {
        let instanceConstructorCallMock: jest.Mock<InstanceTest, [] | [string]>;
        let containerInternalServiceMock: ContainerInternalService;
        let createInstanceTask: CreateInstanceTask<InstanceTest, [] | [string]>;

        let result: unknown;

        beforeAll(() => {
          instanceConstructorCallMock = jest
            .fn<InstanceTest, []>()
            .mockImplementation((foo?: string) => new InstanceTest(foo));

          containerInternalServiceMock = {
            singleton: {
              get: jest.fn().mockReturnValueOnce(undefined),
            },
          } as Partial<ContainerInternalService> as ContainerInternalService;

          createInstanceTask = new CreateInstanceTask(
            instanceConstructorCallMock,
            containerInternalServiceMock,
            taskKindFixture,
          );

          result = createInstanceTask.perform(
            ServiceDependenciesFixtures.withConstructorArgumentsAndProperties,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerInternalService.singleton.get()', () => {
          expect(
            containerInternalServiceMock.singleton.get,
          ).toHaveBeenCalledTimes(1);
          expect(
            containerInternalServiceMock.singleton.get,
          ).toHaveBeenCalledWith(taskKindFixture.id);
        });

        it('should call instanceConstructorCall()', () => {
          expect(instanceConstructorCallMock).toHaveBeenCalledTimes(1);
          expect(instanceConstructorCallMock).toHaveBeenCalledWith(
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

      describe('when called and containerInternalService.singleton.get() returns an instance', () => {
        let instanceTestFixture: InstanceTest;

        let instanceConstructorCallMock: jest.Mock<InstanceTest, [] | [string]>;
        let containerInternalServiceMock: ContainerInternalService;
        let createInstanceTask: CreateInstanceTask<InstanceTest, [] | [string]>;

        let result: unknown;

        beforeAll(() => {
          instanceTestFixture = new InstanceTest();

          instanceConstructorCallMock = jest.fn<InstanceTest, []>();

          containerInternalServiceMock = {
            singleton: {
              get: jest.fn().mockReturnValueOnce(instanceTestFixture),
            },
          } as Partial<ContainerInternalService> as ContainerInternalService;

          createInstanceTask = new CreateInstanceTask(
            instanceConstructorCallMock,
            containerInternalServiceMock,
            taskKindFixture,
          );

          result = createInstanceTask.perform(
            ServiceDependenciesFixtures.withConstructorArgumentsEmptyAndPropertiesEmpty,
          );
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call containerInternalService.singleton.get()', () => {
          expect(
            containerInternalServiceMock.singleton.get,
          ).toHaveBeenCalledTimes(1);
          expect(
            containerInternalServiceMock.singleton.get,
          ).toHaveBeenCalledWith(taskKindFixture.id);
        });

        it('should not call instanceConstructorCall()', () => {
          expect(instanceConstructorCallMock).not.toHaveBeenCalled();
        });

        it('should return an instance of InstanceTest', () => {
          expect(result).toBe(instanceTestFixture);
        });
      });
    });
  });
});
