import { Newable } from '@cuaklabs/iocuak-common';

import { Prototype } from '../models/Prototype';

export function getBaseType<TInstance, TArgs extends unknown[]>(
  type: Newable<TInstance, TArgs>,
): Newable | undefined {
  const prototype: Prototype | null = Object.getPrototypeOf(
    type.prototype,
  ) as Prototype | null;

  const baseType: Newable | undefined = prototype?.constructor;

  return baseType;
}
