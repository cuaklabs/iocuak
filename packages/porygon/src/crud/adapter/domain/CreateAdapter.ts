export interface CreateAdapter<TModel, TQuery> {
  insertOne(query: TQuery): Promise<TModel>;
}
