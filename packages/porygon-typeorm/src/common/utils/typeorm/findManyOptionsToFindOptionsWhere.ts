import { FindManyOptions, FindOptionsWhere } from 'typeorm';

export function findManyOptionsToFindOptionsWhere<TModelDb>(
  findManyOptions: FindManyOptions<TModelDb>,
): FindOptionsWhere<TModelDb> {
  const findManyOptionsWhere:
    | FindOptionsWhere<TModelDb>
    | FindOptionsWhere<TModelDb>[]
    | undefined = findManyOptions.where;

  if (Array.isArray(findManyOptionsWhere)) {
    throw new Error(
      'Unexpected multiple FindOptionsWhere inside FindManyOptions: operation not allowed',
    );
  } else {
    return findManyOptionsWhere ?? {};
  }
}
