import { Newable } from '@cuaklabs/iocuak-common';

export interface ClassMetadataExtensionApi {
  extendConstructorArguments?: boolean;
  extendProperties?: boolean;
  type: Newable;
}
