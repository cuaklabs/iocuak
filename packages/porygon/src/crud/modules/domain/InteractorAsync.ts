import { Interactor } from './Interactor';

export type InteractorAsync<TInput, TOutput> = Interactor<
  TInput,
  Promise<TOutput>
>;
