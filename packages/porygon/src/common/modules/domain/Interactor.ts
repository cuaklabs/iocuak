export interface Interactor<TInput, TOutput> {
  interact(input: TInput): TOutput;
}
