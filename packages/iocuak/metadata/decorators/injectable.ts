import { BindingApi } from '../../binding/models/api/BindingApi';
import { Binding } from '../../binding/models/domain/Binding';
import { Newable } from '../../task/models/domain/Newable';
import { ServiceId } from '../../task/models/domain/ServiceId';
import { TaskScope } from '../../task/models/domain/TaskScope';
import { MetadataKey } from '../models/domain/MetadataKey';

export function injectable(bindingApi?: BindingApi): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  const decorator: ClassDecorator = <TFunction extends Function>(
    target: TFunction,
  ): TFunction | void => {
    const bindingId: ServiceId =
      bindingApi?.id ?? (target as unknown as Newable);

    const bindingScope: TaskScope = bindingApi?.scope ?? TaskScope.transient;

    const binding: Binding = {
      id: bindingId,
      scope: bindingScope,
      type: target as unknown as Newable,
    };

    Reflect.defineMetadata(MetadataKey.injectable, binding, target);
  };

  return decorator;
}
