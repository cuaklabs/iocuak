import { Newable } from './models/Newable';
import { ServiceId } from './models/ServiceId';
import { Tag } from './models/Tag';
import { chain } from './utils/chain';
import { isFunction } from './utils/isFunction';
import { isPromiseLike } from './utils/isPromiseLike';

export type { Newable, Tag, ServiceId };

export { chain, isFunction, isPromiseLike };
