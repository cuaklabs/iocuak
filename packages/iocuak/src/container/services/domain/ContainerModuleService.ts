import { ContainerModuleMetadata } from '../../../containerModuleTask/models/domain/ContainerModuleMetadata';
import { ContainerModule } from '../../modules/domain/ContainerModule';

export interface ContainerModuleService {
  loadMetadata(
    containerModuleMetadata: ContainerModuleMetadata,
  ): ContainerModule | Promise<ContainerModule>;
}
