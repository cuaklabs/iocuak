import * as cuaktask from '@cuaklabs/cuaktask';
import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

import { Builder } from '../../../common/modules/domain/Builder';
import { ContainerModule } from '../../../containerModule/models/domain/ContainerModule';
import { ContainerModuleMetadata } from '../../../containerModuleMetadata/models/domain/ContainerModuleMetadata';
import { ContainerModuleLoadFromMetadataTask } from '../../../containerModuleTask/models/cuaktast/ContainerModuleLoadFromMetadataTask';
import { ContainerModuleLoadFromMetadataTaskKind } from '../../../containerModuleTask/models/domain/ContainerModuleLoadFromMetadataTaskKind';
import { ContainerModuleTaskKind } from '../../../containerModuleTask/models/domain/ContainerModuleTaskKind';
import { ContainerModuleTaskKindType } from '../../../containerModuleTask/models/domain/ContainerModuleTaskKindType';
import { ContainerModuleServiceImplementation } from './ContainerModuleServiceImplementation';

describe(ContainerModuleServiceImplementation.name, () => {
  let taskBuilderMock: jestMock.Mocked<
    Builder<
      cuaktask.DependentTask<
        ContainerModuleTaskKind,
        ContainerModuleTaskKind,
        unknown[],
        unknown
      >,
      [ContainerModuleTaskKind]
    >
  >;
  let dependentTaskRunnerMock: jestMock.Mocked<cuaktask.DependentTaskRunner>;

  let containerModuleServiceImplementation: ContainerModuleServiceImplementation;

  beforeAll(() => {
    taskBuilderMock = {
      build: jest.fn(),
    };
    dependentTaskRunnerMock = {
      run: jest.fn(),
    } as Partial<
      jestMock.Mocked<cuaktask.DependentTaskRunner>
    > as jestMock.Mocked<cuaktask.DependentTaskRunner>;

    containerModuleServiceImplementation =
      new ContainerModuleServiceImplementation(
        taskBuilderMock,
        dependentTaskRunnerMock,
      );
  });

  describe('.loadMetadata', () => {
    let containerModuleMetadataFixture: ContainerModuleMetadata;

    beforeAll(() => {
      containerModuleMetadataFixture = {
        _tag: Symbol('ContainerModuleMetadata'),
      } as unknown as ContainerModuleMetadata;
    });

    describe('when called', () => {
      let loadModuleTaskFixture: ContainerModuleLoadFromMetadataTask;
      let containerModuleFixture: ContainerModule;

      let result: unknown;

      beforeAll(() => {
        loadModuleTaskFixture = {
          _tag: Symbol('ContainerModuleLoadFromMetadataTask'),
        } as unknown as ContainerModuleLoadFromMetadataTask;

        taskBuilderMock.build.mockReturnValueOnce(loadModuleTaskFixture);
        dependentTaskRunnerMock.run.mockReturnValueOnce(containerModuleFixture);

        result = containerModuleServiceImplementation.loadMetadata(
          containerModuleMetadataFixture,
        );
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call taskBuilder.build()', () => {
        const expected: ContainerModuleLoadFromMetadataTaskKind = {
          metadata: containerModuleMetadataFixture,
          type: ContainerModuleTaskKindType.loadFromMetadata,
        };

        expect(taskBuilderMock.build).toHaveBeenCalledTimes(1);
        expect(taskBuilderMock.build).toHaveBeenCalledWith(expected);
      });

      it('should call dependentTaskRunner.run()', () => {
        expect(dependentTaskRunnerMock.run).toHaveBeenCalledTimes(1);
        expect(dependentTaskRunnerMock.run).toHaveBeenCalledWith(
          loadModuleTaskFixture,
        );
      });

      it('should return a ContainerModule', () => {
        expect(result).toBe(containerModuleFixture);
      });
    });
  });
});
