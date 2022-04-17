import { ContainerInstanceService } from '../../../container/services/domain/ContainerInstanceService';
import { ContainerModuleCreateInstancesTaskKind } from '../domain/ContainerModuleCreateInstancesTaskKind';
import { ContainerModuleTaskKindType } from '../domain/ContainerModuleTaskKindType';
import { ContainerModuleCreateInstancesTask } from './ContainerModuleCreateInstancesTask';

describe(ContainerModuleCreateInstancesTask.name, () => {
  describe('.perform()', () => {
    describe('when called', () => {
      let taskKind: ContainerModuleCreateInstancesTaskKind;
      let containerInstanceServiceMock: jest.Mocked<ContainerInstanceService>;
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
        };

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
