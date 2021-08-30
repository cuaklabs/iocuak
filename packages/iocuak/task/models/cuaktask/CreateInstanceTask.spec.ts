import { TaskId } from '../domain/TaskId';
import { TaskKind } from '../domain/TaskKind';
import { TaskKindType } from '../domain/TaskKindType';
import { TaskScope } from '../domain/TaskScope';
import { CreateInstanceTask } from './CreateInstanceTask';

class InstanceTest {}

describe(CreateInstanceTask.name, () => {
  describe('.perform()', () => {
    describe('having a task kind with singletonScope', () => {
      let taskKindFixture: TaskKind<TaskKindType.createInstance>;

      beforeAll(() => {
        taskKindFixture = {
          id: 'sample-task-kind-id',
          scope: TaskScope.singleton,
          type: TaskKindType.createInstance,
        };
      });

      describe('when called', () => {
        let createInstanceTask: CreateInstanceTask<InstanceTest, []>;

        let result: unknown;

        beforeAll(() => {
          createInstanceTask = new CreateInstanceTask(
            InstanceTest,
            new Map(),
            taskKindFixture,
          );

          result = createInstanceTask.perform();
        });

        it('should return an instance of InstanceTest', () => {
          expect(result).toBeInstanceOf(InstanceTest);
        });
      });

      describe('having a taskIdToInstanceMap with an entry related to the task kind id', () => {
        let instanceTestFixture: InstanceTest;
        let taskIdToInstanceMap: Map<TaskId, unknown>;

        beforeAll(() => {
          instanceTestFixture = new InstanceTest();
          taskIdToInstanceMap = new Map([
            [taskKindFixture.id, instanceTestFixture],
          ]);
        });

        describe('when called', () => {
          let createInstanceTask: CreateInstanceTask<InstanceTest, []>;

          let result: unknown;

          beforeAll(() => {
            createInstanceTask = new CreateInstanceTask(
              InstanceTest,
              taskIdToInstanceMap,
              taskKindFixture,
            );

            result = createInstanceTask.perform();
          });

          it('should return the map entry instance', () => {
            expect(result).toBe(instanceTestFixture);
          });
        });
      });
    });

    describe('having a task kind with transientScope', () => {
      let taskKindFixture: TaskKind<TaskKindType.createInstance>;

      beforeAll(() => {
        taskKindFixture = {
          id: 'sample-task-kind-id',
          scope: TaskScope.transient,
          type: TaskKindType.createInstance,
        };
      });

      describe('when called', () => {
        let createInstanceTask: CreateInstanceTask<InstanceTest, []>;

        let result: unknown;

        beforeAll(() => {
          createInstanceTask = new CreateInstanceTask(
            InstanceTest,
            new Map(),
            taskKindFixture,
          );

          result = createInstanceTask.perform();
        });

        it('should return an instance of InstanceTest', () => {
          expect(result).toBeInstanceOf(InstanceTest);
        });
      });
    });
  });
});
