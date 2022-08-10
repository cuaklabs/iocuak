import { BindingService } from '../../binding/services/BindingService';

export interface ContainerModule {
  load(containerBindingService: BindingService): void;
}
