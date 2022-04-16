import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModule } from '../../../container/modules/domain/ContainerModule';

export interface ContainerModuleMetadata<
  TModule extends ContainerModule = ContainerModule,
  TArgs extends unknown[] = unknown[],
> {
  factory: (...args: TArgs) => TModule | Promise<TModule>;
  imports: ContainerModuleMetadata<ContainerModule>[];
  injects: ServiceId[];
}
