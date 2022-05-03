import { ClassMetadataApi } from '../../models/api/ClassMetadataApi';
import { ClassMetadata } from '../../models/domain/ClassMetadata';

export function convertToClassMetadataApi(
  classMetadata: ClassMetadata,
): ClassMetadataApi {
  return {
    constructorArguments: [...classMetadata.constructorArguments],
    properties: new Map(classMetadata.properties),
  };
}
