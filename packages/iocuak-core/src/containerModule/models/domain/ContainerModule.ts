import { BindingService } from '../../../binding/services/domain/BindingService';

export interface ContainerModule {
  load(containerBindingService: BindingService): void;
}
