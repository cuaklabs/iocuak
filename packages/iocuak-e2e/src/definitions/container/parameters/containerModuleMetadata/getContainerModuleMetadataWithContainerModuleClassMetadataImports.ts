import {
  ContainerModule,
  ContainerModuleBindingService,
  ContainerModuleClassMetadata,
  inject,
  injectable,
  Newable,
} from '@cuaklabs/iocuak';
import sinon from 'sinon';

import { getTypeServiceWithNoDependenciesParameter } from '../../../common/parameters/typeService/getTypeServiceWithNoDependenciesParameter';
import { TypeServiceParameter } from '../../../common/parameters/typeService/TypeServiceParameter';
import { ContainerModuleMetadataParameter } from './ContainerModuleMetadataParameter';
import { getContainerModuleMetadataWithModuleParameter } from './getContainerModuleMetadataWithModuleParameter';

export function getContainerModuleMetadataWithContainerModuleClassMetadataImports(): ContainerModuleMetadataParameter {
  const containerModuleClassMetadataParameter: ContainerModuleMetadataParameter<ContainerModuleClassMetadata> =
    getContainerModuleMetadataWithModuleParameter();

  const containerModuleClassMetadataParameterClass: Newable<ContainerModule> =
    containerModuleClassMetadataParameter.containerModuleMetadata.module;

  const typeServiceParameter: TypeServiceParameter =
    getTypeServiceWithNoDependenciesParameter();

  @injectable()
  class ContainerModuleClassMetadataParameterClass extends containerModuleClassMetadataParameterClass {
    public override load(
      containerModuleBindingService: ContainerModuleBindingService,
    ): void {
      super.load(containerModuleBindingService);

      containerModuleBindingService.bind(typeServiceParameter.service);
    }
  }

  const containerModuleClassMetadataParameterMetadata: ContainerModuleClassMetadata =
    {
      module: ContainerModuleClassMetadataParameterClass,
    };

  if (
    containerModuleClassMetadataParameter.containerModuleMetadata.imports !==
    undefined
  ) {
    containerModuleClassMetadataParameterMetadata.imports = [
      ...containerModuleClassMetadataParameter.containerModuleMetadata.imports,
    ];
  }

  containerModuleClassMetadataParameter.containerModuleMetadata =
    containerModuleClassMetadataParameterMetadata;

  const loadSpy: sinon.SinonSpy = sinon.spy();
  const spy: sinon.SinonSpy = sinon.spy();

  @injectable()
  class ContainerModuleClass implements ContainerModule {
    constructor(
      @inject(typeServiceParameter.binding.id)
      public readonly typeService: unknown,
    ) {
      spy(typeService);
    }

    public load(
      containerModuleBindingService: ContainerModuleBindingService,
    ): void {
      loadSpy(containerModuleBindingService);
    }
  }

  const containerModuleMetadata: ContainerModuleClassMetadata = {
    imports: [containerModuleClassMetadataParameter.containerModuleMetadata],
    module: ContainerModuleClass,
  };

  const containerModuleMetadaParameter: ContainerModuleMetadataParameter = {
    containerModuleMetadata,
    importParameters: [containerModuleClassMetadataParameter],
    loadSpy,
    spy,
  };

  return containerModuleMetadaParameter;
}
