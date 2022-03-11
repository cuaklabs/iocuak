export type ModuleTypeToSymbolMap<
  TModuleType extends string | number | symbol,
> = {
  [TKey in TModuleType]: symbol;
};
