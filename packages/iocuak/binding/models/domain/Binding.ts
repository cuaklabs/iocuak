import { TypeBinding } from './TypeBinding';

export type Binding<
  TInstance = unknown,
  TArgs extends unknown[] = unknown[],
> = TypeBinding<TInstance, TArgs>;
