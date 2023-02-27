import { ContainerModuleClassMetadata } from './ContainerModuleClassMetadata';
import { ContainerModuleFactoryMetadata } from './ContainerModuleFactoryMetadata';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ContainerModuleMetadata<TArgs extends unknown[] = any[]> =
  | ContainerModuleFactoryMetadata<TArgs>
  | ContainerModuleClassMetadata;
