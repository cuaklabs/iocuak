import { ClassElementMetadata } from './ClassElementMetadata';

export interface ClassMetadata {
  constructorArguments: ClassElementMetadata[];
  properties: Map<string | symbol, ClassElementMetadata>;
}
