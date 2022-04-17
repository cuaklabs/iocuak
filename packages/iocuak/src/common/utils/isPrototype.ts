import { Prototype } from '../models/domain/Prototype';

export function isPrototype(value: unknown): value is Prototype {
  return (
    typeof value === 'object' &&
    typeof (value as Prototype).constructor === 'function'
  );
}
