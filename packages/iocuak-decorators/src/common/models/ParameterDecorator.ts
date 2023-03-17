export type ParameterDecorator = (
  target: object,
  key: string | symbol | undefined,
  index: number,
) => void;
