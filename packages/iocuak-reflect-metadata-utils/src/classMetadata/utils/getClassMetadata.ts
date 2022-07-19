import { Newable } from '@cuaklabs/iocuak-common';

import { MetadataKey } from '../../reflectMetadata/models/MetadataKey';
import { getReflectMetadata } from '../../reflectMetadata/utils/getReflectMetadata';
import { ClassMetadata } from '../models/ClassMetadata';
import { getDefaultClassMetadata } from './getDefaultClassMetadata';

export function getClassMetadata<TInstance, TArgs extends unknown[]>(
  type: Newable<TInstance, TArgs>,
): ClassMetadata {
  const classMetadata: ClassMetadata | undefined = getReflectMetadata(
    type,
    MetadataKey.inject,
  );

  let classMetadataClone: ClassMetadata;

  if (classMetadata === undefined) {
    classMetadataClone = getDefaultClassMetadata();
  } else {
    classMetadataClone = {
      constructorArguments: [...classMetadata.constructorArguments],
      properties: new Map(classMetadata.properties),
    };
  }

  return classMetadataClone;
}
