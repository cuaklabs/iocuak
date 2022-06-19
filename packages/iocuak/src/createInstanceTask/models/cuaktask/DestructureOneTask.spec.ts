import jest from '@jest/globals';

import { DestructureOneTaskKind } from '../domain/DestructureOneTaskKind';
import { TaskKindType } from '../domain/TaskKindType';
import { DestructureOneTask } from './DestructureOneTask';

jest.describe(DestructureOneTask.name, () => {
  let destructureOneTaskKind: DestructureOneTaskKind;

  jest.beforeAll(() => {
    destructureOneTaskKind = {
      requestId: Symbol(),
      type: TaskKindType.destructureOne,
    };
  });

  jest.describe('.perform', () => {
    jest.describe('when called', () => {
      let destructureOneTask: DestructureOneTask;

      let paramFixture: unknown;

      let result: unknown;

      jest.beforeAll(() => {
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
