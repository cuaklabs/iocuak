export type ParameterOrPropertyDecorator = (
  target: object,
  key: string | symbol | undefined,
  index?: number,
) => void;
