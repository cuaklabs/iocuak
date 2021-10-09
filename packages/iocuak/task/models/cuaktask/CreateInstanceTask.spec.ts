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
