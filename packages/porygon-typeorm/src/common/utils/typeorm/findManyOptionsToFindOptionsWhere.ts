import { FindManyOptions, FindOptionsWhere } from 'typeorm';

export function findManyOptionsToFindOptionsWhere<TModelDb>(
  findManyOptions: FindManyOptions<TModelDb>,
): FindOptionsWhere<TModelDb> {
  const findManyOptionsWhere:
    | FindOptionsWhere<TModelDb>
    | FindOptionsWhere<TModelDb>[]
    | undefined = findManyOptions.where;

  let findOptionsWhere: FindOptionsWhere<TModelDb>;

  if (Array.isArray(findManyOptionsWhere)) {
    findOptionsWhere =
      findOptionsWhereArrayToFindOptionsWhere(findManyOptionsWhere);
  } else {
    findOptionsWhere = findManyOptionsWhere ?? getDefaultFindOptionsWhere();
  }

  return findOptionsWhere;
}

function findOptionsWhereArrayToFindOptionsWhere<TModelDb>(
  findOptionsWhereArray: FindOptionsWhere<TModelDb>[],
): FindOptionsWhere<TModelDb> {
  if (findOptionsWhereArray.length === 1) {
    const [findOptionsWhere]: [FindOptionsWhere<TModelDb>] =
      findOptionsWhereArray as [FindOptionsWhere<TModelDb>];

    return findOptionsWhere;
  } else {
    throw new Error(
      'Unexpected multiple FindOptionsWhere inside FindManyOptions: operation not allowed',
    );
  }
}

function getDefaultFindOptionsWhere<TModelDb>(): FindOptionsWhere<TModelDb> {
  return {};
}
