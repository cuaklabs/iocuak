import { Newable } from '../../../common/models/domain/Newable';

export interface ClassMetadataExtensionApi {
  extendConstructorArguments?: boolean;
  extendProperties?: boolean;
  type: Newable;
}
