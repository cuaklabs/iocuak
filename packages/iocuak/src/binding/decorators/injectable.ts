import { Newable } from '../../common/models/domain/Newable';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { MetadataKey } from '../../reflectMetadata/models/domain/MetadataKey';
import { bindingScopeApiToBindingScopeMap } from '../models/api/bindingScopeApiToBindingScopeMap';
import { InjectableOptionsApi } from '../models/api/InjectableOptionsApi';
import { BindingScope } from '../models/domain/BindingScope';
import { BindingType } from '../models/domain/BindingType';
import { TypeBinding } from '../models/domain/TypeBinding';
import { getDefaultBindingScope } from '../utils/domain/getDefaultBindingScope';

export function injectable(bindingApi?: InjectableOptionsApi): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const decorator: ClassDecorator = <TFunction extends Function>(
    target: TFunction,
  ): TFunction | void => {
    const bindingId: ServiceId =
      bindingApi?.id ?? (target as unknown as Newable);

    const bindingScope: BindingScope =
      bindingApi?.scope === undefined
        ? getDefaultBindingScope()
        : bindingScopeApiToBindingScopeMap[bindingApi.scope];

    const binding: TypeBinding = {
      bindingType: BindingType.type,
      id: bindingId,
      scope: bindingScope,
      tags: [],
      type: target as unknown as Newable,
    };

    Reflect.defineMetadata(MetadataKey.injectable, binding, target);
  };

  return decorator;
}
