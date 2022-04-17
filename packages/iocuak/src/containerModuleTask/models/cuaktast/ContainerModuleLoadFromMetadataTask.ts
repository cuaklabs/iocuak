import * as cuaktask from '@cuaklabs/cuaktask';

import { ContainerModule } from '../../../container/modules/domain/ContainerModule';
import { ContainerBindingService } from '../../../container/services/domain/ContainerBindingService';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';
import { ContainerModuleLoadFromMetadataTaskKind } from '../domain/ContainerModuleLoadFromMetadataTaskKind';
import { ContainerModuleTaskKind } from '../domain/ContainerModuleTaskKind';

export class ContainerModuleLoadFromMetadataTask extends cuaktask.BaseDependentTask<
  ContainerModuleLoadFromMetadataTaskKind,
  ContainerModuleTaskKind,
  [unknown[]],
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
    instances: unknown[],
  ): ContainerModule | Promise<ContainerModule> {
    const containerModule: ContainerModule | Promise<ContainerModule> =
      this.kind.metadata.factory(...instances);

    if (cuaktask.isPromiseLike(containerModule)) {
      return this.#createModuleFactoryAndLoadAsync(containerModule);
    } else {
      return this.#createModuleFactoryAndLoad(containerModule);
    }
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  #createModuleFactoryAndLoad(
    containerModule: ContainerModule,
  ): ContainerModule {
    containerModule.load(this.#containerBindingService, this.#metadataService);

    return containerModule;
  }

  // eslint-disable-next-line @typescript-eslint/member-ordering
  async #createModuleFactoryAndLoadAsync(
    containerModulePromise: Promise<ContainerModule>,
  ): Promise<ContainerModule> {
    const containerModule: ContainerModule = await containerModulePromise;

    return this.#createModuleFactoryAndLoad(containerModule);
  }
}
