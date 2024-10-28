import { Newable, ServiceId, Tag } from '@cuaklabs/iocuak-common';
import {
  bindingReflectKey,
  BindingScope,
  BindingType,
  getDefaultBindingScope,
  TypeBinding,
} from '@cuaklabs/iocuak-models';
import { bindingScopeApiToBindingScopeMap } from '@cuaklabs/iocuak-models-api';

import { InjectableOptionsApi } from '../models/api/InjectableOptionsApi';

export function injectable(options?: InjectableOptionsApi): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  const decorator: ClassDecorator = <TFunction extends Function>(
    target: TFunction,
    // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  ): TFunction | void => {
    const bindingId: ServiceId = options?.id ?? (target as unknown as Newable);

    const binding: TypeBinding = {
      bindingType: BindingType.type,
      id: bindingId,
      scope: getBindingScope(options),
      tags: getTags(options),
      type: target as unknown as Newable,
    };

    Reflect.defineMetadata(bindingReflectKey, binding, target);
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
