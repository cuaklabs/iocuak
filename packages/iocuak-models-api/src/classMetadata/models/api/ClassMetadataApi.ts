import { ClassElementMetadataApi } from './ClassElementMetadataApi';

export interface ClassMetadataApi {
  constructorArguments: ClassElementMetadataApi[];
  properties: Map<string | symbol, ClassElementMetadataApi>;
}
