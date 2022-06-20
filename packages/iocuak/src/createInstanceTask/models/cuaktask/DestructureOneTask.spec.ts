import { beforeAll, describe, expect, it } from '@jest/globals';

import { DestructureOneTaskKind } from '../domain/DestructureOneTaskKind';
import { TaskKindType } from '../domain/TaskKindType';
import { DestructureOneTask } from './DestructureOneTask';

describe(DestructureOneTask.name, () => {
  let destructureOneTaskKind: DestructureOneTaskKind;

  beforeAll(() => {
    destructureOneTaskKind = {
      requestId: Symbol(),
      type: TaskKindType.destructureOne,
    };
  });

  describe('.perform', () => {
    describe('when called', () => {
      let destructureOneTask: DestructureOneTask;

      let paramFixture: unknown;

      let result: unknown;

      beforeAll(() => {
        destructureOneTask = new DestructureOneTask(destructureOneTaskKind);

        paramFixture = Symbol();

        result = destructureOneTask.perform(paramFixture);
      });

      it('should return the destructure value', () => {
        expect(result).toStrictEqual(paramFixture);
      });
    });
  });
});
