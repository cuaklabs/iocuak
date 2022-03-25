import { Newable } from '../../common/models/domain/Newable';
import { ServiceId } from '../../common/models/domain/ServiceId';
import { taskScopeApiToTaskScopeMap } from '../../task/models/api/taskScopeApiToTaskScopeMap';
import { TaskScope } from '../../task/models/domain/TaskScope';
import { InjectableOptionsApi } from '../models/api/InjectableOptionsApi';
import { BindingType } from '../models/domain/BindingType';
import { MetadataKey } from '../models/domain/MetadataKey';
import { TypeBinding } from '../models/domain/TypeBinding';

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
