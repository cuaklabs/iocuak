import * as cuaktask from '@cuaklabs/cuaktask';

jest.mock('./CreateInstancesTaskDependenciesOperation');

import { BindingService } from '../../binding/services/domain/BindingService';
import { Builder } from '../../common/modules/domain/Builder';
import { SetLike } from '../../common/modules/domain/SetLike';
import { MetadataService } from '../../metadata/services/domain/MetadataService';
import { CreateInstanceTaskKindFixtures } from '../fixtures/domain/CreateInstanceTaskKindFixtures';
import { TaskKind } from '../models/domain/TaskKind';
import { CreateInstancesTaskDependenciesOperation } from './CreateInstancesTaskDependenciesOperation';
import { CreateInstancesTaskDependencyEngine } from './CreateInstancesTaskDependencyEngine';

describe(CreateInstancesTaskDependencyEngine, () => {
  describe('.getDependencies()', () => {
    let containerBindingServiceMock: jest.Mocked<BindingService>;
    let metadataServiceMock: jest.Mocked<MetadataService>;
    let taskKindFixture: TaskKind;
    let taskKindSetBuilderMock: jest.Mocked<Builder<SetLike<TaskKind>>>;

    let createInstancesTaskDependencyEngine: CreateInstancesTaskDependencyEngine;

    beforeAll(() => {
      containerBindingServiceMock = {
        get: jest.fn(),
      } as Partial<jest.Mocked<BindingService>> as jest.Mocked<BindingService>;
      metadataServiceMock = {
        getClassMetadata: jest.fn(),
      } as Partial<
        jest.Mocked<MetadataService>
      > as jest.Mocked<MetadataService>;
      taskKindFixture = CreateInstanceTaskKindFixtures.any;
      taskKindSetBuilderMock = {
        build: jest.fn(),
      };

      createInstancesTaskDependencyEngine =
        new CreateInstancesTaskDependencyEngine(
          containerBindingServiceMock,
          metadataServiceMock,
          taskKindSetBuilderMock,
        );
    });

    describe('when called', () => {
      let taskKindGraphFixture: cuaktask.TaskDependencyKindGraph<
        TaskKind,
        TaskKind
      >;

      let result: unknown;

      beforeAll(() => {
        taskKindGraphFixture = {
          _type: Symbol,
        } as unknown as cuaktask.TaskDependencyKindGraph<TaskKind, TaskKind>;

        (
          CreateInstancesTaskDependenciesOperation as jest.Mock<CreateInstancesTaskDependenciesOperation>
        ).mockReturnValueOnce({
          run: jest.fn().mockReturnValueOnce(taskKindGraphFixture),
        } as Partial<CreateInstancesTaskDependenciesOperation> as CreateInstancesTaskDependenciesOperation);

        result =
          createInstancesTaskDependencyEngine.getDependencies(taskKindFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call CreateInstancesTaskDependencyEngineOperation', () => {
        expect(CreateInstancesTaskDependenciesOperation).toHaveBeenCalledTimes(
          1,
        );
        expect(CreateInstancesTaskDependenciesOperation).toHaveBeenCalledWith(
          containerBindingServiceMock,
          metadataServiceMock,
          taskKindFixture,
          taskKindSetBuilderMock,
        );
      });

      it('should return a TaskKindGraph', () => {
        expect(result).toBe(taskKindGraphFixture);
      });
    });
  });
});
