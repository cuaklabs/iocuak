export interface ServiceDependencies<TArgs extends unknown[] = unknown[]> {
  constructorArguments: TArgs;
  properties: Map<string | symbol, unknown>;
}
