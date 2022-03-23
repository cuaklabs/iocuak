import { Converter } from './Converter';

export type ConverterAsync<
  TInput = unknown,
  TOutput = unknown,
  TContext = void,
> = Converter<TInput, Promise<TOutput>, TContext>;
