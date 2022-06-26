import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

import { ContainerInstanceService } from '../../../container/services/domain/ContainerInstanceService';
import { ContainerModuleCreateInstancesTaskKind } from '../domain/ContainerModuleCreateInstancesTaskKind';
import { ContainerModuleTaskKindType } from '../domain/ContainerModuleTaskKindType';
import { ContainerModuleCreateInstancesTask } from './ContainerModuleCreateInstancesTask';

describe(ContainerModuleCreateInstancesTask.name, () => {
  describe('.perform()', () => {
    describe('when called', () => {
      let taskKind: ContainerModuleCreateInstancesTaskKind;
      let containerInstanceServiceMock: jestMock.Mocked<ContainerInstanceService>;
      let instanceFixture: unknown;

      let containerModuleCreateInstancesTask: ContainerModuleCreateInstancesTask;

      let result: unknown;

      beforeAll(() => {
        taskKind = {
          serviceIds: [Symbol()],
          type: ContainerModuleTaskKindType.createInstances,
        };

        instanceFixture = {
          foo: 'bar',
        };

        containerInstanceServiceMock = {
          create: jest.fn().mockReturnValueOnce(instanceFixture),
        } as Partial<
          jestMock.Mocked<ContainerInstanceService>
        > as jestMock.Mocked<ContainerInstanceService>;

        containerModuleCreateInstancesTask =
          new ContainerModuleCreateInstancesTask(
            taskKind,
            [],
            containerInstanceServiceMock,
          );

        result = containerModuleCreateInstancesTask.perform();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should return an array of instances', () => {
        expect(result).toStrictEqual([instanceFixture]);
      });
    });
  });
});
