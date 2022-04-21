import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModule } from '../../../container/modules/domain/ContainerModule';

export interface ContainerModuleMetadata<TArgs extends unknown[] = unknown[]> {
  factory: (...args: TArgs) => ContainerModule | Promise<ContainerModule>;
  imports: ContainerModuleMetadata[];
  injects: ServiceId[];
}
