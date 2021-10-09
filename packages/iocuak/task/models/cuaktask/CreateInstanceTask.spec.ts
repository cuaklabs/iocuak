import { ContainerInternalService } from '../../../container/services/ContainerInternalService';
import { CreateInstanceTaskKind } from '../domain/CreateInstanceTaskKind';
import { TaskKindType } from '../domain/TaskKindType';
import { CreateInstanceTask } from './CreateInstanceTask';

class InstanceTest {}

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
        let instanceConstructorCallMock: jest.Mock<InstanceTest, []>;
        let containerInternalServiceMock: ContainerInternalService;
        let createInstanceTask: CreateInstanceTask<InstanceTest, []>;

        let result: unknown;

        beforeAll(() => {
          instanceConstructorCallMock = jest
            .fn<InstanceTest, []>()
            .mockImplementation(() => new InstanceTest());

          containerInternalServiceMock = {
            singleton: {
              get: jest.fn().mockReturnValueOnce(undefined),
            },
          };

          createInstanceTask = new CreateInstanceTask(
            instanceConstructorCallMock,
            containerInternalServiceMock,
            taskKindFixture,
          );

          result = createInstanceTask.perform();
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
          expect(instanceConstructorCallMock).toHaveBeenCalledWith();
        });

        it('should return an instance of InstanceTest', () => {
          expect(result).toBeInstanceOf(InstanceTest);
        });
      });

      describe('when called and containerInternalService.singleton.get() returns an instance', () => {
        let instanceTestFixture: InstanceTest;

        let instanceConstructorCallMock: jest.Mock<InstanceTest, []>;
        let containerInternalServiceMock: ContainerInternalService;
        let createInstanceTask: CreateInstanceTask<InstanceTest, []>;

        let result: unknown;

        beforeAll(() => {
          instanceTestFixture = new InstanceTest();

          instanceConstructorCallMock = jest.fn<InstanceTest, []>();

          containerInternalServiceMock = {
            singleton: {
              get: jest.fn().mockReturnValueOnce(instanceTestFixture),
            },
          };

          createInstanceTask = new CreateInstanceTask(
            instanceConstructorCallMock,
            containerInternalServiceMock,
            taskKindFixture,
          );

          result = createInstanceTask.perform();
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
