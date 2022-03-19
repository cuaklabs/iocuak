export interface UpdateEntityPort<TQuery> {
  update(query: TQuery): Promise<void>;
}
