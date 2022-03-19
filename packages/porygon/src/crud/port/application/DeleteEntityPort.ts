export interface DeleteEntityPort<TQuery> {
  delete(query: TQuery): Promise<void>;
}
