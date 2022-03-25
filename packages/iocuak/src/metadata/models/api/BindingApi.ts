import { TypeBindingApi } from './TypeBindingApi';
import { ValueBindingApi } from './ValueBindingApi';

export type BindingApi<
  TInstance = unknown,
  TArgs extends unknown[] = unknown[],
> = TypeBindingApi<TInstance, TArgs> | ValueBindingApi<TInstance>;
