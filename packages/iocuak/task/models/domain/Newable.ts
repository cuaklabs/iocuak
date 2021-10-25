export type Newable<
  TInstance = unknown,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TArgs extends unknown[] = any[],
> = new (...args: TArgs) => TInstance;
