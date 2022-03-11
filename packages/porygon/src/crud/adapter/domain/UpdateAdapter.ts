export interface UpdateAdapter<TQuery> {
  update(query: TQuery): Promise<void>;
}
