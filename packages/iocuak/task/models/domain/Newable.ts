export type Newable<TInstance, TArgs extends unknown[]> = new (
  ...args: TArgs
) => TInstance;
