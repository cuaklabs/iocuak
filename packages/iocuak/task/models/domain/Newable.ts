export type Newable<
  TInstance = unknown,
  TArgs extends unknown[] = unknown[],
> = new (...args: TArgs) => TInstance;
