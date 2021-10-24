import { Newable } from '../../../task/models/domain/Newable';

export interface ClassMetadataExtensionApi {
  extendConstructorArguments?: boolean;
  extendProperties?: boolean;
  type: Newable;
}
