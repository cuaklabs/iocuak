import { CreateInstanceTaskKindFixtures } from '../fixtures/CreateInstanceTaskKindFixtures';
import { CreateInstanceTaskKind } from '../models/domain/CreateInstanceTaskKind';
import { GetInstanceDependenciesTaskKind } from '../models/domain/GetInstanceDependenciesTaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';
import { TaskKindSet } from './TaskKindSet';

describe(TaskKindSet.name, () => {
  describe('.add()', () => {
    describe('having a CreateInstanceTaskKind', () => {
      let taskKindFixture: CreateInstanceTaskKind;

      beforeAll(() => {
        taskKindFixture = CreateInstanceTaskKindFixtures.any;
      });

      describe('when called', () => {
        let taskKindSet: TaskKindSet;
        let result: unknown;

        beforeAll(() => {
          taskKindSet = new TaskKindSet();

          result = taskKindSet.add(taskKindFixture);
        });

        it('should return the instance', () => {
          expect(result).toBe(taskKindSet);
        });

        describe('when the task kind is searched for', () => {
          let taskKindSearchResult: unknown;

          beforeAll(() => {
            taskKindSearchResult = taskKindSet.has(taskKindFixture);
          });

          it('should find the task kind', () => {
            expect(taskKindSearchResult).toStrictEqual(true);
          });
        });
      });
    });

    describe('having a GetInstanceDependenciesTaskKind', () => {
      let taskKindFixture: GetInstanceDependenciesTaskKind;

      beforeAll(() => {
        taskKindFixture = {
          id: 'sample-task-id',
          metadata: {
            constructorArguments: [],
            properties: {},
          },
          type: TaskKindType.getInstanceDependencies,
        };
      });

      describe('when called', () => {
        let taskKindSet: TaskKindSet;
        let result: unknown;

        beforeAll(() => {
          taskKindSet = new TaskKindSet();

          result = taskKindSet.add(taskKindFixture);
        });

        it('should return the instance', () => {
          expect(result).toBe(taskKindSet);
        });

        describe('when called and the task kind is searched for', () => {
          let taskKindSearchResult: unknown;

          beforeAll(() => {
            taskKindSearchResult = taskKindSet.has(taskKindFixture);
          });

          it('should find the task kind', () => {
            expect(taskKindSearchResult).toStrictEqual(true);
          });
        });
      });
    });
  });

  describe('.clear()', () => {
    describe('when called', () => {
      let taskKindSet: TaskKindSet;
      let result: unknown;

      beforeAll(() => {
        taskKindSet = new TaskKindSet();

        result = taskKindSet.clear();
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.delete()', () => {
    describe('having a CreateInstanceTaskKind', () => {
      let taskKindFixture: CreateInstanceTaskKind;

      beforeAll(() => {
        taskKindFixture = CreateInstanceTaskKindFixtures.any;
      });

      describe('when called and the task kind is in the set', () => {
        let taskKindSet: TaskKindSet;
        let result: unknown;

        beforeAll(() => {
          taskKindSet = new TaskKindSet();

          taskKindSet.add(taskKindFixture);

          result = taskKindSet.delete(taskKindFixture);
        });

        it('should return true', () => {
          expect(result).toBe(true);
        });
      });

      describe('when called and the task kind is not in the set', () => {
        let taskKindSet: TaskKindSet;
        let result: unknown;

        beforeAll(() => {
          taskKindSet = new TaskKindSet();

          result = taskKindSet.delete(taskKindFixture);
        });

        it('should return false', () => {
          expect(result).toBe(false);
        });
      });
    });

    describe('having a GetInstanceDependenciesTaskKind', () => {
      let taskKindFixture: GetInstanceDependenciesTaskKind;

      beforeAll(() => {
        taskKindFixture = {
          id: 'sample-task-id',
          metadata: {
            constructorArguments: [],
            properties: {},
          },
          type: TaskKindType.getInstanceDependencies,
        };
      });

      describe('when called and the task kind is in the set', () => {
        let taskKindSet: TaskKindSet;
        let result: unknown;

        beforeAll(() => {
          taskKindSet = new TaskKindSet();

          taskKindSet.add(taskKindFixture);

          result = taskKindSet.delete(taskKindFixture);
        });

        it('should return true', () => {
          expect(result).toBe(true);
        });
      });

      describe('when called and the task kind is not in the set', () => {
        let taskKindSet: TaskKindSet;
        let result: unknown;

        beforeAll(() => {
          taskKindSet = new TaskKindSet();

          result = taskKindSet.delete(taskKindFixture);
        });

        it('should return false', () => {
          expect(result).toBe(false);
        });
      });
    });
  });

  describe('.has()', () => {
    describe('having a CreateInstanceTaskKind', () => {
      let taskKindFixture: CreateInstanceTaskKind;

      beforeAll(() => {
        taskKindFixture = CreateInstanceTaskKindFixtures.any;
      });

      describe('when called and the task kind is in the set', () => {
        let taskKindSet: TaskKindSet;
        let result: unknown;

        beforeAll(() => {
          taskKindSet = new TaskKindSet();

          taskKindSet.add(taskKindFixture);

          result = taskKindSet.has(taskKindFixture);
        });

        it('should return true', () => {
          expect(result).toBe(true);
        });
      });

      describe('when called and the task kind is not in the set', () => {
        let taskKindSet: TaskKindSet;
        let result: unknown;

        beforeAll(() => {
          taskKindSet = new TaskKindSet();

          result = taskKindSet.has(taskKindFixture);
        });

        it('should return false', () => {
          expect(result).toBe(false);
        });
      });
    });

    describe('having a GetInstanceDependenciesTaskKind', () => {
      let taskKindFixture: GetInstanceDependenciesTaskKind;

      beforeAll(() => {
        taskKindFixture = {
          id: 'sample-task-id',
          metadata: {
            constructorArguments: [],
            properties: {},
          },
          type: TaskKindType.getInstanceDependencies,
        };
      });

      describe('when called and the task kind is in the set', () => {
        let taskKindSet: TaskKindSet;
        let result: unknown;

        beforeAll(() => {
          taskKindSet = new TaskKindSet();

          taskKindSet.add(taskKindFixture);

          result = taskKindSet.has(taskKindFixture);
        });

        it('should return true', () => {
          expect(result).toBe(true);
        });
      });

      describe('when called and the task kind is not in the set', () => {
        let taskKindSet: TaskKindSet;
        let result: unknown;

        beforeAll(() => {
          taskKindSet = new TaskKindSet();

          result = taskKindSet.has(taskKindFixture);
        });

        it('should return false', () => {
          expect(result).toBe(false);
        });
      });
    });
  });
});
