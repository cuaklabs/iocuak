import { Newable, ServiceId, Tag } from '@cuaklabs/iocuak-common';
import { MetadataKey } from '@cuaklabs/iocuak-reflect-metadata-utils';

import { bindingScopeApiToBindingScopeMap } from '../models/api/bindingScopeApiToBindingScopeMap';
import { InjectableOptionsApi } from '../models/api/InjectableOptionsApi';
import { BindingScope } from '../models/domain/BindingScope';
import { BindingType } from '../models/domain/BindingType';
import { TypeBinding } from '../models/domain/TypeBinding';
import { getDefaultBindingScope } from '../utils/domain/getDefaultBindingScope';

export function injectable(options?: InjectableOptionsApi): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const decorator: ClassDecorator = <TFunction extends Function>(
    target: TFunction,
  ): TFunction | void => {
    const bindingId: ServiceId = options?.id ?? (target as unknown as Newable);

    const binding: TypeBinding = {
      bindingType: BindingType.type,
      id: bindingId,
      scope: getBindingScope(options),
      tags: getTags(options),
      type: target as unknown as Newable,
    };

    Reflect.defineMetadata(MetadataKey.injectable, binding, target);
  };

  return decorator;
}

function getBindingScope(options?: InjectableOptionsApi): BindingScope {
  const bindingScope: BindingScope =
    options?.scope === undefined
      ? getDefaultBindingScope()
      : bindingScopeApiToBindingScopeMap[options.scope];

  return bindingScope;
}

function getTags(options?: InjectableOptionsApi): Tag[] {
  const tagOrTags: Tag | Tag[] = options?.tags ?? [];

  let tags: Tag[];

  if (Array.isArray(tagOrTags)) {
    tags = tagOrTags;
  } else {
    tags = [tagOrTags];
  }

  return tags;
}
