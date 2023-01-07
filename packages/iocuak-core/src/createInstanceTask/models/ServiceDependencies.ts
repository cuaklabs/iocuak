export interface ServiceDependencies<TArgs extends unknown[] = unknown[]> {
  readonly constructorArguments: TArgs;
  readonly properties: Map<string | symbol, unknown>;
}
