export interface DeleteAdapter<TQuery> {
  delete(query: TQuery): Promise<void>;
}
