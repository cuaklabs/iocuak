export interface Builder<TModel = unknown, TArgs extends unknown[] = []> {
  build(...args: TArgs): TModel;
}
