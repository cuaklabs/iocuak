import { CreateArrayTaskKindFixtures } from '../../fixtures/domain/CreateArrayTaskKindFixtures';
import { CreateArrayTask } from './CreateArrayTask';

describe(CreateArrayTask.name, () => {
  let createArrayTask: CreateArrayTask;

  beforeAll(() => {
    createArrayTask = new CreateArrayTask(CreateArrayTaskKindFixtures.any);
  });

  describe('.perform()', () => {
    describe('when called, and dependencies match metadata', () => {
      let instancesFixture: unknown[];

      let result: unknown;

      beforeAll(() => {
        instancesFixture = [Symbol(), Symbol()];

        result = createArrayTask.perform(...instancesFixture);
      });

      it('should return instances', () => {
        expect(result).toStrictEqual(instancesFixture);
      });
    });
  });
});
