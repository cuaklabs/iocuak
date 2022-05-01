import * as cuaktask from '@cuaklabs/cuaktask';

import { Builder } from '../../../common/modules/domain/Builder';
import { ContainerModule } from '../../../containerModule/models/domain/ContainerModule';
import { ContainerModuleLoadFromMetadataTask } from '../../../containerModuleTask/models/cuaktast/ContainerModuleLoadFromMetadataTask';
import { ContainerModuleLoadFromMetadataTaskKind } from '../../../containerModuleTask/models/domain/ContainerModuleLoadFromMetadataTaskKind';
import { ContainerModuleMetadata } from '../../../containerModuleTask/models/domain/ContainerModuleMetadata';
import { ContainerModuleTaskKind } from '../../../containerModuleTask/models/domain/ContainerModuleTaskKind';
import { ContainerModuleTaskKindType } from '../../../containerModuleTask/models/domain/ContainerModuleTaskKindType';
import { ContainerModuleService } from '../domain/ContainerModuleService';

export class ContainerModuleServiceImplementation
  implements ContainerModuleService
{
  readonly #taskBuilder: Builder<
    cuaktask.DependentTask<ContainerModuleTaskKind, ContainerModuleTaskKind>,
    [ContainerModuleTaskKind]
  >;

  readonly #dependentTaskRunner: cuaktask.DependentTaskRunner;

  constructor(
    taskBuilder: Builder<
      cuaktask.DependentTask<ContainerModuleTaskKind, ContainerModuleTaskKind>,
      [ContainerModuleTaskKind]
    >,
    dependentTaskRunner: cuaktask.DependentTaskRunner,
  ) {
    this.#taskBuilder = taskBuilder;
    this.#dependentTaskRunner = dependentTaskRunner;
  }

  public loadMetadata(
    containerModuleMetadata: ContainerModuleMetadata,
  ): ContainerModule | Promise<ContainerModule> {
    const loadModuleTaskKind: ContainerModuleLoadFromMetadataTaskKind = {
      metadata: containerModuleMetadata,
      type: ContainerModuleTaskKindType.loadFromMetadata,
    };

    const loadModuleTask: ContainerModuleLoadFromMetadataTask =
      this.#taskBuilder.build(
        loadModuleTaskKind,
      ) as ContainerModuleLoadFromMetadataTask;

    const containerModule: ContainerModule | Promise<ContainerModule> =
      this.#dependentTaskRunner.run(loadModuleTask);

    return containerModule;
  }
}
