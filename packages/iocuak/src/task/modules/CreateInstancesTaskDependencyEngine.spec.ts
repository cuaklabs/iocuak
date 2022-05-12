import * as cuaktask from '@cuaklabs/cuaktask';

jest.mock('./CreateInstancesTaskDependencyEngineOperation.ts');

import { BindingService } from '../../binding/services/domain/BindingService';
import { Builder } from '../../common/modules/domain/Builder';
import { SetLike } from '../../common/modules/domain/SetLike';
import { MetadataService } from '../../metadata/services/domain/MetadataService';
import { CreateInstanceTaskKindFixtures } from '../fixtures/domain/CreateInstanceTaskKindFixtures';
import { TaskKind } from '../models/domain/TaskKind';
import { CreateInstancesTaskDependencyEngine } from './CreateInstancesTaskDependencyEngine';
import { CreateInstancesTaskDependencyEngineOperation } from './CreateInstancesTaskDependencyEngineOperation';

describe(CreateInstancesTaskDependencyEngine, () => {
  describe('.getDependencies()', () => {
    let containerBindingServiceMock: jest.Mocked<BindingService>;
    let metadataServiceMock: jest.Mocked<MetadataService>;
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
      let taskKindFixture: TaskKind;
      let taskKindGraphFixture: cuaktask.TaskDependencyKindGraph<
        TaskKind,
        TaskKind
      >;

      let result: unknown;

      beforeAll(() => {
        taskKindFixture = CreateInstanceTaskKindFixtures.any;
        taskKindGraphFixture = {
          _type: Symbol,
        } as unknown as cuaktask.TaskDependencyKindGraph<TaskKind, TaskKind>;

        (
          CreateInstancesTaskDependencyEngineOperation as jest.Mock<CreateInstancesTaskDependencyEngineOperation>
        ).mockReturnValueOnce({
          getDependencies: jest.fn().mockReturnValueOnce(taskKindGraphFixture),
        } as Partial<CreateInstancesTaskDependencyEngineOperation> as CreateInstancesTaskDependencyEngineOperation);

        result =
          createInstancesTaskDependencyEngine.getDependencies(taskKindFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call CreateInstancesTaskDependencyEngineOperation', () => {
        expect(
          CreateInstancesTaskDependencyEngineOperation,
        ).toHaveBeenCalledTimes(1);
        expect(
          CreateInstancesTaskDependencyEngineOperation,
        ).toHaveBeenCalledWith(
          containerBindingServiceMock,
          metadataServiceMock,
          taskKindSetBuilderMock,
        );
      });

      it('should return a TaskKindGraph', () => {
        expect(result).toBe(taskKindGraphFixture);
      });
    });
  });
});
