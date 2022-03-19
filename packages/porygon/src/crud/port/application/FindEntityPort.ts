export interface FindEntityPort<TModel, TQuery> {
  find(query: TQuery): Promise<TModel[]>;
  findOne(query: TQuery): Promise<TModel | undefined>;
}
