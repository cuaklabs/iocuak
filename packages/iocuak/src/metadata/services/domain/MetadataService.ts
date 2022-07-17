import { Newable } from '@cuaklabs/iocuak-common';

import { TypeBinding } from '../../../binding/models/domain/TypeBinding';

export interface MetadataService {
  getBindingMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): TypeBinding<TInstance, TArgs> | undefined;
}
