import { ClassMetadata } from '../models/domain/ClassMetadata';

export function getDefaultClassMetadata(): ClassMetadata {
  return {
    constructorArguments: [],
    properties: new Map(),
  };
}
