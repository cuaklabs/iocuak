import { Newable } from '@cuaklabs/iocuak-common';
import { getReflectMetadata, MetadataKey } from '@cuaklabs/iocuak-metadata';

import { TypeBinding } from '../../../binding/models/domain/TypeBinding';
import { MetadataService } from './MetadataService';

export class MetadataServiceImplementation implements MetadataService {
  public getBindingMetadata<TInstance, TArgs extends unknown[]>(
    type: Newable<TInstance, TArgs>,
  ): TypeBinding<TInstance, TArgs> | undefined {
    const binding: TypeBinding<TInstance, TArgs> | undefined =
      getReflectMetadata(type, MetadataKey.injectable);

    return binding;
  }
}
