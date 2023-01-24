import { mapIterator } from './common/actions/mapIterator';
import { chain } from './common/calculations/chain';
import { isFunction } from './common/calculations/isFunction';
import { isPromiseLike } from './common/calculations/isPromiseLike';
import { mapIterable } from './common/calculations/mapIterable';
import { Newable } from './common/models/Newable';
import { ContainerModuleMetadataId } from './containerModuleMetadata/models/ContainerModuleMetadataId';
import { stringifyServiceId } from './service/calculations/stringifyServiceId';
import { ServiceId } from './service/models/ServiceId';
import { Tag } from './service/models/Tag';

export type { ContainerModuleMetadataId, Newable, Tag, ServiceId };

export {
  chain,
  isFunction,
  isPromiseLike,
  mapIterable,
  mapIterator,
  stringifyServiceId,
};
