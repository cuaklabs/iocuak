export interface Interactor<TInput, TOutput> {
  interact(input: TInput): Promise<TOutput>;
}
