import { TypeBinding } from './TypeBinding';
import { ValueBinding } from './ValueBinding';

export type Binding<TInstance = unknown, TArgs extends unknown[] = unknown[]> =
  | TypeBinding<TInstance, TArgs>
  | ValueBinding<TInstance>;
