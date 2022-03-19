export interface Converter<
  TInput = unknown,
  TOutput = unknown,
  TContext = void,
> {
  convert(input: TInput, context: TContext): TOutput;
}
