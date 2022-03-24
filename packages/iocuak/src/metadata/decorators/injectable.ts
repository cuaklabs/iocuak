import { BindingType } from '../../binding/models/domain/BindingType';
import { TypeBinding } from '../../binding/models/domain/TypeBinding';
import { Newable } from '../../common/models/domain/Newable';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { taskScopeApiToTaskScopeMap } from '../../task/models/api/taskScopeApiToTaskScopeMap';
import { TaskScope } from '../../task/models/domain/TaskScope';
import { InjectableOptionsApi } from '../models/api/InjectableOptionsApi';
import { MetadataKey } from '../models/domain/MetadataKey';

export function injectable(bindingApi?: InjectableOptionsApi): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const decorator: ClassDecorator = <TFunction extends Function>(
    target: TFunction,
  ): TFunction | void => {
    const bindingId: ServiceId =
      bindingApi?.id ?? (target as unknown as Newable);

    const bindingScope: TaskScope =
      bindingApi?.scope === undefined
        ? TaskScope.transient
        : taskScopeApiToTaskScopeMap[bindingApi.scope];

    const binding: TypeBinding = {
      bindingType: BindingType.type,
      id: bindingId,
      scope: bindingScope,
      type: target as unknown as Newable,
    };

    Reflect.defineMetadata(MetadataKey.injectable, binding, target);
  };

  return decorator;
}
