import * as cuaktask from '@cuaklabs/cuaktask';

import { ContainerModule } from '../../../container/modules/domain/ContainerModule';
import { ContainerBindingService } from '../../../container/services/domain/ContainerBindingService';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { ContainerModuleFactoryMetadata } from '../domain/ContainerModuleFactoryMetadata';
import { ContainerModuleLoadFromMetadataTaskKind } from '../domain/ContainerModuleLoadFromMetadataTaskKind';
import { ContainerModuleMetadataType } from '../domain/ContainerModuleMetadataType';
import { ContainerModuleTaskKind } from '../domain/ContainerModuleTaskKind';

export class ContainerModuleLoadFromMetadataTask extends cuaktask.BaseDependentTask<
  ContainerModuleLoadFromMetadataTaskKind,
  ContainerModuleTaskKind,
  [unknown[] | void],
  ContainerModule | Promise<ContainerModule>
> {
  readonly #containerBindingService: ContainerBindingService;
  readonly #metadataService: MetadataService;

  constructor(
    kind: ContainerModuleLoadFromMetadataTaskKind,
    dependencies:
      | cuaktask.DependentTask<
          ContainerModuleTaskKind,
          ContainerModuleTaskKind
        >[]
      | undefined,
    containerBindingService: ContainerBindingService,
    metadataService: MetadataService,
  ) {
    super(kind, dependencies);

    this.#containerBindingService = containerBindingService;
    this.#metadataService = metadataService;
  }

  protected innerPerform(
    instances: unknown[] | undefined,
  ): ContainerModule | Promise<ContainerModule> {
    switch (this.kind.metadata.type) {
      case ContainerModuleMetadataType.factory:
        return this.#loadFromContainerModuleFactoryMetadata(
          this.kind.metadata,
          instances,
        );
      case ContainerModuleMetadataType.clazz:
        throw new Error('Not implemented');
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  #loadFromContainerModuleFactoryMetadata(
    metadata: ContainerModuleFactoryMetadata,
    instances: unknown[] | undefined,
  ): ContainerModule | Promise<ContainerModule> {
    const containerModule: ContainerModule | Promise<ContainerModule> =
      metadata.factory(...(instances ?? []));

    if (cuaktask.isPromiseLike(containerModule)) {
      return this.#loadModuleAndReturnAsync(containerModule);
    } else {
      return this.#loadModuleAndReturn(containerModule);
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  #loadModuleAndReturn(containerModule: ContainerModule): ContainerModule {
    containerModule.load(this.#containerBindingService, this.#metadataService);

    return containerModule;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  async #loadModuleAndReturnAsync(
    containerModulePromise: Promise<ContainerModule>,
  ): Promise<ContainerModule> {
    const containerModule: ContainerModule = await containerModulePromise;

    return this.#loadModuleAndReturn(containerModule);
  }
}
