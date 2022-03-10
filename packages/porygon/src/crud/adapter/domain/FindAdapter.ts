export interface FindAdapter<TModel, TQuery> {
  find(query: TQuery): Promise<TModel[]>;
  findOne(query: TQuery): Promise<TModel | undefined>;
}
