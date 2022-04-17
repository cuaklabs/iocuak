import * as cuaktask from '@cuaklabs/cuaktask';

import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerInstanceService } from '../../../container/services/domain/ContainerInstanceService';
import { ContainerModuleCreateInstancesTaskKind } from '../domain/ContainerModuleCreateInstancesTaskKind';
import { ContainerModuleTaskKind } from '../domain/ContainerModuleTaskKind';

export class ContainerModuleCreateInstancesTask<
  TInstances extends unknown[] = unknown[],
> extends cuaktask.BaseDependentTask<
  ContainerModuleCreateInstancesTaskKind,
  ContainerModuleTaskKind,
  unknown[],
  TInstances
> {
  readonly #containerInstanceService: ContainerInstanceService;

  constructor(
    taskKind: ContainerModuleCreateInstancesTaskKind,
    dependencies:
      | cuaktask.DependentTask<
          ContainerModuleTaskKind,
          ContainerModuleTaskKind
        >[]
      | undefined,
    containerInstanceService: ContainerInstanceService,
  ) {
    super(taskKind, dependencies);

    this.#containerInstanceService = containerInstanceService;
  }

  protected innerPerform(): TInstances {
    const instances: TInstances = this.kind.serviceIds.map(
      (serviceId: ServiceId) =>
        this.#containerInstanceService.create(serviceId),
    ) as TInstances;

    return instances;
  }
}
