import { TaskKind } from '../models/domain/TaskKind';
import { TaskKindType } from '../models/domain/TaskKindType';
import { TaskScope } from '../models/domain/TaskScope';
import { TaskKindSet } from './TaskKindSet';

describe(TaskKindSet.name, () => {
  describe('.add()', () => {
    describe('when called', () => {
      let taskKindFixture: TaskKind;

      let taskKindSet: TaskKindSet;
      let result: unknown;

      beforeAll(() => {
        taskKindFixture = {
          id: 'sample-task-id',
          scope: 'fake-task-scope' as TaskScope,
          type: 'fake-task-kind-type' as TaskKindType,
        };

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
    describe('when the task kind is in the set', () => {
      let taskKindFixture: TaskKind;

      let taskKindSet: TaskKindSet;
      let result: unknown;

      beforeAll(() => {
        taskKindFixture = {
          id: 'sample-task-id',
          scope: 'fake-task-scope' as TaskScope,
          type: 'fake-task-kind-type' as TaskKindType,
        };

        taskKindSet = new TaskKindSet();

        taskKindSet.add(taskKindFixture);

        result = taskKindSet.delete(taskKindFixture);
      });

      it('should return true', () => {
        expect(result).toBe(true);
      });
    });

    describe('when the task kind is not in the set', () => {
      let taskKindFixture: TaskKind;

      let taskKindSet: TaskKindSet;
      let result: unknown;

      beforeAll(() => {
        taskKindFixture = {
          id: 'sample-task-id',
          scope: 'fake-task-scope' as TaskScope,
          type: 'fake-task-kind-type' as TaskKindType,
        };

        taskKindSet = new TaskKindSet();

        result = taskKindSet.delete(taskKindFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });

  describe('.has()', () => {
    describe('when the task kind is in the set', () => {
      let taskKindFixture: TaskKind;

      let taskKindSet: TaskKindSet;
      let result: unknown;

      beforeAll(() => {
        taskKindFixture = {
          id: 'sample-task-id',
          scope: 'fake-task-scope' as TaskScope,
          type: 'fake-task-kind-type' as TaskKindType,
        };

        taskKindSet = new TaskKindSet();

        taskKindSet.add(taskKindFixture);

        result = taskKindSet.has(taskKindFixture);
      });

      it('should return true', () => {
        expect(result).toBe(true);
      });
    });

    describe('when the task kind is not in the set', () => {
      let taskKindFixture: TaskKind;

      let taskKindSet: TaskKindSet;
      let result: unknown;

      beforeAll(() => {
        taskKindFixture = {
          id: 'sample-task-id',
          scope: 'fake-task-scope' as TaskScope,
          type: 'fake-task-kind-type' as TaskKindType,
        };

        taskKindSet = new TaskKindSet();

        result = taskKindSet.has(taskKindFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });
});
