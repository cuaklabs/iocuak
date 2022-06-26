import { beforeAll, describe, expect, it } from '@jest/globals';

import { CreateTagInstancesTaskKindFixtures } from '../../fixtures/domain/CreateTagInstancesTaskKindFixtures';
import { CreateTagInstancesTask } from './CreateTagInstancesTask';

describe(CreateTagInstancesTask.name, () => {
  let createTagInstancesTask: CreateTagInstancesTask;

  beforeAll(() => {
    createTagInstancesTask = new CreateTagInstancesTask(
      CreateTagInstancesTaskKindFixtures.any,
    );
  });

  describe('when called', () => {
    let servicesFixture: unknown[];

    let result: unknown;

    beforeAll(() => {
      servicesFixture = [Symbol()];

      result = createTagInstancesTask.perform(...servicesFixture);
    });

    it('should return an array', () => {
      expect(result).toStrictEqual(servicesFixture);
    });
  });
});
