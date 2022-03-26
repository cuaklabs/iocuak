import { ContainerServiceApi } from '../../services/api/ContainerServiceApi';

export interface ContainerModuleApi {
  load(container: ContainerServiceApi): void;
}
