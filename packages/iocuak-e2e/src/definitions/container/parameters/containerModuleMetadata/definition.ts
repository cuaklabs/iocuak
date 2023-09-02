import { defineParameterType } from '@cucumber/cucumber';

import { ContainerModuleMetadataParameter } from './ContainerModuleMetadataParameter';
import { getContainerModuleMetadataWithContainerModuleClassMetadataImports } from './getContainerModuleMetadataWithContainerModuleClassMetadataImports';
import { getContainerModuleMetadataWithContainerModuleFactoryMetadataImports } from './getContainerModuleMetadataWithContainerModuleFactoryMetadataImports';
import { getContainerModuleMetadataWithFactoryParameter } from './getContainerModuleMetadataWithFactoryParameter';
import { getContainerModuleMetadataWithModuleParameter } from './getContainerModuleMetadataWithModuleParameter';

function containerModuleParameterDefinitionTransformer(
  containerModuleMetadataType: string,
): ContainerModuleMetadataParameter {
  switch (containerModuleMetadataType) {
    case 'imports with container module class metadata':
      return getContainerModuleMetadataWithContainerModuleClassMetadataImports();
    case 'imports with container module factory metadata':
      return getContainerModuleMetadataWithContainerModuleFactoryMetadataImports();
    case 'factory':
      return getContainerModuleMetadataWithFactoryParameter();
    case 'module':
      return getContainerModuleMetadataWithModuleParameter();
    default:
      throw new Error(
        `No container module metadata of type "${containerModuleMetadataType}" could be provided`,
      );
  }
}

defineParameterType({
  name: 'containerModuleMetadata',
  regexp: /"container module metadata(?: (?:with) ([^"]+))?"/,
  transformer: containerModuleParameterDefinitionTransformer,
});
