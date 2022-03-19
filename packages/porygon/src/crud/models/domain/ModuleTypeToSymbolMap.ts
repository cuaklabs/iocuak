export type ModuleTypeToSymbolMap<
  TModuleType extends string | number | symbol,
> = {
  readonly [TKey in TModuleType]: symbol;
};
