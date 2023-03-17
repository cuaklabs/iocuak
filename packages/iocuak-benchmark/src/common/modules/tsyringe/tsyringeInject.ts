import { InjectionToken, inject } from 'tsyringe';

type ParameterOrPropertyDecorator = (
  target: object,
  key: string | symbol | undefined,
  index?: number,
) => void;

export const tsyringeInject: (
  token: InjectionToken,
) => ParameterOrPropertyDecorator = inject as (
  token: InjectionToken,
) => ParameterOrPropertyDecorator;
