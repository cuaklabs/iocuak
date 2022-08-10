import { ContainerModuleClassMetadata } from '@cuaklabs/iocuak-core';

import { ContainerModuleFactoryMetadata } from './ContainerModuleFactoryMetadata';

export type ContainerModuleMetadata<TArgs extends unknown[] = unknown[]> =
  | ContainerModuleFactoryMetadata<TArgs>
  | ContainerModuleClassMetadata;
