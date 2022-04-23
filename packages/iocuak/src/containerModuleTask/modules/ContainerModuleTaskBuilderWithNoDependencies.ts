import * as cuaktask from '@cuaklabs/cuaktask';

import { ContainerBindingService } from '../../container/services/domain/ContainerBindingService';
import { ContainerInstanceService } from '../../container/services/domain/ContainerInstanceService';
import { MetadataService } from '../../metadata/services/domain/MetadataService';
import { ContainerModuleCreateInstancesTask } from '../models/cuaktast/ContainerModuleCreateInstancesTask';
import { ContainerModuleLoadFromMetadataTask } from '../models/cuaktast/ContainerModuleLoadFromMetadataTask';
import { ContainerModuleCreateInstancesTaskKind } from '../models/domain/ContainerModuleCreateInstancesTaskKind';
import { ContainerModuleLoadFromMetadataTaskKind } from '../models/domain/ContainerModuleLoadFromMetadataTaskKind';
import { ContainerModuleTaskKindType } from '../models/domain/ContainerModuleTaskKindType';
import { isContainerModuleTaskKind } from '../utils/isContainerModuleTaskKind';

export class ContainerModuleTaskBuilderWithNoDependencies {
  readonly #containerBindingService: ContainerBindingService;
  readonly #containerInstanceService: ContainerInstanceService;
  readonly #metadataService: MetadataService;

  constructor(
    containerBindingService: ContainerBindingService,
    containerInstanceService: ContainerInstanceService,
    metadataService: MetadataService,
  ) {
    this.#containerBindingService = containerBindingService;
    this.#containerInstanceService = containerInstanceService;
    this.#metadataService = metadataService;
  }

  public buildWithNoDependencies<TKind, TArgs extends unknown[], TReturn>(
    taskKind: TKind,
  ): cuaktask.DependentTask<TKind, unknown, TArgs, TReturn> {
    if (isContainerModuleTaskKind(taskKind)) {
      switch (taskKind.type) {
        case ContainerModuleTaskKindType.createInstances:
          return this.#buildContainerModuleCreateInstancesTask(taskKind);
        case ContainerModuleTaskKindType.loadFromMetadata:
          return this.#buildContainerModuleLoadFromMetadataTask(taskKind);
      }
    } else {
      throw new Error('Task kind not supported!');
    }
  }

  #buildContainerModuleCreateInstancesTask<
    TKind,
    TArgs extends unknown[],
    TReturn,
  >(
    taskKind: ContainerModuleCreateInstancesTaskKind,
  ): cuaktask.DependentTask<TKind, unknown, TArgs, TReturn> {
    return new ContainerModuleCreateInstancesTask(
      taskKind,
      [],
      this.#containerInstanceService,
    ) as unknown as cuaktask.DependentTask<TKind, unknown, TArgs, TReturn>;
  }

  #buildContainerModuleLoadFromMetadataTask<
    TKind,
    TArgs extends unknown[],
    TReturn,
  >(
    taskKind: ContainerModuleLoadFromMetadataTaskKind,
  ): cuaktask.DependentTask<TKind, unknown, TArgs, TReturn> {
    return new ContainerModuleLoadFromMetadataTask(
      taskKind,
      [],
      this.#containerBindingService,
      this.#containerInstanceService,
      this.#metadataService,
    ) as unknown as cuaktask.DependentTask<TKind, unknown, TArgs, TReturn>;
  }
}
