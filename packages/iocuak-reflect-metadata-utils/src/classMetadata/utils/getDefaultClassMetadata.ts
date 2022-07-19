import { ClassMetadata } from '../models/ClassMetadata';

export function getDefaultClassMetadata(): ClassMetadata {
  return {
    constructorArguments: [],
    properties: new Map(),
  };
}
