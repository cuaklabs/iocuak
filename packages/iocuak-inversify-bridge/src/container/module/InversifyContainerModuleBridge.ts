import {
  BindingScope,
  ClassMetadata,
  ContainerModule,
  ContainerService,
  MetadataProvider,
  MetadataService,
  Newable,
  ServiceId,
  TypeBinding,
} from '@cuaklabs/iocuak';
import {
  ContainerModule as InversifyContainerModule,
  inject as inversifyInject,
  injectable as inversifyInjectable,
  interfaces,
} from 'inversify';

export class InversifyContainerModuleBridge extends InversifyContainerModule {
  constructor(containerModule: ContainerModule) {
    const metadataService: MetadataService = MetadataProvider.build();

    const registry: interfaces.ContainerModuleCallBack = (
      inversifyBind: interfaces.Bind,
      inversifyUnbind: interfaces.Unbind,
    ): void => {
      const inversifyContainerService: ContainerService = {
        bind: <TInstance, TArgs extends unknown[]>(
          type: Newable<TInstance, TArgs>,
        ): void => {
          this.#bindBridge(inversifyBind, metadataService, type);
        },
        bindToValue: <TInstance>(
          serviceId: ServiceId,
          value: TInstance,
        ): void => {
          inversifyBind(serviceId).toConstantValue(value);
        },
        unbind: (serviceId: ServiceId): void => {
          inversifyUnbind(serviceId);
        },
      } as Partial<ContainerService> as ContainerService;

      containerModule.load(inversifyContainerService);
    };

    super(registry);
  }

  #bindBridge<TInstance, TArgs extends unknown[]>(
    inversifyBind: interfaces.Bind,
    metadataService: MetadataService,
    type: Newable<TInstance, TArgs>,
  ): void {
    const binding: TypeBinding<TInstance, TArgs> | undefined =
      metadataService.getBindingMetadata(type);

    if (binding === undefined) {
      throw new Error(`Unexpected binding for type "${type.name}"`);
    }

    const classMetadata: ClassMetadata = metadataService.getClassMetadata(type);

    inversifyInjectable()(binding.type);

    classMetadata.constructorArguments.forEach(
      (value: ServiceId, index: number): void => {
        inversifyInject(value)(binding.type, undefined, index);
      },
    );

    const prototype: Record<string | symbol, unknown> = Object.getPrototypeOf(
      binding.type,
    ) as Record<string | symbol, unknown>;

    for (const [property, serviceId] of classMetadata.properties) {
      inversifyInject(serviceId)(prototype, property);
    }

    const inversifyBindingTo: interfaces.BindingInWhenOnSyntax<TInstance> =
      inversifyBind<TInstance>(binding.id).to(
        binding.type as unknown as new (...args: never[]) => TInstance,
      );

    switch (binding.scope) {
      case BindingScope.request:
        inversifyBindingTo.inRequestScope();
        break;
      case BindingScope.singleton:
        inversifyBindingTo.inSingletonScope();
        break;
      case BindingScope.transient:
        inversifyBindingTo.inTransientScope();
        break;
    }
  }
}
