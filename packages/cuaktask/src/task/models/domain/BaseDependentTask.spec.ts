import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

import { NonThenableProperties } from '../../../common/models/NonThenableProperties';
import { BaseDependentTask } from './BaseDependentTask';
import { DependentTask } from './DependentTask';

class BaseDependentTaskMock<
  TKind,
  TDependencyKind,
  TArgs extends unknown[],
  TReturn,
> extends BaseDependentTask<TKind, TDependencyKind, TArgs, TReturn> {
  #innerPerformMock: jestMock.Mock<
    (...params: NonThenableProperties<TArgs>) => TReturn
  >;

  constructor(
    kind: TKind,
    dependencies: DependentTask<TDependencyKind>[] = [],
    innerPerformMock: jestMock.Mock<
      (...params: NonThenableProperties<TArgs>) => TReturn
    >,
  ) {
    super(kind, dependencies);

    this.#innerPerformMock = innerPerformMock;
  }

  protected innerPerform(...args: NonThenableProperties<TArgs>): TReturn {
    return this.#innerPerformMock(...args);
  }
}

describe(BaseDependentTask.name, () => {
  let kindFixture: string;
  let innerPerformMock: jestMock.Mock<() => unknown>;
  let dependenciesFixture: DependentTask<string, string, unknown[], unknown>[];

  let baseDependentTask: BaseDependentTaskMock<string, string, [], unknown>;

  beforeAll(() => {
    kindFixture = 'kind';
    innerPerformMock = jest.fn<() => unknown>();

    dependenciesFixture = [
      new BaseDependentTaskMock(kindFixture, [], innerPerformMock),
    ];

    baseDependentTask = new BaseDependentTaskMock(
      kindFixture,
      dependenciesFixture,
      innerPerformMock,
    );
  });

  describe('dependencies', () => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = baseDependentTask.dependencies;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should not return the same dependencies instance', () => {
        expect(result).not.toBe(dependenciesFixture);
      });

      it('should return a dependencies instance clone', () => {
        expect(result).toStrictEqual(dependenciesFixture);
      });
    });
  });
});
