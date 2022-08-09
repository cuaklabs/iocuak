import { BindingService } from '@cuaklabs/iocuak-core';

export interface ContainerModule {
  load(containerBindingService: BindingService): void;
}
