export interface CreateEntityPort<TModel, TQuery> {
  insertOne(query: TQuery): Promise<TModel>;
}
