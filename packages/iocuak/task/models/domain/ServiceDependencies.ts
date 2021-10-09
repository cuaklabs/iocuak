export interface ServiceDependencies<TArgs extends unknown[] = unknown[]> {
  constructorArguments: TArgs;
  properties: Record<string, unknown>;
}
