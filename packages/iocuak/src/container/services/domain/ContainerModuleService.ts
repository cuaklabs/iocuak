import { ContainerModule } from '../../../containerModule/models/domain/ContainerModule';
import { ContainerModuleMetadata } from '../../../containerModuleTask/models/domain/ContainerModuleMetadata';

export interface ContainerModuleService {
  loadMetadata(
    containerModuleMetadata: ContainerModuleMetadata,
  ): ContainerModule | Promise<ContainerModule>;
}
