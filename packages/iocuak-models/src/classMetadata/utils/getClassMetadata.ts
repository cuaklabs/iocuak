import { Newable } from '@cuaklabs/iocuak-common';
import { getReflectMetadata } from '@cuaklabs/iocuak-reflect-metadata-utils';

import { classMetadataReflectKey } from '../../reflectMetadata/models/classMetadataReflectKey';
import { ClassMetadata } from '../models/ClassMetadata';
import { getDefaultClassMetadata } from './getDefaultClassMetadata';

export function getClassMetadata<TInstance, TArgs extends unknown[]>(
  type: Newable<TInstance, TArgs>,
): ClassMetadata {
  const classMetadata: ClassMetadata | undefined = getReflectMetadata(
    type,
    classMetadataReflectKey,
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
