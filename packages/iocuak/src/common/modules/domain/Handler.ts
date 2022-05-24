export interface Handler<TParams, TOutput> {
  handle(params: TParams): TOutput;
}
