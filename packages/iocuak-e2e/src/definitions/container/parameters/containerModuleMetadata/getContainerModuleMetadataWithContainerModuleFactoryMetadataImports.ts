import {
  ContainerModule,
  ContainerModuleBindingService,
  ContainerModuleClassMetadata,
  ContainerModuleFactoryMetadata,
  inject,
  injectable,
} from '@cuaklabs/iocuak';
import sinon from 'sinon';

import { getTypeServiceWithNoDependenciesParameter } from '../../../common/parameters/typeService/getTypeServiceWithNoDependenciesParameter';
import { TypeServiceParameter } from '../../../common/parameters/typeService/TypeServiceParameter';
import { ContainerModuleMetadataParameter } from './ContainerModuleMetadataParameter';

export function getContainerModuleMetadataWithContainerModuleFactoryMetadataImports(): ContainerModuleMetadataParameter {
  const typeServiceParameter: TypeServiceParameter =
    getTypeServiceWithNoDependenciesParameter();

  const containerModuleFactoryMetadataParameterLoadSpy: sinon.SinonSpy =
    sinon.spy();

  const containerModuleFactoryMetadataParameterSpy: sinon.SinonSpy =
    sinon.spy();

  class ContainerModuleFactoryMetadataParameterClass {
    public load(
      containerModuleBindingService: ContainerModuleBindingService,
    ): void {
      containerModuleFactoryMetadataParameterLoadSpy(
        containerModuleBindingService,
      );

      containerModuleBindingService.bind(typeServiceParameter.service);
    }
  }

  const containerModuleClassMetadataParameterMetadata: ContainerModuleFactoryMetadata =
    {
      factory: () => {
        containerModuleFactoryMetadataParameterSpy();

        return new ContainerModuleFactoryMetadataParameterClass();
      },
    };

  const containerModuleFactoryMetadataParameter: ContainerModuleMetadataParameter =
    {
      containerModuleMetadata: containerModuleClassMetadataParameterMetadata,
      loadSpy: containerModuleFactoryMetadataParameterLoadSpy,
      spy: containerModuleFactoryMetadataParameterSpy,
    };

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
    imports: [containerModuleClassMetadataParameterMetadata],
    module: ContainerModuleClass,
  };

  const containerModuleMetadaParameter: ContainerModuleMetadataParameter = {
    containerModuleMetadata,
    importParameters: [containerModuleFactoryMetadataParameter],
    loadSpy,
    spy,
  };

  return containerModuleMetadaParameter;
}
