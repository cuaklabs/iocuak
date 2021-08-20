export interface Builder<TArgs extends unknown[], TModel> {
  build(...args: TArgs): TModel;
}
